from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
from models import Category, Product
from schemas import CategorySchema, ProductSchema

router = APIRouter(prefix="/api", tags=["products"])

@router.get("/categories", response_model=List[CategorySchema])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Category).all()
    return categories

@router.get("/products", response_model=List[ProductSchema])
def get_products(
    category_id: Optional[int] = None,
    category_slug: Optional[str] = None,
    q: Optional[str] = Query(None, description="Search query"),
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category_id:
        query = query.filter(Product.category_id == category_id)
    elif category_slug:
        cat = db.query(Category).filter(Category.slug == category_slug).first()
        if cat:
            query = query.filter(Product.category_id == cat.id)

    if q:
        search_term = f"%{q.strip()}%"
        query = query.filter(
            (Product.name.ilike(search_term)) | (Product.description.ilike(search_term))
        )

    return query.all()

@router.get("/products/{product_id}", response_model=ProductSchema)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
