-- ユーザーテーブル
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 商品テーブル
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 注文テーブル
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- サンプルデータ投入
INSERT INTO users (name, email, age) VALUES
('田中太郎', 'tanaka@example.com', 25),
('佐藤花子', 'sato@example.com', 30),
('鈴木次郎', 'suzuki@example.com', 28),
('山田美香', 'yamada@example.com', 35),
('高橋健一', 'takahashi@example.com', 22);

INSERT INTO products (name, description, price, stock) VALUES
('ノートパソコン', '高性能なノートパソコン', 89800.00, 10),
('マウス', 'ワイヤレスマウス', 2980.00, 50),
('キーボード', 'メカニカルキーボード', 12800.00, 25),
('モニター', '24インチ液晶モニター', 23800.00, 15),
('ヘッドホン', 'ノイズキャンセリングヘッドホン', 15800.00, 30);

INSERT INTO orders (user_id, total_amount, status) VALUES
(1, 89800.00, 'completed'),
(2, 15780.00, 'pending'),
(3, 36600.00, 'completed'),
(1, 2980.00, 'shipped'),
(4, 23800.00, 'pending');