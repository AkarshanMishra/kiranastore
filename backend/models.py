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

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(String, index=True, nullable=True) # e.g. "TICK-402" or customer phone
    phone = Column(String, nullable=True, index=True)
    customer_name = Column(String, nullable=True)
    sender = Column(String, nullable=False) # "customer" or "support"
    text = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


# ---------------------------------------------------------------
# CMS CONTENT MODELS - power the customer app sections that the
# admin dashboard manages (banners, flash deals, brands, coupons).
# ---------------------------------------------------------------
class Banner(Base):
    """Homepage hero banner carousel (managed by Admin -> Content Mgmt)."""
    __tablename__ = "banners"

    id = Column(Integer, primary_key=True, index=True)
    badge = Column(String, nullable=True)
    headline = Column(String, nullable=False)
    subtext = Column(String, nullable=True)
    cta = Column(String, nullable=True)
    perk = Column(String, nullable=True)
    icon = Column(String, nullable=True)
    bg_gradient = Column(String, nullable=True)
    accent_border = Column(String, nullable=True)
    badge_color = Column(String, nullable=True)
    cta_target = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class FlashDeal(Base):
    """Flash-sale deal cards shown on the customer home page."""
    __tablename__ = "flash_deals"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)       # e.g. "Amul Desi Ghee 1L"
    discount_label = Column(String, nullable=True)   # e.g. "₹41 OFF"
    tag = Column(String, nullable=True)              # e.g. "Bestseller"
    price_label = Column(String, nullable=True)      # e.g. "₹589"
    mrp_label = Column(String, nullable=True)        # e.g. "₹630"
    image_url = Column(String, nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Brand(Base):
    """FMCG brand tiles shown in the 'Shop by Official Brands' section."""
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)   # e.g. "Amul"
    logo = Column(String, nullable=True)                 # emoji or image url
    category = Column(String, nullable=True)             # e.g. "Dairy & Beverages"
    origin = Column(String, nullable=True)               # HQ location
    logo_text = Column(String, nullable=True)             # short text logo
    sort_order = Column(Integer, default=0)
    is_featured = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class Coupon(Base):
    """Promo coupon codes displayed in the customer Offers tab."""
    __tablename__ = "coupons"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, nullable=False, unique=True)    # e.g. "WELCOME100"
    tag = Column(String, nullable=True)                  # e.g. "NEW USER"
    discount_label = Column(String, nullable=True)       # e.g. "FLAT ₹100 OFF"
    desc = Column(String, nullable=True)                 # e.g. "On orders above ₹499"
    discount_type = Column(String, default="FLAT")       # FLAT | PERCENT
    discount_value = Column(Float, default=0)             # number used for checkout math
    min_order = Column(Float, default=0)                  # minimun basket value
    max_discount = Column(Float, default=0)               # 0 means no cap
    valid_till = Column(String, nullable=True)
    first_order_only = Column(Boolean, default=False)
    usage_limit = Column(Integer, default=1000)
    used_count = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AppSetting(Base):
    """Single-row / key-value app-wide settings (announcement ticker, etc)."""
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, nullable=False, unique=True)     # e.g. "announcement"
    value = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AdminUser(Base):
    """System & administrative team accounts."""
    __tablename__ = "admin_users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    role = Column(String, default="Store Manager") # Super Admin, Store Manager, Order Manager, Inventory Manager, Delivery Manager, Finance Lead, Security Officer
    permissions = Column(String, default="All Standard Modules")
    status = Column(String, default="ACTIVE") # ACTIVE, SUSPENDED, INVITED
    last_login = Column(String, default="Just now")
    two_factor_enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class AuditLog(Base):
    """Immutable audit trail of administrative actions."""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    log_id = Column(String, unique=True, index=True) # e.g. "LOG-9482"
    actor = Column(String, nullable=False)           # e.g. "Super Admin (Akarshan)"
    action = Column(String, nullable=False)          # e.g. "PRICE_UPDATE", "STOCK_RESTOCK"
    category = Column(String, default="OPERATIONS")  # AUTH, ORDERS, INVENTORY, SECURITY, SYSTEM
    target = Column(String, nullable=False)          # e.g. "Aashirvaad Atta 5kg"
    details = Column(String, nullable=True)
    ip_address = Column(String, default="106.210.84.192")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))


class IntegrationConfig(Base):
    """API credentials & webhook configs for external integrations."""
    __tablename__ = "integration_configs"

    id = Column(Integer, primary_key=True, index=True)
    integration_id = Column(String, unique=True, index=True) # e.g. "razorpay", "whatsapp"
    name = Column(String, nullable=False)
    desc = Column(String, nullable=True)
    key_id = Column(String, nullable=True)
    secret_key = Column(String, nullable=True)
    webhook_url = Column(String, nullable=True)
    category = Column(String, default="PAYMENTS") # PAYMENTS, MESSAGING, LOCATION, SMS, NOTIFICATIONS, ANALYTICS
    environment = Column(String, default="PRODUCTION") # SANDBOX, PRODUCTION
    status = Column(String, default="CONNECTED") # CONNECTED, PAUSED, ERROR
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

