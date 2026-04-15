const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const QR = require('../models/qrModel');
const { verifyAdmin } = require('../middlewares/verifyToken');

// Global metrics for admin dashboard
router.get('/metrics', verifyAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const qrList = await QR.find();
        const scanCount = qrList.reduce((acc, curr) => acc + (curr.scanCount || 0), 0);
        
        res.json({
            userCount,
            qrCount: qrList.length,
            scanCount,
            status: 'Operational'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Management Registry
router.get('/users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/delete-user/:id', verifyAdmin, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Matrix Node Registry
router.get('/qrs', verifyAdmin, async (req, res) => {
    try {
        const qrs = await QR.find();
        res.json(qrs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Any other admin-specific global commands can go here
router.get('/system-status', verifyAdmin, (req, res) => {
    res.json({
        integrity: 'Secure',
        telemetry: 'Active',
        nexus_id: 'V-PRO-99'
    });
});

module.exports = router;
