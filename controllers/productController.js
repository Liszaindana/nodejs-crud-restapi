import db from '../config/db.js';

// CREATE
export const createProduct = (req, res) => {
    const { category_id, name, price } = req.body;

    if (!category_id || !name || !price) {
        return res.status(400).json({ message: 'Data produk tidak lengkap' });
    }

    db.query(
        "INSERT INTO products (category_id, name, price) VALUES (?, ?, ?)",
        [category_id, name, price],
        (err, results) => {
            if (err) return res.status(500).json({ message: err });

            // Query ulang untuk mengambil data lengkap termasuk timestamp (created_at)
            db.query("SELECT * FROM products WHERE id = ?", [results.insertId], (err, rows) => {
                if (err) return res.status(500).json({ message: err });

                res.status(201).json({
                    message: 'Product created successfully',
                    data: rows[0]
                });
            });
        }
    );
};

// READ ALL
export const getProducts = (req, res) => {
    const sql = `
        SELECT products.*, categories.name AS category_name
        FROM products
        JOIN categories ON products.category_id = categories.id
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ message: err });
        res.json(results);
    });
};

// READ BY ID
export const getProductById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT products.*, categories.name AS category_name
        FROM products
        JOIN categories ON products.category_id = categories.id
        WHERE products.id = ?
    `;

    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ message: err });

        if (results.length === 0)
            return res.status(404).json({ message: "Produk tidak ditemukan" });

        res.json(results[0]);
    });
};

// UPDATE
export const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, price, category_id } = req.body;

    db.query(
        "UPDATE products SET name=?, price=?, category_id=? WHERE id=?",
        [name, price, category_id, id],
        (err, results) => {
            if (err) return res.status(500).json({ message: err });

            // Query ulang untuk mengambil data terbaru termasuk updated_at
            db.query("SELECT * FROM products WHERE id = ?", [id], (err, rows) => {
                if (err) return res.status(500).json({ message: err });

                res.json({ 
                    message: "Product updated successfully",
                    data: rows[0] 
                });
            });
        }
    );
};

// DELETE
export const deleteProduct = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM products WHERE id=?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: err });

        res.json({ message: "Product deleted successfully" });
    });
};