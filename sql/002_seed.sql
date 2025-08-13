-- Seed Categories
INSERT INTO categories (name, slug, description) VALUES
('Electronics', 'electronics', 'Gadgets, devices, and electronic accessories'),
('Apparel', 'apparel', 'Clothing, shoes, and fashion accessories'),
('Home & Living', 'home', 'Furniture, decor, and home essentials'),
('Books', 'books', 'Physical and digital books'),
('Sports & Outdoors', 'sports', 'Sports equipment and outdoor gear');

-- Seed Products
INSERT INTO products (title, slug, description, price_cents, stock, category_id, active) VALUES
-- Electronics
('Wireless Bluetooth Headphones', 'wireless-bluetooth-headphones', 'Premium noise-cancelling over-ear headphones with 30-hour battery life', 12999, 50, 1, true),
('Smart Watch Pro', 'smart-watch-pro', 'Advanced fitness tracking smartwatch with heart rate monitor and GPS', 29999, 30, 1, true),
('4K Webcam', '4k-webcam', 'Ultra HD webcam for streaming and video calls with auto-focus', 8999, 100, 1, true),
('Portable Power Bank', 'portable-power-bank', '20000mAh fast charging power bank with USB-C and wireless charging', 4999, 200, 1, true),
('Mechanical Keyboard', 'mechanical-keyboard', 'RGB backlit mechanical gaming keyboard with custom switches', 15999, 75, 1, true),

-- Apparel
('Classic Cotton T-Shirt', 'classic-cotton-tshirt', 'Comfortable 100% cotton t-shirt available in multiple colors', 1999, 500, 2, true),
('Denim Jeans', 'denim-jeans', 'Slim fit denim jeans with stretch fabric for comfort', 5999, 150, 2, true),
('Running Shoes', 'running-shoes', 'Lightweight athletic running shoes with responsive cushioning', 8999, 100, 2, true),
('Winter Jacket', 'winter-jacket', 'Waterproof insulated winter jacket with hood', 12999, 80, 2, true),
('Leather Wallet', 'leather-wallet', 'Genuine leather bifold wallet with RFID protection', 3999, 200, 2, true),

-- Home & Living
('Ceramic Coffee Mug Set', 'ceramic-coffee-mug-set', 'Set of 4 handcrafted ceramic coffee mugs', 2999, 100, 3, true),
('Throw Pillow Set', 'throw-pillow-set', 'Decorative throw pillows with removable covers (set of 2)', 3499, 150, 3, true),
('LED Desk Lamp', 'led-desk-lamp', 'Adjustable LED desk lamp with touch controls and USB charging', 4999, 120, 3, true),
('Bamboo Cutting Board', 'bamboo-cutting-board', 'Large bamboo cutting board with juice groove', 2499, 200, 3, true),
('Essential Oil Diffuser', 'essential-oil-diffuser', 'Ultrasonic aromatherapy diffuser with LED lights', 3999, 90, 3, true),

-- Books
('The Art of Programming', 'art-of-programming', 'Comprehensive guide to modern software development practices', 4999, 50, 4, true),
('Mindful Living', 'mindful-living', 'A guide to mindfulness and meditation in daily life', 2499, 100, 4, true),
('Science Fiction Collection', 'scifi-collection', 'Collection of classic science fiction novels', 5999, 75, 4, true),

-- Sports & Outdoors
('Yoga Mat Premium', 'yoga-mat-premium', 'Extra thick non-slip yoga mat with carrying strap', 3999, 150, 5, true),
('Camping Tent 4-Person', 'camping-tent-4person', 'Waterproof family camping tent with easy setup', 19999, 40, 5, true),
('Fitness Resistance Bands', 'fitness-resistance-bands', 'Set of 5 resistance bands with different resistance levels', 2999, 200, 5, true);

-- Seed Product Images
INSERT INTO product_images (product_id, url, alt, position) VALUES
(1, 'https://via.placeholder.com/600x600/4A90E2/FFFFFF?text=Headphones', 'Wireless Bluetooth Headphones', 0),
(2, 'https://via.placeholder.com/600x600/7B68EE/FFFFFF?text=Smart+Watch', 'Smart Watch Pro', 0),
(3, 'https://via.placeholder.com/600x600/FF6347/FFFFFF?text=Webcam', '4K Webcam', 0),
(4, 'https://via.placeholder.com/600x600/32CD32/FFFFFF?text=Power+Bank', 'Portable Power Bank', 0),
(5, 'https://via.placeholder.com/600x600/FF69B4/FFFFFF?text=Keyboard', 'Mechanical Keyboard', 0),
(6, 'https://via.placeholder.com/600x600/708090/FFFFFF?text=T-Shirt', 'Classic Cotton T-Shirt', 0),
(7, 'https://via.placeholder.com/600x600/4682B4/FFFFFF?text=Jeans', 'Denim Jeans', 0),
(8, 'https://via.placeholder.com/600x600/DC143C/FFFFFF?text=Running+Shoes', 'Running Shoes', 0),
(9, 'https://via.placeholder.com/600x600/2F4F4F/FFFFFF?text=Jacket', 'Winter Jacket', 0),
(10, 'https://via.placeholder.com/600x600/8B4513/FFFFFF?text=Wallet', 'Leather Wallet', 0),
(11, 'https://via.placeholder.com/600x600/D2691E/FFFFFF?text=Coffee+Mugs', 'Ceramic Coffee Mug Set', 0),
(12, 'https://via.placeholder.com/600x600/9370DB/FFFFFF?text=Pillows', 'Throw Pillow Set', 0),
(13, 'https://via.placeholder.com/600x600/FFD700/FFFFFF?text=Desk+Lamp', 'LED Desk Lamp', 0),
(14, 'https://via.placeholder.com/600x600/90EE90/FFFFFF?text=Cutting+Board', 'Bamboo Cutting Board', 0),
(15, 'https://via.placeholder.com/600x600/E6E6FA/FFFFFF?text=Diffuser', 'Essential Oil Diffuser', 0),
(16, 'https://via.placeholder.com/600x600/000080/FFFFFF?text=Programming+Book', 'The Art of Programming', 0),
(17, 'https://via.placeholder.com/600x600/008B8B/FFFFFF?text=Mindful+Living', 'Mindful Living', 0),
(18, 'https://via.placeholder.com/600x600/4B0082/FFFFFF?text=SciFi+Books', 'Science Fiction Collection', 0),
(19, 'https://via.placeholder.com/600x600/9932CC/FFFFFF?text=Yoga+Mat', 'Yoga Mat Premium', 0),
(20, 'https://via.placeholder.com/600x600/228B22/FFFFFF?text=Camping+Tent', 'Camping Tent 4-Person', 0),
(21, 'https://via.placeholder.com/600x600/FF4500/FFFFFF?text=Resistance+Bands', 'Fitness Resistance Bands', 0);