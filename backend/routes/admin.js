const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { adminAuth } = require('../middleware/auth');
const bcrypt = require('bcrypt');

// GET /api/admin/dashboard - Fetches totals
router.get('/dashboard', adminAuth, async (req, res) => {
    try {
        const [users] = await db.query('SELECT COUNT(*) as totalUsers FROM users');
        const [stores] = await db.query('SELECT COUNT(*) as totalStores FROM stores');
        const [ratings] = await db.query('SELECT COUNT(*) as totalRatings FROM ratings');

        res.json({
            totalUsers: users[0].totalUsers,
            totalStores: stores[0].totalStores,
            totalRatings: ratings[0].totalRatings,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/admin/users - Create a new user
router.post('/users', adminAuth, async (req, res) => {
    const { name, email, password, address, role } = req.body;

    // Validation
    const validatePassword = (password) => {
        const regex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,16}$/;
        return regex.test(password);
    };
    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password does not meet requirements.' });
    }
    if (name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
    }

    try {
        const [existingUsers] = await db.query('SELECT email FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const newUser = { name, email, password_hash, address, role };

        const [result] = await db.query('INSERT INTO users SET ?', newUser);
        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/users - List all users with filtering
router.get('/users', adminAuth, async (req, res) => {
    try {
        let query = 'SELECT id, name, email, address, role, status, created_at FROM users WHERE 1=1';
        const queryParams = [];

        if (req.query.name) {
            query += ' AND name LIKE ?';
            queryParams.push(`%${req.query.name}%`);
        }
        if (req.query.email) {
            query += ' AND email LIKE ?';
            queryParams.push(`%${req.query.email}%`);
        }
        if (req.query.address) {
            query += ' AND address LIKE ?';
            queryParams.push(`%${req.query.address}%`);
        }
        if (req.query.role) {
            query += ' AND role = ?';
            queryParams.push(req.query.role);
        }

        // Add sorting
        if (req.query.sort) {
            const sortableColumns = ['name', 'email', 'address', 'role', 'created_at'];
            if (sortableColumns.includes(req.query.sort)) {
                const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
                query += ` ORDER BY ${req.query.sort} ${order}`;
            }
        }

        const [users] = await db.query(query, queryParams);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/admin/stores - Create a new store
router.post('/stores', adminAuth, async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Name and email are required.' });
    }

    try {
        // Optional: Check if owner_id exists and has the 'store_owner' role
        if (owner_id) {
            const [users] = await db.query('SELECT role FROM users WHERE id = ?', [owner_id]);
            if (users.length === 0 || users[0].role !== 'store_owner') {
                return res.status(400).json({ message: 'Invalid owner ID or user is not a store owner.' });
            }
        }

        const newStore = { name, email, address, owner_id };
        const [result] = await db.query('INSERT INTO stores SET ?', newStore);
        res.status(201).json({ message: 'Store created successfully', storeId: result.insertId });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/stores - List all stores with filtering and sorting
router.get('/stores', adminAuth, async (req, res) => {
    try {
        let query = `
            SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
                   u.name as owner_name,
                   COALESCE(AVG(r.rating), 0) as rating
            FROM stores s 
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            WHERE 1=1
        `;
        const queryParams = [];

        // Add filters
        if (req.query.name) {
            query += ' AND s.name LIKE ?';
            queryParams.push(`%${req.query.name}%`);
        }
        if (req.query.email) {
            query += ' AND s.email LIKE ?';
            queryParams.push(`%${req.query.email}%`);
        }
        if (req.query.address) {
            query += ' AND s.address LIKE ?';
            queryParams.push(`%${req.query.address}%`);
        }

        query += ' GROUP BY s.id';

        // Add sorting
        if (req.query.sort) {
            const sortableColumns = ['name', 'email', 'address', 'rating', 'created_at'];
            if (sortableColumns.includes(req.query.sort)) {
                const order = req.query.order === 'desc' ? 'DESC' : 'ASC';
                query += ` ORDER BY ${req.query.sort} ${order}`;
            }
        }

        const [stores] = await db.query(query, queryParams);
        res.json(stores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// GET /api/admin/users/:id - Get user details
router.get('/users/:id', adminAuth, async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, name, email, address, role, status, created_at FROM users WHERE id = ?',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user = users[0];

        // If user is a store owner, get their store rating
        if (user.role === 'store_owner') {
            const [stores] = await db.query(
                `SELECT s.id, s.name, COALESCE(AVG(r.rating), 0) as rating
                 FROM stores s
                 LEFT JOIN ratings r ON s.id = r.store_id
                 WHERE s.owner_id = ?
                 GROUP BY s.id`,
                [user.id]
            );
            if (stores.length > 0) {
                user.store = stores[0];
            }
        }

        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/admin/users/:id/block - Block a user
router.put('/users/:id/block', adminAuth, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const [users] = await db.query('SELECT id, role FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent blocking admin users
        if (users[0].role === 'admin') {
            return res.status(403).json({ message: 'Cannot block admin users.' });
        }

        // Update user status to blocked
        await db.query('UPDATE users SET status = ? WHERE id = ?', ['blocked', userId]);

        res.json({ message: 'User blocked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// PUT /api/admin/users/:id/unblock - Unblock a user
router.put('/users/:id/unblock', adminAuth, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Update user status to active
        await db.query('UPDATE users SET status = ? WHERE id = ?', ['active', userId]);

        res.json({ message: 'User unblocked successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// DELETE /api/admin/users/:id - Delete a user
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if user exists
        const [users] = await db.query('SELECT id, role FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Prevent deleting admin users
        if (users[0].role === 'admin') {
            return res.status(403).json({ message: 'Cannot delete admin users.' });
        }

        // If store owner, check if they have a store with ratings
        if (users[0].role === 'store_owner') {
            const [stores] = await db.query(
                `SELECT s.id, COUNT(r.id) as rating_count 
                 FROM stores s 
                 LEFT JOIN ratings r ON s.id = r.store_id 
                 WHERE s.owner_id = ? 
                 GROUP BY s.id`,
                [userId]
            );

            if (stores.length > 0 && stores[0].rating_count > 0) {
                return res.status(400).json({
                    message: 'Cannot delete store owner with active ratings. Block the user instead.'
                });
            }

            // Delete the store if it exists (and has no ratings)
            if (stores.length > 0) {
                await db.query('DELETE FROM stores WHERE owner_id = ?', [userId]);
            }
        }

        // Delete the user
        await db.query('DELETE FROM users WHERE id = ?', [userId]);

        res.json({ message: 'User deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});


module.exports = router;
