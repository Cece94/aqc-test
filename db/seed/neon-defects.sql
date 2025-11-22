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

-- Catalog of defect classifications.
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

-- Seed rolls.
INSERT INTO rolls (roll_code, material, width_mm, length_m, produced_at)
VALUES
    ('ROLL-A1', 'PET Film', 1200, 500, NOW() - INTERVAL '2 days'),
    ('ROLL-B7', 'Copper Foil', 800, 350, NOW() - INTERVAL '1 day'),
    ('ROLL-C3', 'Carbon Fiber', 1000, 420, NOW() - INTERVAL '6 hours');

-- Seed defect types.
INSERT INTO defect_types (code, description)
VALUES
    ('SCR', 'Surface scratch'),
    ('BLB', 'Air bubble'),
    ('WRK', 'Wrinkle'),
    ('CNT', 'Contamination');

-- Seed defects (positions + severities chosen to cover a variety of cases).
INSERT INTO defects (roll_id, defect_type_id, position_m, severity, notes)
VALUES
    (1, 1, 12.4, 2, 'Minor scratch near leading edge'),
    (1, 3, 78.9, 4, 'Wrinkle spans full width'),
    (1, 2, 255.0, 3, 'Bubble cluster observed'),
    (2, 4, 45.3, 5, 'Particle contamination in coating'),
    (2, 1, 180.7, 1, 'Polishable scratch'),
    (2, 2, 210.2, 3, 'Trapped air pocket'),
    (3, 3, 15.0, 2, 'Slight wrinkle after reel start'),
    (3, 4, 300.5, 4, 'Conductive dust inclusion'),
    (3, 2, 350.8, 5, 'Large bubble causes waste');

-- Quick aggregation example (optional verification).
-- SELECT r.roll_code, dt.code, COUNT(*) AS defect_count
-- FROM defects d
-- JOIN rolls r ON d.roll_id = r.id
-- JOIN defect_types dt ON d.defect_type_id = dt.id
-- GROUP BY r.roll_code, dt.code
-- ORDER BY r.roll_code, defect_count DESC;

