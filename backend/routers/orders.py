from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
import random
import string
import asyncio
from database import get_db
from models import Order, OrderItem, Product, Customer
from schemas import OrderCreateSchema, OrderSchema
from routers.websocket import manager

router = APIRouter(prefix="/api", tags=["orders"])

def generate_order_number(prefix="KS"):
    rand_digits = ''.join(random.choices(string.digits, k=5))
    return f"{prefix}-{rand_digits}"

@router.post("/orders", response_model=OrderSchema)
async def create_order(
    payload: OrderCreateSchema,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    is_rashan_slip = payload.order_type == "MONTHLY_RASHAN_SLIP"
    if not is_rashan_slip and not payload.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    subtotal = 0.0
    order_items_to_create = []

    if payload.items:
        for item_req in payload.items:
            product = db.query(Product).filter(Product.id == item_req.product_id).first()
            if not product:
                # Custom item or direct list item
                effective_price = 100.0
                order_items_to_create.append({
                    "product_id": item_req.product_id,
                    "product_name": f"Monthly Item #{item_req.product_id}",
                    "quantity": item_req.quantity,
                    "price": effective_price,
                    "image_url": "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80"
                })
                subtotal += effective_price * item_req.quantity
                continue

            if not product.in_stock or product.stock < item_req.quantity:
                # Still allow rashan order if stock is tracked loosely
                pass

            effective_price = product.discount_price if product.discount_price else product.price
            item_total = effective_price * item_req.quantity
            subtotal += item_total

            # Deduct stock if available
            if product.stock >= item_req.quantity:
                product.stock -= item_req.quantity

            order_items_to_create.append({
                "product_id": product.id,
                "product_name": product.name,
                "quantity": item_req.quantity,
                "price": effective_price,
                "image_url": product.image_url
            })

    if is_rashan_slip:
        subtotal = payload.estimated_amount or 0.0
        delivery_fee = 0.0
        handling_fee = 0.0
        total_amount = subtotal
    else:
        delivery_fee = 15.0 if subtotal < 199 else 0.0
        handling_fee = 2.0
        total_amount = max(0.0, subtotal + delivery_fee + handling_fee + payload.tip - payload.discount)

    order_num = generate_order_number("RASHAN" if is_rashan_slip else "KS")

    new_order = Order(
        order_number=order_num,
        user_name=payload.user_name,
        phone=payload.phone,
        delivery_address=payload.delivery_address,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        handling_fee=handling_fee,
        tip=payload.tip,
        discount=payload.discount,
        total_amount=total_amount,
        payment_method=payload.payment_method,
        payment_status="PENDING_VERIFICATION" if is_rashan_slip else "PAID",
        order_status="PLACED",
        delivery_slot_type=payload.delivery_slot_type or "SAME_DAY",
        scheduled_delivery_date=payload.scheduled_delivery_date,
        scheduled_delivery_time=payload.scheduled_delivery_time,
        order_type=payload.order_type or "NORMAL",
        hub_name=payload.hub_name or "Sector 62 Express Dark Store",
        slip_image_url=payload.slip_image_url,
        special_instructions=payload.special_instructions,
        accepted_by_owner=False,
        eta_minutes=30
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    for item_data in order_items_to_create:
        item = OrderItem(order_id=new_order.id, **item_data)
        db.add(item)

    # Automatically Sync or Create Customer in database
    try:
        clean_p = payload.phone.replace("+91", "").replace(" ", "").strip()
        existing_cust = db.query(Customer).filter(Customer.phone.like(f"%{clean_p}%")).first()
        if existing_cust:
            existing_cust.name = payload.user_name
            existing_cust.address = payload.delivery_address
            existing_cust.total_orders = (existing_cust.total_orders or 0) + 1
            existing_cust.total_spent = (existing_cust.total_spent or 0.0) + total_amount
        else:
            new_cust = Customer(
                name=payload.user_name,
                phone=payload.phone,
                email=f"{clean_p}@kiranastore.com",
                address=payload.delivery_address,
                wallet_balance=100.0,
                total_orders=1,
                total_spent=total_amount,
                status="ACTIVE"
            )
            db.add(new_cust)
    except Exception as e:
        print("Customer sync error:", e)

    db.commit()
    db.refresh(new_order)

    # Broadcast to admin and customer sockets
    try:
        await manager.broadcast_order_update(order_num, {
            "order_number": order_num,
            "order_status": "PLACED",
            "order_type": new_order.order_type,
            "hub_name": new_order.hub_name,
            "message": "New Monthly Rashan Order received! 🛒"
        })
    except Exception:
        pass

    return new_order

@router.get("/orders/{order_number}", response_model=OrderSchema)
def get_order_by_number(order_number: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

from schemas import OrderCreateSchema, OrderSchema, CustomerCreateSchema, CustomerSchema

@router.post("/customers", response_model=CustomerSchema)
def register_or_sync_customer(payload: CustomerCreateSchema, db: Session = Depends(get_db)):
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

from models import Order, OrderItem, Product, Customer, SupportTicket
from schemas import OrderCreateSchema, OrderSchema, CustomerCreateSchema, CustomerSchema, SupportTicketCreateSchema, SupportTicketSchema

@router.get("/orders", response_model=List[OrderSchema])
def list_orders(phone: Optional[str] = None, db: Session = Depends(get_db)):
    if not phone:
        # Fallback to returning recent orders
        return db.query(Order).order_by(Order.created_at.desc()).limit(30).all()

    # Match normalized 10-digit phone
    clean_digits = ''.join(c for c in phone if c.isdigit())
    if len(clean_digits) >= 10:
        match_phone = clean_digits[-10:]
    elif clean_digits:
        match_phone = clean_digits
    else:
        return db.query(Order).order_by(Order.created_at.desc()).limit(30).all()

    orders = db.query(Order).filter(Order.phone.like(f"%{match_phone}%")).order_by(Order.created_at.desc()).limit(50).all()
    return orders

@router.post("/orders/{order_id_or_number}/rate", response_model=OrderSchema)
def rate_order(order_id_or_number: str, payload: OrderRateSchema, db: Session = Depends(get_db)):
    if order_id_or_number.isdigit():
        order = db.query(Order).filter(Order.id == int(order_id_or_number)).first()
    else:
        order = db.query(Order).filter(Order.order_number == order_id_or_number).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.rating = payload.rating
    order.rating_comment = payload.comment
    db.commit()
    db.refresh(order)
    return order

@router.post("/orders/{order_id_or_number}/cancel", response_model=OrderSchema)
def cancel_order(order_id_or_number: str, db: Session = Depends(get_db)):
    if order_id_or_number.isdigit():
        order = db.query(Order).filter(Order.id == int(order_id_or_number)).first()
    else:
        order = db.query(Order).filter(Order.order_number == order_id_or_number).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = "CANCELLED"
    db.commit()
    db.refresh(order)
    return order

@router.post("/orders/{order_id_or_number}/refund", response_model=OrderSchema)
def refund_order(order_id_or_number: str, db: Session = Depends(get_db)):
    if order_id_or_number.isdigit():
        order = db.query(Order).filter(Order.id == int(order_id_or_number)).first()
    else:
        order = db.query(Order).filter(Order.order_number == order_id_or_number).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order.order_status = "REFUNDED"
    order.payment_status = "REFUNDED_TO_WALLET"
    db.commit()
    db.refresh(order)
    return order

@router.get("/notifications", response_model=List[NotificationSchema])
def list_notifications(db: Session = Depends(get_db)):
    notifs = db.query(Notification).filter(Notification.is_active == True).order_by(Notification.created_at.desc()).limit(20).all()
    return notifs

@router.post("/support/tickets", response_model=SupportTicketSchema)
async def create_support_ticket(payload: SupportTicketCreateSchema, db: Session = Depends(get_db)):
    rand_id = f"TICK-{random.randint(100, 999)}"
    ticket = SupportTicket(
        ticket_id=rand_id,
        customer_name=payload.customer_name,
        phone=payload.phone,
        order_number=payload.order_number,
        category=payload.category or "General Inquiry",
        subject=payload.subject,
        message=payload.message,
        status="OPEN",
        priority="HIGH"
    )
    db.add(ticket)
    db.commit()
    db.refresh(ticket)
    return ticket

from models import ChatMessage
from schemas import ChatMessageCreateSchema, ChatMessageSchema

@router.get("/support/chat", response_model=List[ChatMessageSchema])
def get_chat_messages(phone: Optional[str] = None, ticket_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ChatMessage)
    if ticket_id:
        query = query.filter(ChatMessage.ticket_id == ticket_id)
    elif phone:
        clean = phone.replace("+91", "").replace(" ", "").strip()
        query = query.filter(ChatMessage.phone.like(f"%{clean}%"))
    return query.order_by(ChatMessage.created_at.asc()).all()

@router.post("/support/chat", response_model=ChatMessageSchema)
def send_chat_message(payload: ChatMessageCreateSchema, db: Session = Depends(get_db)):
    clean_p = payload.phone.replace("+91", "").replace(" ", "").strip() if payload.phone else "9876543210"
    msg = ChatMessage(
        ticket_id=payload.ticket_id or f"LIVE-{clean_p[-10:]}",
        phone=payload.phone or "+91 9876543210",
        customer_name=payload.customer_name or "Customer",
        sender=payload.sender,
        text=payload.text
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

