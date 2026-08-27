"""
CMS Content Router - bridges the Admin Dashboard to the Customer App.

Admin endpoints (writes):
    /api/admin/banners, /api/admin/flashdeals, /api/admin/brands,
    /api/admin/coupons, /api/admin/config

Public endpoints (reads for customer app):
    /api/banners, /api/flashdeals, /api/brands, /api/coupons, /api/config
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
from models import Banner, FlashDeal, Brand, Coupon, AppSetting
from schemas import (
    BannerCreateSchema, BannerSchema,
    FlashDealCreateSchema, FlashDealSchema,
    BrandCreateSchema, BrandSchema,
    CouponCreateSchema, CouponSchema,
    AppSettingSchema,
)

router = APIRouter(prefix="/api", tags=["content"])


# ======================= BANNERS =======================
@router.get("/banners", response_model=List[BannerSchema])
def get_active_banners(db: Session = Depends(get_db)):
    return db.query(Banner).filter(Banner.is_active == True) \
        .order_by(Banner.sort_order.asc(), Banner.id.asc()).all()


@router.get("/admin/banners", response_model=List[BannerSchema])
def get_all_admin_banners(db: Session = Depends(get_db)):
    return db.query(Banner).order_by(Banner.sort_order.asc(), Banner.id.asc()).all()


@router.post("/admin/banners", response_model=BannerSchema)
def create_admin_banner(payload: BannerCreateSchema, db: Session = Depends(get_db)):
    banner = Banner(**payload.model_dump(exclude_unset=True, exclude={"id", "created_at"}))
    db.add(banner)
    db.commit()
    db.refresh(banner)
    return banner


@router.patch("/admin/banners/{banner_id}", response_model=BannerSchema)
def update_admin_banner(banner_id: int, payload: BannerCreateSchema, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(banner, key, value)
    db.commit()
    db.refresh(banner)
    return banner


@router.delete("/admin/banners/{banner_id}")
def delete_admin_banner(banner_id: int, db: Session = Depends(get_db)):
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Banner not found")
    db.delete(banner)
    db.commit()
    return {"message": "Banner deleted successfully"}


# ======================= FLASH DEALS =======================
@router.get("/flashdeals", response_model=List[FlashDealSchema])
def get_active_flash_deals(db: Session = Depends(get_db)):
    return db.query(FlashDeal).filter(FlashDeal.is_active == True) \
        .order_by(FlashDeal.sort_order.asc(), FlashDeal.id.asc()).all()


@router.get("/admin/flashdeals", response_model=List[FlashDealSchema])
def get_all_admin_flash_deals(db: Session = Depends(get_db)):
    return db.query(FlashDeal).order_by(FlashDeal.sort_order.asc(), FlashDeal.id.asc()).all()


@router.post("/admin/flashdeals", response_model=FlashDealSchema)
def create_admin_flash_deal(payload: FlashDealCreateSchema, db: Session = Depends(get_db)):
    deal = FlashDeal(**payload.model_dump(exclude_unset=True, exclude={"id", "created_at"}))
    db.add(deal)
    db.commit()
    db.refresh(deal)
    return deal


@router.patch("/admin/flashdeals/{deal_id}", response_model=FlashDealSchema)
def update_admin_flash_deal(deal_id: int, payload: FlashDealCreateSchema, db: Session = Depends(get_db)):
    deal = db.query(FlashDeal).filter(FlashDeal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Flash Deal not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(deal, key, value)
    db.commit()
    db.refresh(deal)
    return deal


@router.delete("/admin/flashdeals/{deal_id}")
def delete_admin_flash_deal(deal_id: int, db: Session = Depends(get_db)):
    deal = db.query(FlashDeal).filter(FlashDeal.id == deal_id).first()
    if not deal:
        raise HTTPException(status_code=404, detail="Flash Deal not found")
    db.delete(deal)
    db.commit()
    return {"message": "Flash deal deleted successfully"}


# ======================= BRANDS =======================
@router.get("/brands", response_model=List[BrandSchema])
def get_active_brands(db: Session = Depends(get_db)):
    return db.query(Brand).filter(Brand.is_active == True) \
        .order_by(Brand.sort_order.asc(), Brand.id.asc()).all()


@router.get("/admin/brands", response_model=List[BrandSchema])
def get_all_admin_brands(db: Session = Depends(get_db)):
    return db.query(Brand).order_by(Brand.sort_order.asc(), Brand.id.asc()).all()


@router.post("/admin/brands", response_model=BrandSchema)
def create_admin_brand(payload: BrandCreateSchema, db: Session = Depends(get_db)):
    existing = db.query(Brand).filter(Brand.name == payload.name).first()
    if existing:
        for key, value in payload.model_dump(exclude_unset=True).items():
            setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    brand = Brand(**payload.model_dump(exclude_unset=True, exclude={"id", "created_at"}))
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand


@router.patch("/admin/brands/{brand_id}", response_model=BrandSchema)
def update_admin_brand(brand_id: int, payload: BrandCreateSchema, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(brand, key, value)
    db.commit()
    db.refresh(brand)
    return brand


@router.delete("/admin/brands/{brand_id}")
def delete_admin_brand(brand_id: int, db: Session = Depends(get_db)):
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    db.delete(brand)
    db.commit()
    return {"message": "Brand deleted successfully"}


# ======================= COUPONS =======================
@router.get("/coupons", response_model=List[CouponSchema])
def get_active_coupons(db: Session = Depends(get_db)):
    return db.query(Coupon).filter(Coupon.is_active == True) \
        .order_by(Coupon.id.desc()).all()


@router.get("/admin/coupons", response_model=List[CouponSchema])
def get_all_admin_coupons(db: Session = Depends(get_db)):
    return db.query(Coupon).order_by(Coupon.id.desc()).all()


@router.post("/admin/coupons", response_model=CouponSchema)
def create_admin_coupon(payload: CouponCreateSchema, db: Session = Depends(get_db)):
    data = payload.model_dump(exclude_unset=True)
    data["code"] = (data.get("code") or "").strip().upper()
    existing = db.query(Coupon).filter(Coupon.code == data["code"]).first()
    if existing:
        for key, value in data.items():
            if key != "id" and key != "created_at":
                setattr(existing, key, value)
        db.commit()
        db.refresh(existing)
        return existing
    coupon = Coupon(**data)
    db.add(coupon)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.patch("/admin/coupons/{coupon_id}", response_model=CouponSchema)
def update_admin_coupon(coupon_id: int, payload: CouponCreateSchema, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        if key != "id" and key != "created_at":
            setattr(coupon, key, value)
    db.commit()
    db.refresh(coupon)
    return coupon


@router.delete("/admin/coupons/{coupon_id}")
def delete_admin_coupon(coupon_id: int, db: Session = Depends(get_db)):
    coupon = db.query(Coupon).filter(Coupon.id == coupon_id).first()
    if not coupon:
        raise HTTPException(status_code=404, detail="Coupon not found")
    db.delete(coupon)
    db.commit()
    return {"message": "Coupon deleted successfully"}


# ======================= APP SETTINGS (announcement ticker) =======================
@router.get("/config", response_model=List[AppSettingSchema])
def get_app_settings(db: Session = Depends(get_db)):
    return db.query(AppSetting).all()


@router.post("/admin/config", response_model=AppSettingSchema)
def set_app_setting(payload: AppSettingSchema, db: Session = Depends(get_db)):
    setting = db.query(AppSetting).filter(AppSetting.key == payload.key).first()
    if setting:
        setting.value = payload.value
    else:
        setting = AppSetting(key=payload.key, value=payload.value)
        db.add(setting)
    db.commit()
    db.refresh(setting)
    return setting


@router.put("/admin/config", response_model=List[AppSettingSchema])
def set_many_app_settings(payload: List[AppSettingSchema], db: Session = Depends(get_db)):
    for item in payload:
        setting = db.query(AppSetting).filter(AppSetting.key == item.key).first()
        if setting:
            setting.value = item.value
        else:
            db.add(AppSetting(key=item.key, value=item.value))
    db.commit()
    return db.query(AppSetting).all()