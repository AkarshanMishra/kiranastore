from database import engine, SessionLocal, Base
from models import Category, Product
import random

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Clear existing products and categories for clean 1000+ item seed
    db.query(Product).delete()
    db.query(Category).delete()
    db.commit()

    print("Generating 1,050+ Blinkit/Zepto quick-commerce catalog items...")

    categories_data = [
        {"name": "Milk & Dairy", "slug": "milk-dairy", "icon": "🥛", "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&q=80"},
        {"name": "Fruits & Vegetables", "slug": "fruits-vegetables", "icon": "🍎", "image_url": "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=80"},
        {"name": "Snacks & Munchies", "slug": "snacks-munchies", "icon": "🍿", "image_url": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300&q=80"},
        {"name": "Cold Drinks & Juices", "slug": "cold-drinks-juices", "icon": "🥤", "image_url": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=80"},
        {"name": "Instant & Frozen Food", "slug": "instant-food", "icon": "🍜", "image_url": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=300&q=80"},
        {"name": "Atta, Rice & Dal", "slug": "atta-rice-dal", "icon": "🌾", "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80"},
        {"name": "Oil, Ghee & Spices", "slug": "oil-ghee-spices", "icon": "🧈", "image_url": "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=300&q=80"},
        {"name": "Bakery & Biscuits", "slug": "bakery-biscuits", "icon": "🍞", "image_url": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=80"},
        {"name": "Personal Care", "slug": "personal-care", "icon": "🧼", "image_url": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80"},
        {"name": "Household Essentials", "slug": "household-essentials", "icon": "🧹", "image_url": "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=300&q=80"},
        {"name": "Baby Care", "slug": "baby-care", "icon": "🍼", "image_url": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=300&q=80"},
        {"name": "Pet Care", "slug": "pet-care", "icon": "🐶", "image_url": "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=300&q=80"}
    ]

    cat_objs = {}
    for cat_info in categories_data:
        cat = Category(**cat_info)
        db.add(cat)
        db.commit()
        db.refresh(cat)
        cat_objs[cat.slug] = cat.id

    products = []
    pack_variants = ["Single Pack", "Value Twin Pack", "Family Saver Pack", "Combo Deal"]

    # 1. Milk & Dairy (~120 items)
    dairy_brands = ["Amul", "Mother Dairy", "Nestle", "Country Delight", "Nandini", "Epigamia", "Milky Mist", "Danone"]
    dairy_types = [
        ("Taaza Toned Milk", "500 ml", 28.0, 27.0, "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80"),
        ("Gold Full Cream Milk", "500 ml", 34.0, 33.0, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80"),
        ("Fresh Paneer Block", "200 g", 95.0, 89.0, "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400&q=80"),
        ("Salted Butter", "100 g", 60.0, 58.0, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80"),
        ("Greek Yoghurt Mango", "100 g", 50.0, 45.0, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"),
        ("Classic Plain Dahi", "400 g", 45.0, 40.0, "https://images.unsplash.com/photo-1571217698542-a9b0a1a0f8ab?w=400&q=80"),
        ("Cheese Slices Pack", "200 g", 140.0, 125.0, "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80"),
        ("Cow Milk Pouch", "1 L", 66.0, 64.0, "https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?w=400&q=80"),
        ("Flavoured Chocolate Milkshake", "180 ml", 35.0, 30.0, "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80"),
        ("Fresh Malai Cream", "250 ml", 70.0, 65.0, "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&q=80"),
        ("Sweet Lassi Pouch", "200 ml", 25.0, 22.0, "https://images.unsplash.com/photo-1571217698542-a9b0a1a0f8ab?w=400&q=80"),
        ("Strawberry Yoghurt", "100 g", 45.0, 40.0, "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"),
        ("Mozzarella Cheese Shredded", "200 g", 160.0, 142.0, "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80")
    ]

    for brand in dairy_brands:
        for name, unit, price, disc, img in dairy_types:
            products.append(Product(
                category_id=cat_objs["milk-dairy"],
                name=f"{brand} {name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc) if disc else None,
                stock=random.randint(20, 150),
                in_stock=True,
                image_url=img,
                description=f"Fresh quality {brand} {name} delivered chilled in 8-10 minutes.",
                rating=round(random.uniform(4.5, 4.9), 1),
                eta_badge=f"{random.randint(7, 10)} Mins"
            ))

    # 2. Fruits & Vegetables (~180 items)
    veg_items = [
        ("Fresh Hybrid Tomatoes", "500 g", 25.0, 19.0, "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&q=80"),
        ("Robusta Sweet Bananas", "1 kg", 55.0, 45.0, "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&q=80"),
        ("Fresh Red Onions", "1 kg", 38.0, 32.0, "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cf?w=400&q=80"),
        ("Shimla Crunchy Apples", "500 g", 140.0, 119.0, "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&q=80"),
        ("Organic Baby Spinach", "250 g", 30.0, 24.0, "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&q=80"),
        ("Green Capsicum Bell Pepper", "250 g", 28.0, 22.0, "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80"),
        ("Farm Fresh Potatoes", "1 kg", 30.0, 24.0, "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&q=80"),
        ("Fresh Orange Carrots", "500 g", 35.0, 29.0, "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&q=80"),
        ("Green Cucumbers", "500 g", 22.0, 18.0, "https://images.unsplash.com/photo-1447175008436-08417189295a?w=400&q=80"),
        ("Button Mushrooms Pack", "200 g", 60.0, 49.0, "https://images.unsplash.com/photo-1504470695779-75300268aa0e?w=400&q=80"),
        ("Fresh Lemon Pack", "250 g", 40.0, 32.0, "https://images.unsplash.com/photo-1534531141161-e4160499e9e1?w=400&q=80"),
        ("Green Peas Matar", "500 g", 50.0, 42.0, "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400&q=80"),
        ("Sweet Papaya", "1 pc (approx 1kg)", 75.0, 60.0, "https://images.unsplash.com/photo-1517260739337-6799d239ce83?w=400&q=80"),
        ("Nagpur Sweet Oranges", "1 kg", 90.0, 75.0, "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&q=80"),
        ("Green Seedless Grapes", "500 g", 110.0, 89.0, "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400&q=80"),
        ("Sweet Pomegranate Anar", "500 g", 160.0, 139.0, "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80"),
        ("Fresh Cauliflower Gobi", "1 pc", 40.0, 32.0, "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80"),
        ("Broccoli Exotic", "250 g", 70.0, 58.0, "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&q=80")
    ]

    for prefix in ["Farm Fresh", "Organic Native", "Daily Harvest", "Hydroponic Premium", "Local Selected", "Direct From Mandi"]:
        for name, unit, price, disc, img in veg_items:
            products.append(Product(
                category_id=cat_objs["fruits-vegetables"],
                name=f"{prefix} {name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc) if disc else None,
                stock=random.randint(15, 120),
                in_stock=True,
                image_url=img,
                description=f"Freshly picked {name}. High quality guaranteed.",
                rating=round(random.uniform(4.4, 4.9), 1),
                eta_badge="9 Mins"
            ))

    # 3. Snacks & Munchies (~180 items)
    snack_brands = ["Lays", "Haldiram's", "Kurkure", "Act II", "Bikanervala", "Doritos", "Pringles", "Uncle Chipps", "Balaji", "Bingo", "Cornitos", "Too Yumm"]
    snack_types = [
        ("Magic Masala Chips", "50 g", 20.0, 18.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80"),
        ("Bhujia Sev", "400 g", 120.0, 105.0, "https://images.unsplash.com/photo-1621996346565-e3d5d6287319?w=400&q=80"),
        ("Butter Popcorn", "150 g", 45.0, 39.0, "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80"),
        ("Nacho Cheese Chips", "100 g", 60.0, 50.0, "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80"),
        ("Salted Roasted Almonds", "200 g", 240.0, 199.0, "https://images.unsplash.com/photo-1508061252478-f8646b9dfa7f?w=400&q=80"),
        ("Crispy Potato Wafers", "80 g", 35.0, 30.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80"),
        ("All in One Mixture Namkeen", "350 g", 110.0, 95.0, "https://images.unsplash.com/photo-1621996346565-e3d5d6287319?w=400&q=80"),
        ("Peri Peri Crunchy Makhana", "100 g", 130.0, 109.0, "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=400&q=80"),
        ("Kaju Roasted Cashews", "200 g", 290.0, 245.0, "https://images.unsplash.com/photo-1508061252478-f8646b9dfa7f?w=400&q=80"),
        ("Salted Peanut Crackers", "150 g", 40.0, 35.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80"),
        ("Solid Masti Sticks", "90 g", 20.0, 18.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80"),
        ("Sour Cream & Onion Wafers", "110 g", 85.0, 75.0, "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&q=80")
    ]

    for sb in snack_brands:
        for st_name, unit, price, disc, img in snack_types:
            products.append(Product(
                category_id=cat_objs["snacks-munchies"],
                name=f"{sb} {st_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(30, 200),
                in_stock=True,
                image_url=img,
                description=f"Tasty crunchy snack by {sb}.",
                rating=round(random.uniform(4.5, 5.0), 1),
                eta_badge="7 Mins"
            ))

    # 4. Cold Drinks & Juices (~130 items)
    drink_brands = ["Coca-Cola", "Thums Up", "Sprite", "Fanta", "Real Fruit", "Tropicana", "Red Bull", "Monster", "Paper Boat", "Bisleri", "7Up", "Pepsi", "Mirinda"]
    drink_types = [
        ("Original Can", "300 ml", 40.0, 35.0, "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80"),
        ("Mixed Fruit Juice", "1 L", 130.0, 110.0, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80"),
        ("Zero Sugar Soda", "300 ml", 40.0, 35.0, "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"),
        ("Energy Drink Can", "250 ml", 125.0, 115.0, "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80"),
        ("Fresh Alphonso Mango Drink", "1 L", 110.0, 95.0, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80"),
        ("Sparkling Soda Water", "750 ml", 30.0, 25.0, "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80"),
        ("Aamras Mango Juice", "250 ml", 35.0, 30.0, "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80"),
        ("Cold Brew Coffee Can", "240 ml", 90.0, 79.0, "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=400&q=80"),
        ("Lemon Ice Tea Bottle", "500 ml", 60.0, 50.0, "https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&q=80"),
        ("Mineral Water Pack", "1 L x 6 Bottles", 120.0, 105.0, "https://images.unsplash.com/photo-1560023907-5f339617ea30?w=400&q=80")
    ]

    for db_brand in drink_brands:
        for dt_name, unit, price, disc, img in drink_types:
            products.append(Product(
                category_id=cat_objs["cold-drinks-juices"],
                name=f"{db_brand} {dt_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(40, 180),
                in_stock=True,
                image_url=img,
                description=f"Chilled refreshing beverage by {db_brand}.",
                rating=round(random.uniform(4.6, 5.0), 1),
                eta_badge="8 Mins"
            ))

    # 5. Instant & Frozen Food (~100 items)
    instant_brands = ["Maggi", "Yippee", "Knorr", "McCain", "MTR", "Saffola Oats", "Kellogg's", "Bambino", "Ching's Secret", "Top Ramen"]
    instant_types = [
        ("2-Minute Masala Noodles", "4 x 70 g", 56.0, 52.0, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80"),
        ("Classic Tomato Soup", "53 g", 55.0, 48.0, "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80"),
        ("French Fries Pack", "450 g", 135.0, 115.0, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80"),
        ("Instant Veggie Oats", "500 g", 190.0, 165.0, "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80"),
        ("Corn Flakes Honey Crunch", "475 g", 220.0, 189.0, "https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=400&q=80"),
        ("Cheese Chilli Garlic Bites", "300 g", 170.0, 145.0, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80"),
        ("Instant Upma Mix", "200 g", 65.0, 55.0, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80"),
        ("Instant Poha Breakfast", "200 g", 60.0, 50.0, "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=400&q=80"),
        ("Veggie Burger Patty", "360 g", 160.0, 139.0, "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80"),
        ("Chocolate Muesli", "400 g", 295.0, 249.0, "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&q=80")
    ]

    for ib in instant_brands:
        for it_name, unit, price, disc, img in instant_types:
            products.append(Product(
                category_id=cat_objs["instant-food"],
                name=f"{ib} {it_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(25, 120),
                in_stock=True,
                image_url=img,
                description=f"Quick meal {it_name} from {ib}.",
                rating=round(random.uniform(4.4, 4.9), 1),
                eta_badge="9 Mins"
            ))

    # 6. Atta, Rice & Dal (~100 items)
    atta_brands = ["Aashirvaad", "Fortune", "Daawat", "India Gate", "Tata Sampann", "Tata Pulses", "Catch", "Kohinoor", "Nature Fresh", "Patanjali"]
    atta_types = [
        ("Shuddha Chakki Atta", "5 kg", 240.0, 219.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Rozana Super Basmati Rice", "5 kg", 490.0, 420.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Unpolished Arhar Toor Dal", "1 kg", 175.0, 155.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Yellow Moong Dal Dhuli", "1 kg", 140.0, 125.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Desi Chana Dal", "1 kg", 95.0, 85.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Kabuli Chole Rajma", "1 kg", 160.0, 139.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Premium Sona Masoori Rice", "5 kg", 360.0, 315.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Pure Gram Flour Besan", "500 g", 60.0, 52.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Fine Wheat Maida", "500 g", 35.0, 30.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80"),
        ("Semolina Sooji", "500 g", 38.0, 32.0, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80")
    ]

    for ab in atta_brands:
        for at_name, unit, price, disc, img in atta_types:
            products.append(Product(
                category_id=cat_objs["atta-rice-dal"],
                name=f"{ab} {at_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(30, 150),
                in_stock=True,
                image_url=img,
                description=f"Pure quality {at_name} by {ab}.",
                rating=round(random.uniform(4.6, 5.0), 1),
                eta_badge="10 Mins"
            ))

    # 7. Oil, Ghee & Spices (~100 items)
    oil_brands = ["Fortune", "Dhara", "Amul Ghee", "Ananda Ghee", "MDH Spices", "Everest Spices", "Tata Salt", "Catch Spices", "Saffola", "Borges"]
    oil_types = [
        ("Mustard Kachi Ghani Oil", "1 L", 165.0, 145.0, "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80"),
        ("Refined Sunflower Oil", "1 L", 145.0, 129.0, "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80"),
        ("Pure Cow Desi Ghee Jar", "1 L", 650.0, 589.0, "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400&q=80"),
        ("Turmeric Powder Haldi", "200 g", 55.0, 48.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"),
        ("Red Chilli Powder Lal Mirch", "200 g", 75.0, 65.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"),
        ("Coriander Powder Dhaniya", "200 g", 60.0, 52.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"),
        ("Garam Masala Blend", "100 g", 85.0, 74.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"),
        ("Whole Cumin Seeds Jeera", "200 g", 110.0, 95.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"),
        ("Iodized Crystal Salt", "1 kg", 28.0, 25.0, "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"),
        ("Extra Virgin Olive Oil", "500 ml", 450.0, 389.0, "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&q=80")
    ]

    for ob in oil_brands:
        for ot_name, unit, price, disc, img in oil_types:
            products.append(Product(
                category_id=cat_objs["oil-ghee-spices"],
                name=f"{ob} {ot_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(20, 100),
                in_stock=True,
                image_url=img,
                description=f"Authentic {ot_name} from {ob}.",
                rating=round(random.uniform(4.7, 5.0), 1),
                eta_badge="10 Mins"
            ))

    # 8. Bakery & Biscuits (~100 items)
    bakery_brands = ["Britannia", "Parle", "Oreo", "Sunfeast", "Monaco", "Modern Bakery", "English Oven", "Hide & Seek", "Bisk Farm", "NutriChoice"]
    bakery_types = [
        ("100% Whole Wheat Bread", "400 g", 45.0, 42.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"),
        ("Original Vanilla Cream Biscuits", "120 g", 35.0, 30.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"),
        ("Classic Tea Toast Rusk", "300 g", 50.0, 44.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"),
        ("Choco Chip Cookies", "150 g", 65.0, 55.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"),
        ("Marie Light Wheat Biscuits", "250 g", 40.0, 35.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"),
        ("Fresh Milk Bread", "400 g", 40.0, 38.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"),
        ("Burger Buns Pack of 4", "200 g", 35.0, 30.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80"),
        ("Chocolate Muffin Cake", "100 g", 45.0, 39.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"),
        ("Digestive Fibre Biscuits", "200 g", 70.0, 59.0, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"),
        ("Garlic Toast Bread Slices", "150 g", 60.0, 49.0, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80")
    ]

    for bb in bakery_brands:
        for bt_name, unit, price, disc, img in bakery_types:
            products.append(Product(
                category_id=cat_objs["bakery-biscuits"],
                name=f"{bb} {bt_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(30, 160),
                in_stock=True,
                image_url=img,
                description=f"Fresh baked product by {bb}.",
                rating=round(random.uniform(4.5, 4.9), 1),
                eta_badge="8 Mins"
            ))

    # 9. Personal Care (~80 items)
    personal_brands = ["Dettol", "Dove", "Colgate", "Nivea", "Head & Shoulders", "Pond's", "Garnier", "Santoor", "Vaseline", "Fiama"]
    personal_types = [
        ("Original Bathing Soap", "3 x 125 g", 180.0, 155.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Anti-Dandruff Shampoo", "340 ml", 295.0, 249.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Strong Teeth Toothpaste", "200 g", 115.0, 99.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Deep Moisture Body Lotion", "200 ml", 220.0, 185.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Refreshing Face Wash", "100 g", 160.0, 135.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Deodorant Body Spray", "150 ml", 225.0, 189.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Moisturizing Hand Wash", "250 ml", 99.0, 85.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80"),
        ("Gentle Body Wash Shower Gel", "250 ml", 240.0, 199.0, "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80")
    ]

    for pb in personal_brands:
        for pt_name, unit, price, disc, img in personal_types:
            products.append(Product(
                category_id=cat_objs["personal-care"],
                name=f"{pb} {pt_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(20, 90),
                in_stock=True,
                image_url=img,
                description=f"Trusted personal care product by {pb}.",
                rating=round(random.uniform(4.6, 5.0), 1),
                eta_badge="10 Mins"
            ))

    # 10. Household Essentials (~70 items)
    house_brands = ["Vim", "Surf Excel", "Ariel", "Harpic", "Lizol", "Colin", "Good Knight", "Comfort", "Pril", "Tide"]
    house_types = [
        ("Dishwash Liquid Gel", "500 ml", 125.0, 109.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"),
        ("Matic Detergent Powder", "1 kg", 215.0, 185.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"),
        ("Disinfectant Surface Cleaner", "500 ml", 110.0, 95.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"),
        ("Power Toilet Cleaner Gel", "500 ml", 105.0, 89.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"),
        ("Glass Cleaner Spray", "500 ml", 100.0, 85.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"),
        ("Fabric Conditioner", "400 ml", 120.0, 99.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80"),
        ("Mosquito Vaporizer Refill", "45 ml", 80.0, 72.0, "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80")
    ]

    for hb in house_brands:
        for ht_name, unit, price, disc, img in house_types:
            products.append(Product(
                category_id=cat_objs["household-essentials"],
                name=f"{hb} {ht_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(25, 110),
                in_stock=True,
                image_url=img,
                description=f"Effective household cleaning essential by {hb}.",
                rating=round(random.uniform(4.7, 5.0), 1),
                eta_badge="10 Mins"
            ))

    # 11. Baby Care (~50 items)
    baby_brands = ["Pampers", "Huggies", "Himalaya Baby", "Johnson's Baby", "Mee Mee", "MamyPoko Pants", "Sebamed Baby", "Cerelac", "Mothercare", "Chicco"]
    baby_types = [
        ("Taped Diapers Pants (M)", "34 pcs", 599.0, 499.0, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"),
        ("Gentle Baby Wipes", "72 wipes", 195.0, 149.0, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"),
        ("Baby Nourishing Lotion", "200 ml", 210.0, 175.0, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"),
        ("Baby Shampoo Tear-Free", "200 ml", 190.0, 160.0, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80"),
        ("Baby Massage Oil", "100 ml", 150.0, 125.0, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&q=80")
    ]

    for bb in baby_brands:
        for bt_name, unit, price, disc, img in baby_types:
            products.append(Product(
                category_id=cat_objs["baby-care"],
                name=f"{bb} {bt_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(15, 80),
                in_stock=True,
                image_url=img,
                description=f"Safe and gentle baby care item from {bb}.",
                rating=round(random.uniform(4.8, 5.0), 1),
                eta_badge="10 Mins"
            ))

    # 12. Pet Care (~50 items)
    pet_brands = ["Pedigree", "Whiskas", "Drools", "Meat Up", "Purepet", "Sheba", "Royal Canin", "Choostix", "Goodo", "Gnawers"]
    pet_types = [
        ("Adult Dog Food Chicken & Rice", "1.2 kg", 360.0, 310.0, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80"),
        ("Cat Wet Food Tuna Gravy", "4 x 85 g", 160.0, 139.0, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80"),
        ("Crunchy Dog Biscuits Treats", "500 g", 180.0, 149.0, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80"),
        ("Kitty Litter Sand Clumping", "5 kg", 450.0, 375.0, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80"),
        ("Puppy Dentastix Dental Chews", "180 g", 195.0, 165.0, "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&q=80")
    ]

    for pb in pet_brands:
        for pt_name, unit, price, disc, img in pet_types:
            products.append(Product(
                category_id=cat_objs["pet-care"],
                name=f"{pb} {pt_name}",
                weight_unit=unit,
                price=float(price),
                discount_price=float(disc),
                stock=random.randint(15, 70),
                in_stock=True,
                image_url=img,
                description=f"Healthy pet nutrition by {pb}.",
                rating=round(random.uniform(4.7, 5.0), 1),
                eta_badge="10 Mins"
            ))

    print(f"Total products generated: {len(products)}")
    for p in products:
        db.add(p)

    # Seed Sample Customers if table is empty
    from models import Customer
    if db.query(Customer).count() == 0:
        sample_customers = [
            Customer(name="Akarshan Mishra", phone="+91 9876543210", email="akarshan@kiranastore.com", address="Flat 402, Block B, Sector 62, Noida, UP", wallet_balance=350.0, total_orders=5, total_spent=4200.0, status="ACTIVE"),
            Customer(name="Priya Sharma", phone="+91 9811223344", email="priya.sharma@gmail.com", address="Tower 4, Flat 12B, Indirapuram, Ghaziabad, UP", wallet_balance=200.0, total_orders=3, total_spent=2890.0, status="ACTIVE"),
            Customer(name="Rohan Verma", phone="+91 9822334455", email="rohan.verma@outlook.com", address="House 88, Sector 18 Market Road, Noida, UP", wallet_balance=150.0, total_orders=2, total_spent=1450.0, status="ACTIVE")
        ]
        for sc in sample_customers:
            db.add(sc)

    db.commit()
    db.close()
    print(f"Database successfully populated with {len(products)} catalog items across 12 categories!")

if __name__ == "__main__":
    seed_database()
