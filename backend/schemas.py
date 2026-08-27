from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CategorySchema(BaseModel):
    id: int
    name: str
    slug: str
    icon: Optional[str] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class ProductSchema(BaseModel):
    id: int
    category_id: Optional[int] = None
    name: str
    weight_unit: str
    price: float
    discount_price: Optional[float] = None
    stock: int
    in_stock: bool
    image_url: str
    description: Optional[str] = None
    rating: float
    eta_badge: str

    class Config:
        from_attributes = True

class ProductCreateUpdateSchema(BaseModel):
    category_id: int
    name: str
    weight_unit: str
    price: float
    discount_price: Optional[float] = None
    stock: int
    in_stock: bool = True
    image_url: str
    description: Optional[str] = None

class ProductUpdateSchema(BaseModel):
    category_id: Optional[int] = None
    name: Optional[str] = None
    weight_unit: Optional[str] = None
    price: Optional[float] = None
    discount_price: Optional[float] = None
    stock: Optional[int] = None
    in_stock: Optional[bool] = None
    image_url: Optional[str] = None
    description: Optional[str] = None

class OrderItemCreateSchema(BaseModel):
    product_id: int
    quantity: int

class OrderItemSchema(BaseModel):
    id: int
    product_id: int
    product_name: str
    quantity: int
    price: float
    image_url: Optional[str] = None

    class Config:
        from_attributes = True

class OrderCreateSchema(BaseModel):
    user_name: str
    phone: str
    delivery_address: str
    items: List[OrderItemCreateSchema] = []
    payment_method: str = "UPI" # UPI, CARD, COD, MONTHLY_AUTOPAY
    delivery_slot_type: Optional[str] = "SAME_DAY" # SAME_DAY, NEXT_DAY, TOMORROW, MONTHLY_1ST
    scheduled_delivery_date: Optional[str] = None
    scheduled_delivery_time: Optional[str] = None
    order_type: Optional[str] = "NORMAL" # NORMAL, MONTHLY_RASHAN_SLIP, MONTHLY_RASHAN_LIST
    hub_name: Optional[str] = None
    slip_image_url: Optional[str] = None
    special_instructions: Optional[str] = None
    tip: float = 0.0
    discount: float = 0.0
    estimated_amount: Optional[float] = None

class OrderSchema(BaseModel):
    id: int
    order_number: str
    user_name: str
    phone: str
    delivery_address: str
    subtotal: float
    delivery_fee: float
    handling_fee: float
    tip: float
    discount: float
    total_amount: float
    payment_method: str
    payment_status: str
    order_status: str
    delivery_slot_type: Optional[str] = "SAME_DAY"
    scheduled_delivery_date: Optional[str] = None
    scheduled_delivery_time: Optional[str] = None
    order_type: Optional[str] = "NORMAL"
    hub_name: Optional[str] = None
    slip_image_url: Optional[str] = None
    special_instructions: Optional[str] = None
    rating: Optional[int] = None
    rating_comment: Optional[str] = None
    accepted_by_owner: Optional[bool] = False
    eta_minutes: int
    created_at: datetime
    items: List[OrderItemSchema] = []

    class Config:
        from_attributes = True

class OrderRateSchema(BaseModel):
    rating: int
    comment: Optional[str] = None

class OrderStatusUpdateSchema(BaseModel):
    order_status: str # PLACED, CONFIRMED, PACKING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED
    scheduled_delivery_date: Optional[str] = None
    scheduled_delivery_time: Optional[str] = None
    total_amount: Optional[float] = None

class OrderAcceptScheduleSchema(BaseModel):
    order_status: str = "CONFIRMED"
    scheduled_delivery_date: str
    scheduled_delivery_time: str
    total_amount: Optional[float] = None

class OrderItemInputSchema(BaseModel):
    product_id: Optional[int] = 0
    product_name: str
    quantity: int = 1
    price: float = 0.0
    image_url: Optional[str] = None

class OrderItemizeSchema(BaseModel):
    items: List[OrderItemInputSchema]
    total_amount: float
    order_status: Optional[str] = "CONFIRMED"
    scheduled_delivery_date: Optional[str] = None
    scheduled_delivery_time: Optional[str] = None

class CustomerCreateSchema(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    wallet_balance: Optional[float] = 100.0

class CustomerUpdateSchema(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    status: Optional[str] = None
    wallet_balance: Optional[float] = None

class CustomerSchema(BaseModel):
    id: int
    name: str
    phone: str
    email: Optional[str] = None
    address: Optional[str] = None
    wallet_balance: float
    total_orders: int
    total_spent: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class SupportTicketCreateSchema(BaseModel):
    customer_name: str
    phone: str
    order_number: Optional[str] = None
    category: Optional[str] = "General Inquiry"
    subject: str
    message: str

class SupportTicketSchema(BaseModel):
    id: int
    ticket_id: str
    customer_name: str
    phone: str
    order_number: Optional[str] = None
    category: str
    subject: str
    message: str
    status: str
    priority: str
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreateSchema(BaseModel):
    title: str
    desc: str
    type: Optional[str] = "ORDERS" # ORDERS, OFFERS, WALLET, SYSTEM
    time: Optional[str] = "Just now"

class NotificationSchema(BaseModel):
    id: int
    title: str
    desc: str
    type: str
    time: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreateSchema(BaseModel):
    phone: Optional[str] = None
    ticket_id: Optional[str] = None
    customer_name: Optional[str] = "Customer"
    sender: str = "customer" # "customer" | "support"
    text: str

class ChatMessageSchema(BaseModel):
    id: int
    ticket_id: Optional[str] = None
    phone: Optional[str] = None
    customer_name: Optional[str] = None
    sender: str
    text: str
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------
# CMS CONTENT SCHEMAS (banners, flash deals, brands, coupons)
# ---------------------------------------------------------------

class BannerCreateSchema(BaseModel):
    badge: Optional[str] = None
    headline: str
    subtext: Optional[str] = None
    cta: Optional[str] = None
    perk: Optional[str] = None
    icon: Optional[str] = "🛒"
    bg_gradient: Optional[str] = "from-emerald-950 via-teal-900 to-emerald-900"
    accent_border: Optional[str] = "border-emerald-500/40"
    badge_color: Optional[str] = "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
    cta_target: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class BannerSchema(BannerCreateSchema):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class FlashDealCreateSchema(BaseModel):
    title: str
    discount_label: Optional[str] = None
    tag: Optional[str] = None
    price_label: Optional[str] = None
    mrp_label: Optional[str] = None
    image_url: Optional[str] = None
    sort_order: Optional[int] = 0
    is_active: Optional[bool] = True


class FlashDealSchema(FlashDealCreateSchema):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class BrandCreateSchema(BaseModel):
    name: str
    logo: Optional[str] = None
    category: Optional[str] = None
    origin: Optional[str] = None
    logo_text: Optional[str] = None
    sort_order: Optional[int] = 0
    is_featured: Optional[bool] = True
    is_active: Optional[bool] = True


class BrandSchema(BrandCreateSchema):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CouponCreateSchema(BaseModel):
    code: str
    tag: Optional[str] = None
    discount_label: Optional[str] = None
    desc: Optional[str] = None
    discount_type: Optional[str] = "FLAT"      # FLAT | PERCENT
    discount_value: Optional[float] = 0
    min_order: Optional[float] = 0
    max_discount: Optional[float] = 0
    valid_till: Optional[str] = None
    first_order_only: Optional[bool] = False
    usage_limit: Optional[int] = 1000
    used_count: Optional[int] = 0
    is_active: Optional[bool] = True


class CouponSchema(CouponCreateSchema):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AppSettingSchema(BaseModel):
    key: str
    value: Optional[str] = None

    class Config:
        from_attributes = True


class AdminUserCreateSchema(BaseModel):
    name: str
    email: str
    role: Optional[str] = "Store Manager"
    permissions: Optional[str] = "All Standard Modules"
    status: Optional[str] = "ACTIVE"
    two_factor_enabled: Optional[bool] = True

class AdminUserUpdateSchema(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[str] = None
    status: Optional[str] = None
    two_factor_enabled: Optional[bool] = None

class AdminUserSchema(AdminUserCreateSchema):
    id: int
    last_login: Optional[str] = "Just now"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AuditLogCreateSchema(BaseModel):
    actor: str
    action: str
    category: Optional[str] = "OPERATIONS"
    target: str
    details: Optional[str] = None
    ip_address: Optional[str] = "106.210.84.192"

class AuditLogSchema(AuditLogCreateSchema):
    id: int
    log_id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class IntegrationConfigCreateSchema(BaseModel):
    integration_id: str
    name: str
    desc: Optional[str] = None
    key_id: Optional[str] = None
    secret_key: Optional[str] = None
    webhook_url: Optional[str] = None
    category: Optional[str] = "PAYMENTS"
    environment: Optional[str] = "PRODUCTION"
    status: Optional[str] = "CONNECTED"

class IntegrationConfigSchema(IntegrationConfigCreateSchema):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

