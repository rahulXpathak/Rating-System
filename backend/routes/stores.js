const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { auth } = require('../middleware/auth');

// GET /api/stores - List all registered stores with search and sort
router.get('/', auth, async (req, res) => {
    try {
        const { search, sort, order = 'ASC' } = req.query;
        const userId = req.user.id;

        let query = `
            SELECT 
                s.id, 
                s.name, 
                s.address,
                s.email,
                COALESCE(AVG(r.rating), 0) AS overall_rating,
                (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) AS my_rating
            FROM stores s
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const queryParams = [userId];

        if (search) {
            query += ' AND (s.name LIKE ? OR s.address LIKE ?)';
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        query += ' GROUP BY s.id';

        if (sort) {
            const sortableColumns = ['name', 'address', 'overall_rating'];
            if (sortableColumns.includes(sort)) {
                query += ` ORDER BY ${sort} ${order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}`;
            }
        }

        const [stores] = await db.query(query, queryParams);
        res.json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/stores/:storeId/rate - Submit or update a rating
router.post('/:storeId/rate', auth, async (req, res) => {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        // Check if store exists
        const [stores] = await db.query('SELECT id FROM stores WHERE id = ?', [storeId]);
        if (stores.length === 0) {
            return res.status(404).json({ message: 'Store not found.' });
        }

        const newRating = {
            user_id: userId,
            store_id: storeId,
            rating: rating
        };

        // Using INSERT ... ON DUPLICATE KEY UPDATE to handle both create and update
        await db.query(
            'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = ?',
            [userId, storeId, rating, rating]
        );

        res.status(200).json({ message: 'Rating submitted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT is redundant because of the POST logic, but included for API spec completeness
// PUT /api/stores/:storeId/rate - Modify an existing rating
router.put('/:storeId/rate', auth, async (req, res) => {
    const { storeId } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
    }

    try {
        const [result] = await db.query(
            'UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?',
            [rating, userId, storeId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'No existing rating found for this store to update.' });
        }

        res.json({ message: 'Rating updated successfully.' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});


module.exports = router;
