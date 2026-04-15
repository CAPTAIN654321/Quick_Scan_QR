const express = require("express");
const router = express.Router();
const Template = require("../models/templateModel");

// Get all templates
router.get("/all", (req, res) => {
  Template.find()
    .then(templates => res.json(templates))
    .catch(err => res.status(500).json(err));
});

// Create a new template (Admin functionality)
router.post("/add", (req, res) => {
  const newTemplate = new Template(req.body);
  newTemplate.save()
    .then(template => res.json(template))
    .catch(err => res.status(400).json(err));
});

// Seed initial templates
router.post("/seed", async (req, res) => {
  const initialTemplates = [
    {
      name: "Corporate Nexus",
      category: "Business",
      config: {
        background: { color: "#0B132B", gradient: "linear-gradient(135deg, #14213D 0%, #0B132B 100%)" },
        logo: { url: "", visible: true, text: "QSM" },
        banner: { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80", visible: true },
        title: { text: "Corporate Hub", color: "#ffffff" },
        description: { text: "Connect with our professional network and explore our latest innovations.", color: "#94a3b8" },
        cta: { text: "Learn More", url: "https://example.com", bgColor: "#2563eb", textColor: "#ffffff" },
        qrCode: { visible: true, size: 120, position: "bottom" }
      }
    },
    {
      name: "Creative Portfolio",
      category: "Personal",
      config: {
        background: { color: "#ffffff", gradient: "linear-gradient(to bottom, #fdf2f8, #ffffff)" },
        logo: { url: "", visible: true, text: "CREATIVE" },
        banner: { url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80", visible: true },
        title: { text: "Design Portfolio", color: "#db2777" },
        description: { text: "Showcasing modern digital experiences and visual storytelling.", color: "#4b5563" },
        cta: { text: "View Projects", url: "#", bgColor: "#db2777", textColor: "#ffffff" },
        qrCode: { visible: true, size: 100, position: "center" }
      }
    },
    {
      name: "Digital Menu Pro",
      category: "Restaurant",
      config: {
        background: { color: "#fff7ed", gradient: "none" },
        logo: { url: "", visible: true, text: "TASTE" },
        banner: { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80", visible: true },
        title: { text: "Modern Bistro", color: "#ea580c" },
        description: { text: "Fresh ingredients, bold flavors. Scan to explore our seasonal menu.", color: "#7c2d12" },
        cta: { text: "Open Menu", url: "#", bgColor: "#ea580c", textColor: "#ffffff" },
        qrCode: { visible: true, size: 140, position: "bottom" }
      }
    },
    {
      name: "Grand Opening",
      category: "Events",
      config: {
        background: { color: "#000000", gradient: "linear-gradient(45deg, #000000, #1e1b4b)" },
        logo: { url: "", visible: true, text: "LAUNCH" },
        banner: { url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80", visible: true },
        title: { text: "Exclusive Launch", color: "#818cf8" },
        description: { text: "Join us for the unveiling of our latest flagship location.", color: "#9ca3af" },
        cta: { text: "Get Invite", url: "#", bgColor: "#4f46e5", textColor: "#ffffff" },
        qrCode: { visible: false, size: 120, position: "bottom" }
      }
    },
    {
      name: "Executive Card",
      category: "Business",
      config: {
        background: { color: "#f8fafc", gradient: "none" },
        logo: { url: "", visible: false, text: "" },
        banner: { url: "", visible: false },
        title: { text: "Alex Rivera", color: "#0f172a" },
        description: { text: "Chief Operations Officer | Strategic Growth Lead", color: "#64748b" },
        cta: { text: "Save Contact", url: "#", bgColor: "#0f172a", textColor: "#ffffff" },
        qrCode: { visible: true, size: 80, position: "top" }
      }
    }
  ];

  try {
    await Template.deleteMany({}); // Clear existing
    const savedTemplates = await Template.insertMany(initialTemplates);
    res.json(savedTemplates);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
