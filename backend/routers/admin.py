from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Order, Product, OrderItem, Customer, SupportTicket, Notification, ChatMessage, Category, AdminUser, AuditLog, IntegrationConfig, AppSetting
from schemas import (
    OrderSchema,
    OrderStatusUpdateSchema,
    OrderAcceptScheduleSchema,
    OrderItemizeSchema,
    ProductSchema,
    ProductCreateUpdateSchema,
    ProductUpdateSchema,
    CategorySchema,
    CustomerSchema,
    CustomerCreateSchema,
    CustomerUpdateSchema,
    SupportTicketSchema,
    NotificationCreateSchema,
    NotificationSchema,
    ChatMessageCreateSchema,
    ChatMessageSchema,
    AdminUserCreateSchema,
    AdminUserUpdateSchema,
    AdminUserSchema,
    AuditLogCreateSchema,
    AuditLogSchema,
    IntegrationConfigCreateSchema,
    IntegrationConfigSchema,
    AppSettingSchema
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
    payload: ProductUpdateSchema,
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

@router.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(product)
    db.commit()
    return {"message": "Product deleted from catalog successfully"}

# ======================= CATEGORIES CRUD =======================
@router.post("/categories", response_model=CategorySchema)
def create_admin_category(payload: dict, db: Session = Depends(get_db)):
    name = (payload.get("name") or "").strip()
    if not name:
        raise HTTPException(status_code=400, detail="Category name is required")
    slug = (payload.get("slug") or name.lower().replace(" ", "-")).strip()
    existing = db.query(Category).filter(Category.name == name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists")
    cat = Category(
        name=name,
        slug=slug,
        icon=payload.get("icon") or "📦",
        image_url=payload.get("image_url"),
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat

@router.patch("/categories/{category_id}", response_model=CategorySchema)
def update_admin_category(category_id: int, payload: dict, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    if "name" in payload and payload["name"]:
        cat.name = payload["name"]
    if "slug" in payload and payload["slug"]:
        cat.slug = payload["slug"]
    if "icon" in payload:
        cat.icon = payload["icon"] or cat.icon
    if "image_url" in payload:
        cat.image_url = payload["image_url"]
    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/categories/{category_id}")
def delete_admin_category(category_id: int, db: Session = Depends(get_db)):
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    # Re-assign products to no category (keep products browsable)
    db.query(Product).filter(Product.category_id == category_id).update(
        {"category_id": None}, synchronize_session=False
    )
    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully"}

@router.get("/support/tickets", response_model=List[SupportTicketSchema])
def get_all_support_tickets(db: Session = Depends(get_db)):
    return db.query(SupportTicket).order_by(SupportTicket.created_at.desc()).all()

@router.patch("/support/tickets/{ticket_id}")
def update_support_ticket(ticket_id: str, payload: dict, db: Session = Depends(get_db)):
    ticket = db.query(SupportTicket).filter(SupportTicket.ticket_id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    if "status" in payload:
        ticket.status = payload["status"]
    db.commit()
    db.refresh(ticket)
    return ticket

@router.get("/support/chats", response_model=List[ChatMessageSchema])
def get_all_support_chats(ticket_id: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(ChatMessage)
    if ticket_id:
        query = query.filter(ChatMessage.ticket_id == ticket_id)
    return query.order_by(ChatMessage.created_at.asc()).all()

@router.post("/support/chat", response_model=ChatMessageSchema)
def reply_support_chat(payload: ChatMessageCreateSchema, db: Session = Depends(get_db)):
    msg = ChatMessage(
        ticket_id=payload.ticket_id or "LIVE-SUPPORT",
        phone=payload.phone,
        customer_name="Store Support Executive",
        sender="support",
        text=payload.text
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg

@router.get("/notifications", response_model=List[NotificationSchema])
def get_admin_notifications(db: Session = Depends(get_db)):
    return db.query(Notification).order_by(Notification.created_at.desc()).all()

@router.post("/notifications", response_model=NotificationSchema)
def broadcast_notification(payload: NotificationCreateSchema, db: Session = Depends(get_db)):
    notif = Notification(
        title=payload.title,
        desc=payload.desc,
        type=payload.type or "ORDERS",
        time=payload.time or "Just now",
        is_active=True
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)
    return notif

@router.get("/reviews")
def get_all_reviews(db: Session = Depends(get_db)):
    rated_orders = db.query(Order).filter(Order.rating.isnot(None)).order_by(Order.created_at.desc()).all()
    results = []
    for ord in rated_orders:
        first_item_name = ord.items[0].product_name if ord.items else "Grocery Basket"
        results.append({
            "id": ord.id,
            "order_number": ord.order_number,
            "customer": ord.user_name,
            "phone": ord.phone,
            "product": first_item_name,
            "rating": ord.rating,
            "comment": ord.rating_comment or "Great delivery service and fresh items!",
            "date": ord.created_at.strftime("%d %b %Y"),
            "status": "APPROVED"
        })
    return results


# ======================= ADMIN USERS CRUD (RBAC & SECURITY) =======================
@router.get("/users", response_model=List[AdminUserSchema])
def get_all_admin_users(db: Session = Depends(get_db)):
    return db.query(AdminUser).order_by(AdminUser.created_at.asc()).all()

@router.post("/users", response_model=AdminUserSchema)
def create_admin_user(payload: AdminUserCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(AdminUser).filter(AdminUser.email == payload.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="Admin user with this email already exists")
    user = AdminUser(
        name=payload.name.strip(),
        email=payload.email.strip().lower(),
        role=payload.role or "Store Manager",
        permissions=payload.permissions or "All Standard Modules",
        status=payload.status or "ACTIVE",
        two_factor_enabled=payload.two_factor_enabled if payload.two_factor_enabled is not None else True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.patch("/users/{user_id}", response_model=AdminUserSchema)
def update_admin_user(user_id: int, payload: AdminUserUpdateSchema, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    if payload.name is not None:
        user.name = payload.name.strip()
    if payload.email is not None:
        user.email = payload.email.strip().lower()
    if payload.role is not None:
        user.role = payload.role
    if payload.permissions is not None:
        user.permissions = payload.permissions
    if payload.status is not None:
        user.status = payload.status
    if payload.two_factor_enabled is not None:
        user.two_factor_enabled = payload.two_factor_enabled
    db.commit()
    db.refresh(user)
    return user

@router.delete("/users/{user_id}")
def delete_admin_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(AdminUser).filter(AdminUser.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    db.delete(user)
    db.commit()
    return {"message": "Admin user deleted successfully"}


# ======================= AUDIT LOGS CRUD =======================
@router.get("/audit-logs", response_model=List[AuditLogSchema])
def get_all_audit_logs(db: Session = Depends(get_db)):
    return db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(200).all()

@router.post("/audit-logs", response_model=AuditLogSchema)
def create_audit_log(payload: AuditLogCreateSchema, db: Session = Depends(get_db)):
    import random
    log_id = f"LOG-{random.randint(1000, 9999)}"
    log = AuditLog(
        log_id=log_id,
        actor=payload.actor,
        action=payload.action,
        category=payload.category or "OPERATIONS",
        target=payload.target,
        details=payload.details,
        ip_address=payload.ip_address or "106.210.84.192"
    )
    db.add(log)
    db.commit()
    db.refresh(log)
    return log

@router.delete("/audit-logs")
def clear_audit_logs(db: Session = Depends(get_db)):
    db.query(AuditLog).delete()
    db.commit()
    return {"message": "Audit logs cleared"}


# ======================= INTEGRATIONS CRUD =======================
@router.get("/integrations", response_model=List[IntegrationConfigSchema])
def get_all_integrations(db: Session = Depends(get_db)):
    return db.query(IntegrationConfig).order_by(IntegrationConfig.created_at.asc()).all()

@router.post("/integrations", response_model=IntegrationConfigSchema)
def upsert_integration(payload: IntegrationConfigCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(IntegrationConfig).filter(IntegrationConfig.integration_id == payload.integration_id).first()
    if existing:
        existing.name = payload.name
        existing.desc = payload.desc
        existing.key_id = payload.key_id
        existing.secret_key = payload.secret_key
        existing.webhook_url = payload.webhook_url
        existing.category = payload.category
        existing.environment = payload.environment
        existing.status = payload.status
        db.commit()
        db.refresh(existing)
        return existing
    else:
        new_int = IntegrationConfig(
            integration_id=payload.integration_id,
            name=payload.name,
            desc=payload.desc,
            key_id=payload.key_id,
            secret_key=payload.secret_key,
            webhook_url=payload.webhook_url,
            category=payload.category,
            environment=payload.environment,
            status=payload.status
        )
        db.add(new_int)
        db.commit()
        db.refresh(new_int)
        return new_int

@router.delete("/integrations/{integration_id}")
def delete_integration(integration_id: str, db: Session = Depends(get_db)):
    item = db.query(IntegrationConfig).filter(IntegrationConfig.integration_id == integration_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Integration not found")
    db.delete(item)
    db.commit()
    return {"message": "Integration deleted successfully"}


# ======================= APP SETTINGS CRUD =======================
@router.get("/settings")
def get_admin_settings(db: Session = Depends(get_db)):
    settings = db.query(AppSetting).all()
    return {s.key: s.value for s in settings}

@router.post("/settings")
def save_admin_settings(payload: dict, db: Session = Depends(get_db)):
    for key, value in payload.items():
        if value is not None:
            existing = db.query(AppSetting).filter(AppSetting.key == key).first()
            if existing:
                existing.value = str(value)
            else:
                db.add(AppSetting(key=key, value=str(value)))
    db.commit()
    return {"message": "Settings saved successfully"}

