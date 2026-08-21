from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Order, Product, OrderItem, Customer
from schemas import (
    OrderSchema,
    OrderStatusUpdateSchema,
    OrderAcceptScheduleSchema,
    OrderItemizeSchema,
    ProductSchema,
    ProductCreateUpdateSchema,
    CustomerSchema,
    CustomerCreateSchema,
    CustomerUpdateSchema
)
from routers.websocket import manager

router = APIRouter(prefix="/api/admin", tags=["admin"])

@router.get("/customers", response_model=List[CustomerSchema])
def get_all_admin_customers(db: Session = Depends(get_db)):
    return db.query(Customer).order_by(Customer.created_at.desc()).all()

@router.post("/customers", response_model=CustomerSchema)
def create_admin_customer(payload: CustomerCreateSchema, db: Session = Depends(get_db)):
    clean_p = payload.phone.replace("+91", "").replace(" ", "").strip()
    existing = db.query(Customer).filter(Customer.phone.like(f"%{clean_p}%")).first()
    if existing:
        existing.name = payload.name
        if payload.email:
            existing.email = payload.email
        if payload.address:
            existing.address = payload.address
        db.commit()
        db.refresh(existing)
        return existing

    new_cust = Customer(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        address=payload.address,
        wallet_balance=payload.wallet_balance or 100.0,
        total_orders=0,
        total_spent=0.0,
        status="ACTIVE"
    )
    db.add(new_cust)
    db.commit()
    db.refresh(new_cust)
    return new_cust

@router.patch("/customers/{customer_id}", response_model=CustomerSchema)
def update_admin_customer(customer_id: int, payload: CustomerUpdateSchema, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(customer, key, value)

    db.commit()
    db.refresh(customer)
    return customer

@router.delete("/customers/{customer_id}")
def delete_admin_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    db.delete(customer)
    db.commit()
    return {"message": "Customer deleted successfully"}

@router.get("/orders", response_model=List[OrderSchema])
def get_all_admin_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.created_at.desc()).all()

@router.patch("/orders/{order_number}/itemize", response_model=OrderSchema)
async def itemize_order_items(
    order_number: str,
    payload: OrderItemizeSchema,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Clear previous empty or temporary items
    db.query(OrderItem).filter(OrderItem.order_id == order.id).delete()

    # Add new itemized items
    subtotal_calc = 0.0
    for item_data in payload.items:
        item_tot = item_data.price * item_data.quantity
        subtotal_calc += item_tot
        new_item = OrderItem(
            order_id=order.id,
            product_id=item_data.product_id or 0,
            product_name=item_data.product_name,
            quantity=item_data.quantity,
            price=item_data.price,
            image_url=item_data.image_url
        )
        db.add(new_item)

    order.subtotal = subtotal_calc
    order.total_amount = payload.total_amount if payload.total_amount > 0 else subtotal_calc
    if payload.order_status:
        order.order_status = payload.order_status
        if payload.order_status == "CONFIRMED":
            order.accepted_by_owner = True
    if payload.scheduled_delivery_date:
        order.scheduled_delivery_date = payload.scheduled_delivery_date
    if payload.scheduled_delivery_time:
        order.scheduled_delivery_time = payload.scheduled_delivery_time

    db.commit()
    db.refresh(order)

    # Broadcast updated items and bill to customer app
    await manager.broadcast_order_update(order_number, {
        "order_number": order_number,
        "order_status": order.order_status,
        "total_amount": order.total_amount,
        "scheduled_delivery_date": order.scheduled_delivery_date,
        "scheduled_delivery_time": order.scheduled_delivery_time,
        "message": f"Dark store has prepared your itemized bill! Total: ₹{order.total_amount:.0f}"
    })

    return order

@router.patch("/orders/{order_number}/accept", response_model=OrderSchema)
async def accept_and_schedule_order(
    order_number: str,
    payload: OrderAcceptScheduleSchema,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = "CONFIRMED"
    order.accepted_by_owner = True
    order.scheduled_delivery_date = payload.scheduled_delivery_date
    order.scheduled_delivery_time = payload.scheduled_delivery_time
    if payload.total_amount is not None and payload.total_amount > 0:
        order.total_amount = payload.total_amount
        order.subtotal = payload.total_amount

    db.commit()
    db.refresh(order)

    # Broadcast real-time acceptance & scheduled delivery date/time to customer app via WebSocket
    await manager.broadcast_order_update(order_number, {
        "order_number": order_number,
        "order_status": "CONFIRMED",
        "accepted_by_owner": True,
        "total_amount": order.total_amount,
        "scheduled_delivery_date": order.scheduled_delivery_date,
        "scheduled_delivery_time": order.scheduled_delivery_time,
        "message": f"Shopkeeper accepted order! Delivery scheduled for {order.scheduled_delivery_date} ({order.scheduled_delivery_time})"
    })

    return order

@router.patch("/orders/{order_number}/status", response_model=OrderSchema)
async def update_order_status(
    order_number: str,
    payload: OrderStatusUpdateSchema,
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = payload.order_status
    if payload.scheduled_delivery_date:
        order.scheduled_delivery_date = payload.scheduled_delivery_date
    if payload.scheduled_delivery_time:
        order.scheduled_delivery_time = payload.scheduled_delivery_time

    db.commit()
    db.refresh(order)

    # Broadcast real-time status change to customer app via WebSocket
    await manager.broadcast_order_update(order_number, {
        "order_number": order_number,
        "order_status": order.order_status,
        "accepted_by_owner": order.accepted_by_owner,
        "scheduled_delivery_date": order.scheduled_delivery_date,
        "scheduled_delivery_time": order.scheduled_delivery_time,
        "message": f"Order status updated to {order.order_status}"
    })

    return order

@router.post("/products", response_model=ProductSchema)
def add_product(payload: ProductCreateUpdateSchema, db: Session = Depends(get_db)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.patch("/products/{product_id}", response_model=ProductSchema)
def update_product_stock(
    product_id: int,
    payload: ProductCreateUpdateSchema,
    db: Session = Depends(get_db)
):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, key, value)

    db.commit()
    db.refresh(product)
    return product
