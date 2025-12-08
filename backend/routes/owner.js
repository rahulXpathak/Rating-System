const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { storeOwnerAuth } = require('../middleware/auth');

// GET /api/owner/dashboard - Fetches the dashboard for a store owner
router.get('/dashboard', storeOwnerAuth, async (req, res) => {
    try {
        const ownerId = req.user.id;

        // Find the store owned by this user
        const [stores] = await db.query('SELECT id FROM stores WHERE owner_id = ?', [ownerId]);
        if (stores.length === 0) {
            return res.status(404).json({ message: 'You do not own a store.' });
        }
        const storeId = stores[0].id;

        // Get average rating for the store
        const [avgRatingResult] = await db.query(
            'SELECT AVG(rating) as averageRating FROM ratings WHERE store_id = ?',
            [storeId]
        );
        const averageRating = avgRatingResult[0].averageRating || 0;

        // Get list of users who have rated the store with sorting
        let ratersQuery = `
            SELECT u.id, u.name, u.email, r.rating, r.updated_at 
            FROM ratings r
            JOIN users u ON r.user_id = u.id
            WHERE r.store_id = ?
        `;

        // Add sorting
        const sort = req.query.sort || 'updated_at';
        const order = req.query.order === 'asc' ? 'ASC' : 'DESC';
        const sortableColumns = ['name', 'rating', 'updated_at'];

        if (sortableColumns.includes(sort)) {
            ratersQuery += ` ORDER BY ${sort === 'name' ? 'u.name' : 'r.' + sort} ${order}`;
        } else {
            ratersQuery += ' ORDER BY r.updated_at DESC';
        }

        const [raters] = await db.query(ratersQuery, [storeId]);

        res.json({
            storeId,
            averageRating,
            ratings: raters,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
