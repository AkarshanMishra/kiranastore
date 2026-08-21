import sqlite3

conn = sqlite3.connect('kiranastore.db')
c = conn.cursor()

existing_cols = [row[1] for row in c.execute('PRAGMA table_info(orders)').fetchall()]
print('Existing cols:', existing_cols)

cols_to_add = [
    ('delivery_slot_type', 'TEXT DEFAULT "SAME_DAY"'),
    ('scheduled_delivery_date', 'TEXT'),
    ('scheduled_delivery_time', 'TEXT'),
    ('accepted_by_owner', 'BOOLEAN DEFAULT 0')
]

for col_name, col_type in cols_to_add:
    if col_name not in existing_cols:
        print(f'Adding column {col_name}...')
        c.execute(f'ALTER TABLE orders ADD COLUMN {col_name} {col_type}')

conn.commit()
print('Final cols:', [row[1] for row in c.execute('PRAGMA table_info(orders)').fetchall()])
conn.close()
print('Migration successful!')
