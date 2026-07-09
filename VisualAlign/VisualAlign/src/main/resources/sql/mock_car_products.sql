-- Mock car products for VisualAlign
-- Usage:
-- 1) Replace @STORE_ID and @CATEGORY_ID values with existing ids in your DB.
-- 2) Run in MySQL connected to database `pos`.

SET @STORE_ID = 1;
SET @CATEGORY_ID = 1;

INSERT INTO product (
    id,
    name,
    sku,
    description,
    selling_price,
    image,
    brand,
    mrp,
    category_id,
    store_id,
    created_at,
    updated_at
) VALUES
(NULL, 'Michelin Primacy 4 205/55R16', 'CAR-TIRE-001', 'Touring tire with high wet grip and quiet performance.', 2450000, NULL, 'Michelin', 2690000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'Bosch S5 70Ah Car Battery', 'CAR-BAT-002', 'Maintenance-free battery for sedan and crossover vehicles.', 3290000, NULL, 'Bosch', 3590000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'Mobil 1 ESP 5W-30 5L', 'CAR-OIL-003', 'Synthetic low-ash engine oil for modern gasoline engines.', 890000, NULL, 'Mobil', 950000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'Denso Iridium TT Spark Plug', 'CAR-SPK-004', 'Long-life iridium spark plug for smooth ignition.', 175000, NULL, 'Denso', 199000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'Valeo Front Brake Pad Set', 'CAR-BRK-005', 'Low-dust ceramic brake pads for daily driving.', 1180000, NULL, 'Valeo', 1290000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'K&N Performance Air Filter', 'CAR-AIR-006', 'Reusable high-flow air filter for improved throttle response.', 1350000, NULL, 'K&N', 1490000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'Liqui Moly Radiator Coolant 5L', 'CAR-CLT-007', 'Ready-to-use long-life coolant for aluminum engines.', 390000, NULL, 'Liqui Moly', 430000, @CATEGORY_ID, @STORE_ID, NOW(), NOW()),
(NULL, 'Philips Ultinon Pro6000 H7', 'CAR-LGT-008', 'LED headlight bulbs with bright white beam pattern.', 1590000, NULL, 'Philips', 1750000, @CATEGORY_ID, @STORE_ID, NOW(), NOW());
