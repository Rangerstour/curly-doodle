/*
# Seed Products and Categories Data

1. Seed Categories
- USB Cables, HDMI Cables, Charging Adapters, Power Cables, Audio Cables, Network Cables, Cable Accessories
2. Seed Products
- Realistic sample products for cables, adapters, chargers, and electronics accessories
- All with professional placeholder image URLs
- Mix of featured, best seller, and regular products
- Realistic prices, ratings, and stock levels
*/

INSERT INTO categories (name, slug, description, image_url) VALUES
  ('USB Cables', 'usb-cables', 'High-speed USB cables for all your devices', 'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('HDMI Cables', 'hdmi-cables', 'Premium HDMI cables for crystal clear video', 'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Charging Adapters', 'charging-adapters', 'Fast charging adapters for all devices', 'https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Power Cables', 'power-cables', 'Reliable power cables for all your electronics', 'https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Audio Cables', 'audio-cables', 'Premium audio cables for superior sound quality', 'https://images.pexels.com/photos/3525738/pexels-photo-3525738.jpeg?auto=compress&cs=tinysrgb&w=400'),
  ('Network Cables', 'network-cables', 'Ethernet and network cables for fast connectivity', 'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=400')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO products (name, description, price, compare_price, category, subcategory, image_url, images, rating, review_count, stock, sku, featured, best_seller, tags, specs) VALUES
  (
    'USB-C to USB-C 3.1 Gen 2 Cable (6ft)', 
    'Ultra-fast USB-C to USB-C cable with 3.1 Gen 2 speeds up to 10Gbps. Supports 100W Power Delivery for rapid charging. Braided nylon exterior for durability and tangle-free use. Compatible with laptops, tablets, and smartphones.', 
    19.99, 29.99, 'USB Cables', 'USB-C', 
    'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.8, 234, 156, 'SM-USB-001', true, true, '["fast-charging", "braided", "usb-c", "premium"]',
    '{"Length": "6ft", "Speed": "10Gbps", "Power Delivery": "100W", "Color": "Black", "Material": "Nylon Braided"}'
  ),
  (
    'USB-C to Lightning Cable (4ft)', 
    'MFi-certified USB-C to Lightning cable for fast charging your iPhone and iPad. Supports 18W PD charging for iPhone 8 and later. Reinforced stress points for longevity. Premium aluminum connectors.', 
    16.99, 24.99, 'USB Cables', 'USB-C', 
    'https://images.pexels.com/photos/4792728/pexels-photo-4792728.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.7, 189, 203, 'SM-USB-002', true, false, '["mfi-certified", "fast-charging", "lightning", "iphone"]',
    '{"Length": "4ft", "Certification": "MFi", "Power Delivery": "18W", "Color": "White", "Compatibility": "iPhone/iPad"}'
  ),
  (
    'USB-A to USB-C 3.0 Cable (10ft)', 
    'Versatile USB-A to USB-C cable with USB 3.0 speeds up to 5Gbps. Backward compatible with USB 2.0. Extra-long 10ft length for convenient use. Gold-plated connectors for reliable signal transmission.', 
    12.99, 19.99, 'USB Cables', 'USB-C', 
    'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.5, 127, 312, 'SM-USB-003', false, true, '["usb-3.0", "extra-long", "gold-plated", "versatile"]',
    '{"Length": "10ft", "Speed": "5Gbps", "Connector": "USB-A to USB-C", "Color": "Blue", "Compatibility": "Universal"}'
  ),
  (
    'USB 3.0 Extension Cable (15ft)', 
    'Extend your USB connection with this high-quality USB 3.0 extension cable. Supports data transfer up to 5Gbps and charging. Active signal booster ensures reliable performance over long distances. Shielded for interference protection.', 
    14.99, 22.99, 'USB Cables', 'USB-A', 
    'https://images.pexels.com/photos/4218883/pexels-photo-4218883.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.4, 98, 178, 'SM-USB-004', false, false, '["extension", "active-booster", "shielded", "long-distance"]',
    '{"Length": "15ft", "Speed": "5Gbps", "Type": "Extension", "Color": "Black", "Features": "Active Booster"}'
  ),
  (
    'HDMI 2.1 Cable 8K Ultra HD (6ft)', 
    'Premium HDMI 2.1 cable supporting 8K@60Hz and 4K@120Hz. Supports eARC, HDR10+, Dolby Vision, and ALLM. 48Gbps bandwidth for the ultimate gaming and home theater experience. Gold-plated connectors with braided shielding.', 
    24.99, 39.99, 'HDMI Cables', 'HDMI 2.1', 
    'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.9, 312, 89, 'SM-HDMI-001', true, true, '["8k", "hdmi-2.1", "gaming", "premium", "hdr"]',
    '{"Resolution": "8K@60Hz / 4K@120Hz", "Bandwidth": "48Gbps", "Length": "6ft", "Color": "Black", "Features": "eARC, HDR10+, Dolby Vision"}'
  ),
  (
    'HDMI 2.0 Cable 4K (10ft)', 
    'High-speed HDMI 2.0 cable supporting 4K@60Hz with HDR. 18Gbps bandwidth for crystal-clear video and audio. Ethernet channel support for connected devices. Triple shielded for EMI protection. Universal compatibility with all HDMI devices.', 
    15.99, 24.99, 'HDMI Cables', 'HDMI 2.0', 
    'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.6, 156, 245, 'SM-HDMI-002', true, false, '["4k", "hdmi-2.0", "ethernet", "triple-shielded"]',
    '{"Resolution": "4K@60Hz", "Bandwidth": "18Gbps", "Length": "10ft", "Color": "Black", "Features": "Ethernet, HDR"}'
  ),
  (
    'Micro HDMI to HDMI Cable (5ft)', 
    'Connect your action cameras, tablets, and compact devices to HDMI displays. Supports 4K@30Hz and 1080p@60Hz. Slim, flexible design for portable use. Gold-plated connectors resist corrosion and ensure optimal signal quality.', 
    11.99, 18.99, 'HDMI Cables', 'Micro HDMI', 
    'https://images.pexels.com/photos/442150/pexels-photo-442150.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.3, 87, 167, 'SM-HDMI-003', false, false, '["micro-hdmi", "portable", "4k", "action-camera"]',
    '{"Resolution": "4K@30Hz / 1080p@60Hz", "Length": "5ft", "Connector": "Micro HDMI to HDMI", "Color": "Black", "Use Case": "Cameras, Tablets"}'
  ),
  (
    '65W GaN USB-C Fast Charger', 
    'Revolutionary GaN (Gallium Nitride) technology delivers 65W of power in a compact design. 2 USB-C ports and 1 USB-A port for simultaneous charging. Compatible with laptops, phones, tablets, and Nintendo Switch. Foldable plug for travel.', 
    34.99, 49.99, 'Charging Adapters', 'Wall Chargers', 
    'https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.8, 278, 134, 'SM-CHG-001', true, true, '["gan", "65w", "fast-charging", "multi-port", "travel"]',
    '{"Power": "65W", "Ports": "2x USB-C, 1x USB-A", "Technology": "GaN", "Color": "White", "Features": "Foldable Plug, Smart Power Distribution"}'
  ),
  (
    '100W USB-C PD Charging Station', 
    'Desktop charging station with 4 USB-C ports and 2 USB-A ports. Delivers up to 100W total power output. Intelligent power distribution optimizes charging for each connected device. LED indicators show charging status. Perfect for home office setups.', 
    49.99, 69.99, 'Charging Adapters', 'Charging Stations', 
    'https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.7, 198, 76, 'SM-CHG-002', true, false, '["100w", "charging-station", "desktop", "multi-port", "office"]',
    '{"Power": "100W", "Ports": "4x USB-C, 2x USB-A", "Type": "Desktop Station", "Color": "Black", "Features": "Smart Power Distribution, LED Indicators"}'
  ),
  (
    'Wireless Qi Charging Pad 15W', 
    'Fast wireless charging pad with 15W output for compatible devices. Non-slip silicone surface keeps your phone secure. LED indicator shows charging status. Supports all Qi-enabled devices including iPhone, Samsung Galaxy, and Google Pixel. Compact design.', 
    19.99, 29.99, 'Charging Adapters', 'Wireless', 
    'https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.5, 145, 198, 'SM-CHG-003', false, true, '["wireless", "qi", "15w", "fast-charging", "compact"]',
    '{"Power": "15W", "Standard": "Qi", "Type": "Charging Pad", "Color": "Black", "Features": "Non-slip, LED Indicator"}'
  ),
  (
    'Car Charger Dual USB-C 45W', 
    'Dual USB-C car charger with 45W total output. Supports PD 3.0 and QC 4.0 for fast charging on the road. Aluminum alloy body for heat dissipation. LED ring light for easy locating in the dark. Compatible with all USB-C devices.', 
    22.99, 34.99, 'Charging Adapters', 'Car Chargers', 
    'https://images.pexels.com/photos/4467735/pexels-photo-4467735.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.6, 167, 145, 'SM-CHG-004', false, false, '["car-charger", "dual-port", "45w", "pd-3.0", "aluminum"]',
    '{"Power": "45W", "Ports": "2x USB-C", "Type": "Car Charger", "Color": "Silver", "Features": "PD 3.0, QC 4.0, LED Ring"}'
  ),
  (
    'AC Power Cord 10ft (IEC C13)', 
    'Heavy-duty AC power cord for computers, monitors, printers, and server equipment. 10ft length for flexible placement. 18AWG wire gauge for reliable power delivery. UL listed for safety. Molded connectors for durability. Black PVC jacket.', 
    9.99, 14.99, 'Power Cables', 'AC Power', 
    'https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.4, 203, 412, 'SM-PWR-001', false, true, '["ac-power", "iec-c13", "heavy-duty", "ul-listed", "computer"]',
    '{"Length": "10ft", "Gauge": "18AWG", "Connector": "IEC C13", "Color": "Black", "Certification": "UL Listed"}'
  ),
  (
    'Extension Cord 6-Outlet Surge Protector', 
    'Powerful 6-outlet surge protector with 2 USB ports. 1080 Joules of surge protection for your valuable electronics. 6ft heavy-duty cord. Flat plug design for tight spaces. ETL certified. LED indicator for surge protection status.', 
    27.99, 39.99, 'Power Cables', 'Extension Cords', 
    'https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.7, 256, 178, 'SM-PWR-002', true, true, '["surge-protector", "6-outlet", "usb", "1080j", "flat-plug"]',
    '{"Outlets": "6 AC + 2 USB", "Protection": "1080 Joules", "Length": "6ft", "Color": "White", "Certification": "ETL Certified"}'
  ),
  (
    'Power Strip with USB-C PD 30W', 
    'Modern power strip with 3 AC outlets and 2 USB-C PD ports delivering up to 30W. Perfect for charging laptops, phones, and tablets simultaneously. Compact design ideal for travel. Smart power distribution prevents overload. Safety shutter outlets protect children.', 
    32.99, 44.99, 'Power Cables', 'Power Strips', 
    'https://images.pexels.com/photos/2399840/pexels-photo-2399840.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.5, 134, 89, 'SM-PWR-003', false, false, '["power-strip", "usb-c-pd", "30w", "travel", "compact"]',
    '{"Outlets": "3 AC + 2 USB-C", "Power": "30W PD", "Type": "Power Strip", "Color": "White", "Features": "Safety Shutters, Smart Distribution"}'
  ),
  (
    '3.5mm Audio Cable Premium (6ft)', 
    'Premium 3.5mm stereo audio cable with gold-plated connectors and oxygen-free copper wire. Delivers crystal-clear audio for headphones, speakers, and car stereos. Braided nylon jacket for durability. Right-angle connector for strain relief. Noise-free transmission.', 
    12.99, 19.99, 'Audio Cables', '3.5mm', 
    'https://images.pexels.com/photos/3525738/pexels-photo-3525738.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.6, 178, 267, 'SM-AUD-001', true, false, '["3.5mm", "gold-plated", "oxygen-free-copper", "braided", "premium"]',
    '{"Length": "6ft", "Connector": "3.5mm Stereo", "Material": "Oxygen-Free Copper", "Color": "Black", "Features": "Gold-Plated, Right-Angle"}'
  ),
  (
    'Optical TOSLINK Audio Cable (10ft)', 
    'Digital optical audio cable for lossless audio transmission from TVs, soundbars, and receivers. Gold-plated TOSLINK connectors with protective dust caps. PVC jacket with nylon mesh for durability. Supports Dolby Digital and DTS surround sound. Immune to electromagnetic interference.', 
    14.99, 22.99, 'Audio Cables', 'Optical', 
    'https://images.pexels.com/photos/3525738/pexels-photo-3525738.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.5, 112, 156, 'SM-AUD-002', false, true, '["toslink", "optical", "digital-audio", "lossless", "surround-sound"]',
    '{"Length": "10ft", "Connector": "TOSLINK", "Type": "Digital Optical", "Color": "Black", "Features": "Gold-Plated, Dust Caps, EMI Immune"}'
  ),
  (
    'XLR Microphone Cable (10ft)', 
    'Professional-grade XLR cable for microphones and audio equipment. Oxygen-free copper conductors with braided shield for noise rejection. Heavy-duty metal connectors with strain relief. Suitable for studio, stage, and broadcast use. Neutrik-style connectors for reliable connection.', 
    18.99, 27.99, 'Audio Cables', 'XLR', 
    'https://images.pexels.com/photos/3525738/pexels-photo-3525738.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.7, 89, 134, 'SM-AUD-003', false, false, '["xlr", "microphone", "professional", "studio", "noise-rejection"]',
    '{"Length": "10ft", "Connector": "XLR Male to Female", "Material": "Oxygen-Free Copper", "Color": "Black", "Use Case": "Studio, Stage, Broadcast"}'
  ),
  (
    'Cat 8 Ethernet Cable 40Gbps (10ft)', 
    'Ultra-high-speed Cat 8 Ethernet cable supporting 40Gbps up to 30ft and 2000MHz bandwidth. Shielded with S/FTP construction for zero interference. Perfect for gaming, NAS, servers, and 4K/8K streaming. Gold-plated RJ45 connectors with snagless boot. Future-proof your network.', 
    29.99, 44.99, 'Network Cables', 'Ethernet', 
    'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.9, 198, 67, 'SM-NET-001', true, true, '["cat-8", "40gbps", "gaming", "shielded", "future-proof"]',
    '{"Speed": "40Gbps", "Bandwidth": "2000MHz", "Length": "10ft", "Category": "Cat 8", "Features": "S/FTP, Gold-Plated, Snagless"}'
  ),
  (
    'Cat 6 Ethernet Cable 1Gbps (25ft)', 
    'Reliable Cat 6 Ethernet cable for 1Gbps networking at home or office. 550MHz bandwidth supports high-speed data transfer. Unshielded twisted pair (UTP) with PVC jacket. Snagless RJ45 connectors prevent clip breakage. Available in multiple colors for easy identification.', 
    14.99, 21.99, 'Network Cables', 'Ethernet', 
    'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.6, 245, 389, 'SM-NET-002', true, false, '["cat-6", "1gbps", "home-office", "utp", "snagless"]',
    '{"Speed": "1Gbps", "Bandwidth": "550MHz", "Length": "25ft", "Category": "Cat 6", "Features": "UTP, Snagless, Multiple Colors"}'
  ),
  (
    'Fiber Optic Patch Cable LC to LC (3m)', 
    'Single-mode fiber optic patch cable with LC connectors for high-speed data centers. Low insertion loss and high return loss for optimal signal quality. OFNR rated jacket for riser installations. Yellow 9/125 fiber. Tested and certified for 10G/40G/100G applications.', 
    39.99, 54.99, 'Network Cables', 'Fiber Optic', 
    'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.8, 67, 45, 'SM-NET-003', false, true, '["fiber-optic", "lc-to-lc", "single-mode", "datacenter", "10g"]',
    '{"Type": "Single-Mode", "Connector": "LC to LC", "Length": "3m", "Fiber": "9/125", "Rating": "OFNR"}'
  ),
  (
    'Ethernet Cable Management Kit', 
    'Complete cable management kit for organizing your network cables. Includes 50 cable ties, 20 cable clips, 10 cable sleeves, 5 cable labels, and 2 cable organizers. Keep your desk, server room, and entertainment center tidy. Professional-grade materials for long-lasting use.', 
    16.99, 24.99, 'Cable Accessories', 'Management', 
    'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.5, 156, 234, 'SM-ACC-001', false, true, '["cable-management", "organization", "kit", "desk-tidy", "server-room"]',
    '{"Contents": "50 Ties, 20 Clips, 10 Sleeves, 5 Labels, 2 Organizers", "Type": "Management Kit", "Color": "Black", "Material": "Nylon, Plastic", "Use Case": "Desk, Server Room, Entertainment Center"}'
  ),
  (
    'Cable Tester and Network Tool Kit', 
    'Professional cable tester for RJ45, RJ11, and coaxial cables. Includes crimping tool, wire stripper, and punch-down tool. LED display shows wire mapping and connectivity status. Essential for network installation and troubleshooting. Rugged carrying case included.', 
    44.99, 64.99, 'Cable Accessories', 'Tools', 
    'https://images.pexels.com/photos/459728/pexels-photo-459728.jpeg?auto=compress&cs=tinysrgb&w=600',
    '[]', 4.7, 123, 78, 'SM-ACC-002', true, false, '["cable-tester", "network-tool", "rj45", "crimping", "professional"]',
    '{"Tester": "RJ45, RJ11, Coaxial", "Tools": "Crimping, Stripper, Punch-down", "Display": "LED", "Case": "Rugged Carrying Case", "Use Case": "Installation, Troubleshooting"}'
  )
ON CONFLICT (sku) DO NOTHING;
