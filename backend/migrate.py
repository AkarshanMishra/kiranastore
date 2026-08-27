import sqlite3

def run_migrations():
    con = sqlite3.connect('kiranastore.db')
    cur = con.cursor()
    
    # Check orders table columns
    cols = [col[1] for col in cur.execute("PRAGMA table_info(orders)").fetchall()]
    
    new_cols = [
        ("order_type", "VARCHAR DEFAULT 'NORMAL'"),
        ("hub_name", "VARCHAR"),
        ("slip_image_url", "TEXT"),
        ("special_instructions", "TEXT"),
        ("delivery_slot_type", "VARCHAR DEFAULT 'SAME_DAY'"),
        ("scheduled_delivery_date", "VARCHAR"),
        ("scheduled_delivery_time", "VARCHAR"),
        ("accepted_by_owner", "BOOLEAN DEFAULT 0"),
        ("eta_minutes", "INTEGER DEFAULT 30")
    ]
    
    for col_name, col_type in new_cols:
        if col_name not in cols:
            print(f"Adding column {col_name} to orders table...")
            try:
                cur.execute(f"ALTER TABLE orders ADD COLUMN {col_name} {col_type}")
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
                
    # Create customers table if not exists
    cur.execute('''
    CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL,
        phone VARCHAR NOT NULL UNIQUE,
        email VARCHAR,
        address VARCHAR,
        wallet_balance FLOAT DEFAULT 100.0,
        total_orders INTEGER DEFAULT 0,
        total_spent FLOAT DEFAULT 0.0,
        status VARCHAR DEFAULT 'ACTIVE',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
# ------------------------------------------------------------------
    # CMS CONTENT TABLES (Admin-dashboard manageable customer-app content)
    # ------------------------------------------------------------------
    cur.execute('''
    CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        badge VARCHAR,
        headline VARCHAR NOT NULL,
        subtext VARCHAR,
        cta VARCHAR,
        perk VARCHAR,
        icon VARCHAR,
        bg_gradient VARCHAR,
        accent_border VARCHAR,
        badge_color VARCHAR,
        cta_target VARCHAR,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cur.execute('''
    CREATE TABLE IF NOT EXISTS flash_deals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title VARCHAR NOT NULL,
        discount_label VARCHAR,
        tag VARCHAR,
        price_label VARCHAR,
        mrp_label VARCHAR,
        image_url VARCHAR,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cur.execute('''
    CREATE TABLE IF NOT EXISTS brands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR NOT NULL UNIQUE,
        logo VARCHAR,
        category VARCHAR,
        origin VARCHAR,
        logo_text VARCHAR,
        sort_order INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT 1,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cur.execute('''
    CREATE TABLE IF NOT EXISTS coupons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR NOT NULL UNIQUE,
        tag VARCHAR,
        discount_label VARCHAR,
        desc VARCHAR,
        discount_type VARCHAR DEFAULT 'FLAT',
        discount_value FLOAT DEFAULT 0,
        min_order FLOAT DEFAULT 0,
        max_discount FLOAT DEFAULT 0,
        valid_till VARCHAR,
        first_order_only BOOLEAN DEFAULT 0,
        usage_limit INTEGER DEFAULT 1000,
        used_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')

    cur.execute('''
    CREATE TABLE IF NOT EXISTS app_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key VARCHAR NOT NULL UNIQUE,
        value VARCHAR,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    con.commit()
    con.close()
    print("Database migrations applied successfully!")

if __name__ == "__main__":
    run_migrations()
