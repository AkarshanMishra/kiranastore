from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routers import products, orders, admin, websocket
from seed import seed_database
from migrate import run_migrations

Base.metadata.create_all(bind=engine)
run_migrations()

app = FastAPI(
    title="KiranaStore Quick-Commerce API",
    description="Blinkit & Zepto inspired 10-minute delivery API backend built with Python FastAPI",
    version="1.0.0"
)

# Enable CORS for frontend client
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(products.router)
app.include_router(orders.router)
app.include_router(admin.router)
app.include_router(websocket.router)

@app.on_event("startup")
def on_startup():
    run_migrations()
    seed_database()

@app.get("/")
def read_root():
    return {
        "message": "Welcome to KiranaStore Quick-Commerce API!",
        "status": "Online",
        "docs": "/docs"
    }

# Reload trigger for customers routes

