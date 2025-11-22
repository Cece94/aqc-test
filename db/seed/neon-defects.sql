-- AQC Defect Analytics seed (Postgres/Neon compatible)
-- Run the whole script in the Neon SQL editor to reset demo data.

-- Drop existing tables to keep re-runs deterministic.
DROP TABLE IF EXISTS defects CASCADE;
DROP TABLE IF EXISTS defect_types CASCADE;
DROP TABLE IF EXISTS rolls CASCADE;

-- Rolls represent manufactured material batches.
CREATE TABLE rolls (
    id SERIAL PRIMARY KEY,
    roll_code TEXT NOT NULL UNIQUE,
    material TEXT NOT NULL,
    width_mm INTEGER NOT NULL CHECK (width_mm > 0),
    length_m INTEGER NOT NULL CHECK (length_m > 0),
    produced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Catalog limited to three recurring defect classifications.
CREATE TABLE defect_types (
    id SERIAL PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL
);

-- Individual defect observations positioned along a roll.
CREATE TABLE defects (
    id SERIAL PRIMARY KEY,
    roll_id INTEGER NOT NULL REFERENCES rolls(id) ON DELETE CASCADE,
    defect_type_id INTEGER NOT NULL REFERENCES defect_types(id),
    position_m NUMERIC(6,2) NOT NULL CHECK (position_m >= 0),
    severity INTEGER NOT NULL CHECK (severity BETWEEN 1 AND 5),
    notes TEXT
);

-- Seed rolls with varied materials and production times.
INSERT INTO rolls (roll_code, material, width_mm, length_m, produced_at)
VALUES
    ('ROLL-A1', 'PET Film', 1200, 500, NOW() - INTERVAL '3 days'),
    ('ROLL-B7', 'Copper Foil', 800, 360, NOW() - INTERVAL '36 hours'),
    ('ROLL-C3', 'Carbon Fiber', 1000, 420, NOW() - INTERVAL '18 hours'),
    ('ROLL-D5', 'Polyimide Film', 900, 600, NOW() - INTERVAL '12 hours'),
    ('ROLL-E2', 'Glass Cloth', 1100, 480, NOW() - INTERVAL '4 hours');

-- Restrict to three core defect types for the demo.
INSERT INTO defect_types (code, description)
VALUES
    ('SCR', 'Surface scratch'),
    ('BLB', 'Air bubble'),
    ('WRK', 'Wrinkle');

-- Seed defects with richer variation per roll.
INSERT INTO defects (roll_id, defect_type_id, position_m, severity, notes)
VALUES
    (1, 1, 6.5, 2, 'Fine scratch near leader'),
    (1, 1, 142.3, 4, 'Scratch from misaligned nip'),
    (1, 2, 52.4, 3, 'Isolated bubble after primer'),
    (1, 3, 118.0, 5, 'Wrinkle due to guide shift'),
    (1, 3, 458.9, 2, 'Soft ripple near exit roller'),
    (1, 1, 275.0, 5, 'Deep scratch crosses width'),
    (2, 2, 25.4, 3, 'Air pocket trapped under foil'),
    (2, 2, 178.6, 5, 'Bubble crater forces scrap'),
    (2, 3, 210.1, 2, 'Wrinkle at web tension change'),
    (2, 1, 265.0, 1, 'Minor scratch from handling'),
    (2, 3, 342.7, 4, 'Wrinkle progresses toward tail'),
    (2, 2, 355.9, 2, 'Edge bubble near splice'),
    (3, 3, 15.0, 2, 'Start-up wrinkle dampens quickly'),
    (3, 1, 102.8, 4, 'Scratch traced to debris'),
    (3, 3, 188.4, 5, 'Severe wrinkle causing delam'),
    (3, 2, 245.5, 1, 'Single micro bubble detected'),
    (3, 3, 377.2, 3, 'Ripple ahead of cooling zone'),
    (4, 2, 44.2, 2, 'Moisture bubble near leader'),
    (4, 1, 130.6, 5, 'Clamp scratch across width'),
    (4, 3, 215.9, 2, 'Wrinkle mid-span after cure'),
    (4, 2, 308.4, 4, 'Bubble chain near adhesive edge'),
    (4, 1, 410.1, 3, 'Scratch from worn roller'),
    (5, 3, 58.9, 1, 'Slight wrinkle at startup'),
    (5, 2, 120.3, 2, 'Bubble from entrained moisture'),
    (5, 2, 214.7, 5, 'Large bubble—reject section'),
    (5, 1, 305.2, 3, 'Scratch along centerline'),
    (5, 3, 420.8, 4, 'Wrinkle from misaligned guide'),
    (5, 1, 465.5, 2, 'Light scratch near core');

-- Quick aggregation example (optional verification).
-- SELECT r.roll_code, dt.code, COUNT(*) AS defect_count
-- FROM defects d
-- JOIN rolls r ON d.roll_id = r.id
-- JOIN defect_types dt ON d.defect_type_id = dt.id
-- GROUP BY r.roll_code, dt.code
-- ORDER BY r.roll_code, defect_count DESC;

