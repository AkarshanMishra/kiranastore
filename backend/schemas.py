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
    category_id: int
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
