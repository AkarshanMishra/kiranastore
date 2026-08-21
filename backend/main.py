from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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


# ---------------------------------------------------------------
# Serve the built Admin Dashboard (admin/dist) at the root so the
# same URL hosts BOTH the API (/api/...) and the dashboard UI (/).
# The admin app uses relative "/api" calls, so it must live on the
# same origin as the backend. Built with:  cd admin && npm run build
# ---------------------------------------------------------------
import pathlib
from fastapi.responses import HTMLResponse, JSONResponse

_ADMIN_DIST = pathlib.Path(__file__).resolve().parent.parent / "admin" / "dist"
_ADMIN_INDEX = _ADMIN_DIST / "index.html"


@app.get("/")
def read_root():
    # If the admin dashboard build exists, show the dashboard at the root.
    # Otherwise fall back to the API welcome JSON.
    if _ADMIN_INDEX.is_file():
        return HTMLResponse(_ADMIN_INDEX.read_text(encoding="utf-8"))
    return JSONResponse({
        "message": "Welcome to KiranaStore Quick-Commerce API!",
        "status": "Online",
        "docs": "/docs",
    })


# Serve the admin dashboard's static assets (/assets/...) and any other
# files so the dashboard UI loads correctly on the same origin as /api.
if _ADMIN_DIST.is_dir():
    app.mount("/", StaticFiles(directory=str(_ADMIN_DIST), html=True), name="admin")


# Enables running directly with:  python main.py
# Reads the PORT from the environment (Render sets PORT; defaults to 8000 locally).
# This avoids the uvicorn "--port requires an argument" error caused by a missing
# port value in a Start Command like:  uvicorn main:app --host 0.0.0.0 --port
if __name__ == "__main__":
    import os
    import uvicorn
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port)


