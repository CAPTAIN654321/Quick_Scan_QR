const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const QR = require('../models/qrModel');
const Order = require('../models/orderModel');
const { verifyAdmin } = require('../middlewares/verifyToken');

router.post('/create-admin', verifyAdmin, async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Personnel identifier (email) already exists in the matrix.' });

        const newAdmin = new User({
            name,
            email,
            password,
            role: 'admin',
            status: 'approved'
        });

        await newAdmin.save();
        res.status(201).json({ message: 'New administrative unit initialized successfully.', user: newAdmin });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Global metrics for admin dashboard
router.get('/metrics', verifyAdmin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const metricsData = await QR.aggregate([
            { $group: { _id: null, qrCount: { $sum: 1 }, totalScans: { $sum: "$scanCount" } } }
        ]);
        const orderCount = await Order.countDocuments();
        const pendingRequests = await User.countDocuments({ status: 'pending' });
        
        res.json({
            userCount,
            qrCount: metricsData[0]?.qrCount || 0,
            scanCount: metricsData[0]?.totalScans || 0,
            orderCount,
            pendingRequests,
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

router.delete('/delete-user/:id', verifyAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user && user.email === 'rahulvarma100000@gmail.com') {
            return res.status(403).json({ message: 'Root Admin account is protected and cannot be decommissioned.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Approval Protocol
router.get('/pending-users', verifyAdmin, async (req, res) => {
    try {
        const users = await User.find({ status: 'pending' });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update-user-status/:id', verifyAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Matrix Node Registry
router.get('/qrs', verifyAdmin, async (req, res) => {
    try {
        const qrs = await QR.find({}, { scans: { $slice: -5 } }).sort({ createdAt: -1 });
        res.json(qrs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Physical Order Registry
router.get('/orders', verifyAdmin, async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Telemetry Feed (Aggregated Scans)
router.get('/telemetry', verifyAdmin, async (req, res) => {
    try {
        // Optimized: Fetch only needed nodes and limit total scans to top 100 across all nodes
        const qrs = await QR.find({}, { scans: { $slice: -30 }, customConfig: 1, link: 1 }).sort({ 'scans.timestamp': -1 }).limit(100);
        
        let allScans = [];
        qrs.forEach(qr => {
            if (qr.scans && qr.scans.length > 0) {
                let nodeTitle = 'Dynamic Node';
                if (qr.customConfig && qr.customConfig.title) {
                    nodeTitle = typeof qr.customConfig.title === 'object' ? qr.customConfig.title.text : qr.customConfig.title;
                }
                
                const qrScans = qr.scans.map(scan => ({
                    ...scan.toObject(),
                    qrId: qr._id,
                    qrLink: qr.link,
                    nodeTitle: nodeTitle
                }));
                allScans = [...allScans, ...qrScans];
            }
        });
        
        allScans.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 100);
        res.json(allScans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/system-status', verifyAdmin, (req, res) => {
    res.json({
        integrity: 'Secure',
        telemetry: 'Active',
        nexus_id: 'V-PRO-99'
    });
});

module.exports = router;
