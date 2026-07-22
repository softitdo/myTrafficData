CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE traffic (
  id INT AUTO_INCREMENT PRIMARY KEY,
  country VARCHAR(100) NOT NULL,
  vehicle_type VARCHAR(50) NOT NULL,
  count INT NOT NULL,
  recorded_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_country (country),
  INDEX idx_vehicle_type (vehicle_type)
);

-- admin / admin123
INSERT INTO users (username, password_hash) VALUES
('admin', '$2b$10$tvWoKqlAiOHTiZlwWqd3I.H1MnB5GICddQYDRj9iHBUKOq0wMwg2O');

INSERT INTO traffic (country, vehicle_type, count, recorded_at) VALUES
('USA', 'car', 4200, '2025-11-10 08:00:00'),
('USA', 'truck', 1850, '2025-11-10 08:00:00'),
('USA', 'motorcycle', 640, '2025-11-10 09:30:00'),
('USA', 'bus', 290, '2025-11-10 09:30:00'),
('Germany', 'car', 3050, '2025-11-12 10:00:00'),
('Germany', 'truck', 1420, '2025-11-12 10:00:00'),
('Germany', 'motorcycle', 510, '2025-11-12 11:00:00'),
('Germany', 'bicycle', 870, '2025-11-12 11:00:00'),
('Japan', 'car', 2780, '2025-12-01 07:15:00'),
('Japan', 'truck', 920, '2025-12-01 07:15:00'),
('Japan', 'motorcycle', 1340, '2025-12-01 08:00:00'),
('Japan', 'bus', 405, '2025-12-01 08:00:00'),
('Brazil', 'car', 2410, '2025-12-05 14:00:00'),
('Brazil', 'truck', 1180, '2025-12-05 14:00:00'),
('Brazil', 'motorcycle', 1620, '2025-12-05 15:20:00'),
('India', 'car', 3900, '2026-01-08 06:45:00'),
('India', 'truck', 2100, '2026-01-08 06:45:00'),
('India', 'motorcycle', 2750, '2026-01-08 07:30:00'),
('India', 'bus', 680, '2026-01-08 07:30:00'),
('France', 'car', 2150, '2026-01-20 12:10:00'),
('France', 'bicycle', 980, '2026-01-20 12:10:00'),
('France', 'bus', 360, '2026-01-20 13:00:00');
