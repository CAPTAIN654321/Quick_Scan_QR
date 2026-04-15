const express = require("express");
const router = express.Router();
const Order = require("../models/orderModel");

router.post("/add", async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({
            message: "Order placed successfully",
            data: newOrder
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/all", async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
