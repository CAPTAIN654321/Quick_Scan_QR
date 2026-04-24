const express = require('express');
const router = express.Router();
const Design = require('../models/designModel');

router.post('/add', async (req, res) => {
    try {
        const newDesign = new Design(req.body);
        await newDesign.save();
        res.status(201).json(newDesign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/getbyid/:id', async (req, res) => {
    try {
        const design = await Design.findById(req.params.id);
        res.json(design);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/getbyuser/:userid', async (req, res) => {
    try {
        const designs = await Design.find({ user: req.params.userid }).sort({ createdAt: -1 });
        res.json(designs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.put('/update/:id', async (req, res) => {
    try {
        const updatedDesign = await Design.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedDesign);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        await Design.findByIdAndDelete(req.params.id);
        res.json({ message: 'Design deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
