-- Initialize database schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  age_years INT NOT NULL,
  age_months INT DEFAULT 0,
  breed VARCHAR(100) NOT NULL,
  size VARCHAR(20) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  color VARCHAR(100),
  description TEXT,
  vaccinated BOOLEAN DEFAULT FALSE,
  sterilized BOOLEAN DEFAULT FALSE,
  dewormed BOOLEAN DEFAULT FALSE,
  special_needs TEXT,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  address TEXT,
  province VARCHAR(50),
  canton VARCHAR(50),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  photos TEXT[] NOT NULL,
  certificate TEXT,
  status VARCHAR(20) DEFAULT 'disponible',
  publisher_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  adopted_at TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('disponible', 'reservado', 'adoptado'))
);

-- Dog status history table
CREATE TABLE IF NOT EXISTS dog_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dog_id UUID REFERENCES dogs(id) ON DELETE CASCADE,
  old_status VARCHAR(20),
  new_status VARCHAR(20) NOT NULL,
  changed_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dogs_status ON dogs(status);
CREATE INDEX IF NOT EXISTS idx_dogs_publisher ON dogs(publisher_id);
CREATE INDEX IF NOT EXISTS idx_dogs_province ON dogs(province);

-- Insert demo data
INSERT INTO users (id, email, name, phone, location) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'demo@purapata.com', 'Usuario Demo', '8888-8888', 'San José, Costa Rica')
ON CONFLICT (email) DO NOTHING;

INSERT INTO dogs (name, age_years, age_months, breed, size, gender, color, description, vaccinated, sterilized, dewormed, latitude, longitude, address, province, contact_phone, photos, publisher_id) VALUES
('Max', 2, 0, 'Labrador', 'grande', 'macho', 'Dorado', 'Perro muy juguetón y amigable', true, true, true, 9.9281, -84.0907, 'San José Centro', 'San José', '8888-8888', ARRAY['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800'], '550e8400-e29b-41d4-a716-446655440000'),
('Luna', 1, 6, 'Pastor Alemán', 'grande', 'hembra', 'Negro y café', 'Perra protectora y leal', true, false, true, 10.0062, -84.1144, 'Alajuela Centro', 'Alajuela', '8888-8888', ARRAY['https://images.unsplash.com/photo-1568572933382-74d440642117?w=800'], '550e8400-e29b-41d4-a716-446655440000'),
('Rocky', 3, 0, 'Mestizo', 'mediano', 'macho', 'Café', 'Perro tranquilo, ideal para familias', true, true, true, 9.8639, -83.9217, 'Cartago Centro', 'Cartago', '8888-8888', ARRAY['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800'], '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT DO NOTHING;
