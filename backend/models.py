from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    slug = Column(String, nullable=False, unique=True)
    icon = Column(String, nullable=True) # Emoji or icon key
    image_url = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    name = Column(String, nullable=False, index=True)
    weight_unit = Column(String, nullable=False) # e.g. "500 g", "1 L", "1 pack"
    price = Column(Float, nullable=False)
    discount_price = Column(Float, nullable=True) # If null, no discount
    stock = Column(Integer, default=50)
    in_stock = Column(Boolean, default=True)
    image_url = Column(String, nullable=False)
    description = Column(String, nullable=True)
    rating = Column(Float, default=4.5)
    eta_badge = Column(String, default="10 Mins")

    category = relationship("Category", back_populates="products")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String, unique=True, index=True)
    user_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    delivery_address = Column(String, nullable=False)
    subtotal = Column(Float, nullable=False)
    delivery_fee = Column(Float, default=15.0)
    handling_fee = Column(Float, default=2.0)
    tip = Column(Float, default=0.0)
    discount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False)
    payment_method = Column(String, default="UPI") # UPI, CARD, COD
    payment_status = Column(String, default="PAID")
    order_status = Column(String, default="PLACED") # PLACED, CONFIRMED, PACKING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    delivery_slot_type = Column(String, default="SAME_DAY") # SAME_DAY, NEXT_DAY, SCHEDULED
    scheduled_delivery_date = Column(String, nullable=True) # e.g. "Today, 20 Aug" or "Tomorrow, 21 Aug"
    scheduled_delivery_time = Column(String, nullable=True) # e.g. "5:00 PM - 8:00 PM"
    accepted_by_owner = Column(Boolean, default=False)
    eta_minutes = Column(Integer, default=30)
    order_type = Column(String, default="NORMAL") # NORMAL, MONTHLY_RASHAN_SLIP, MONTHLY_RASHAN_LIST
    hub_name = Column(String, nullable=True) # e.g. "Sector 62 Express Dark Store"
    slip_image_url = Column(String, nullable=True) # Photo/Base64 of handwritten slip
    special_instructions = Column(String, nullable=True)
    rating = Column(Integer, nullable=True)
    rating_comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    product_id = Column(Integer, nullable=False)
    product_name = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)
    image_url = Column(String, nullable=True)

    order = relationship("Order", back_populates="items")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=True)
    address = Column(String, nullable=True)
    wallet_balance = Column(Float, default=100.0)
    total_orders = Column(Integer, default=0)
    total_spent = Column(Float, default=0.0)
    status = Column(String, default="ACTIVE") # ACTIVE, BLOCKED
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, unique=True, index=True) # e.g. "TICK-402"
    customer_name = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    order_number = Column(String, nullable=True)
    category = Column(String, default="General Inquiry")
    subject = Column(String, nullable=False)
    message = Column(String, nullable=False)
    status = Column(String, default="OPEN") # OPEN, IN_PROGRESS, RESOLVED
    priority = Column(String, default="HIGH") # NORMAL, HIGH, URGENT
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    desc = Column(String, nullable=False)
    type = Column(String, default="ORDERS") # ORDERS, OFFERS, WALLET, SYSTEM
    time = Column(String, default="Just now")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
