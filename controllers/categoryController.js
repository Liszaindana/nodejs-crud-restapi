import db from '../config/db.js';

// CREATE
export const createCategory = (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Nama kategori wajib diisi' });
    }

    db.query("INSERT INTO categories (name) VALUES (?)", [name], (err, results) => {
        if (err) return res.status(500).json({ message: err });

        // Query ulang untuk mengambil data lengkap termasuk timestamp (created_at)
        db.query("SELECT * FROM categories WHERE id = ?", [results.insertId], (err, rows) => {
            if (err) return res.status(500).json({ message: err });
            
            res.status(201).json({
                message: 'Category created successfully',
                data: rows[0] // Sekarang muncul id, name, created_at, dan updated_at
            });
        });
    });
};

// READ ALL
export const getCategories = (req, res) => {
    db.query("SELECT * FROM categories", (err, results) => {
        if (err) return res.status(500).json({ message: err });
        
        res.json(results);
    });
};

// READ BY ID
export const getCategoryById = (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM categories WHERE id = ?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: err });

        if (results.length === 0)
            return res.status(404).json({ message: "Kategori tidak ditemukan" });

        res.json(results[0]);
    });
};

// UPDATE
export const updateCategory = (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    db.query("UPDATE categories SET name=? WHERE id=?", [name, id], (err, results) => {
        if (err) return res.status(500).json({ message: err });

        // Query ulang untuk mengambil data terbaru termasuk updated_at
        db.query("SELECT * FROM categories WHERE id = ?", [id], (err, rows) => {
            if (err) return res.status(500).json({ message: err });
            
            res.json({ 
                message: "Category updated successfully",
                data: rows[0] 
            });
        });
    });
};

// DELETE
export const deleteCategory = (req, res) => {
    const { id } = req.params;

    db.query("DELETE FROM categories WHERE id=?", [id], (err, results) => {
        if (err) return res.status(500).json({ message: err });

        res.json({ message: "Category deleted successfully" });
    });
};