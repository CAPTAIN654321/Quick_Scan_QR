const express = require("express");
const router = express.Router();
const QR = require("../models/qrModel");
const Lead = require("../models/leadModel");

router.post("/generate",async(req,res) => {

try{
    const {link, type, templateId, customConfig} = req.body;
    // #region agent log
    fetch('http://127.0.0.1:7741/ingest/add3f7de-0384-48eb-86e9-6555b454a1f0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'02964d'},body:JSON.stringify({sessionId:'02964d',runId:'run-1',hypothesisId:'H1',location:'backend/router/qrRouter.js:10',message:'qr generate request received',data:{hasLink:!!link,type:type||'dynamic',hasTemplateId:!!templateId,hasCustomConfig:!!customConfig},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const newQR = new QR({
        link,
        type: type || 'dynamic',
        template: templateId || null,
        customConfig: customConfig || {}
    });
    await newQR.save();
    // #region agent log
    fetch('http://127.0.0.1:7741/ingest/add3f7de-0384-48eb-86e9-6555b454a1f0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'02964d'},body:JSON.stringify({sessionId:'02964d',runId:'run-1',hypothesisId:'H1',location:'backend/router/qrRouter.js:20',message:'qr generate saved',data:{savedId:String(newQR._id),savedType:newQR.type},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    const localIp = req.app.locals.localIp;
    const port = 5000; // Hardcoded as per index.js
    res.status(201).json({
        message:"QR saved successfully",
        data: newQR,
        suggestedScanUrl: `http://${localIp}:${port}/qr/scan/${newQR._id}`
    });
}catch (error) {
    // #region agent log
    fetch('http://127.0.0.1:7741/ingest/add3f7de-0384-48eb-86e9-6555b454a1f0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'02964d'},body:JSON.stringify({sessionId:'02964d',runId:'run-1',hypothesisId:'H1',location:'backend/router/qrRouter.js:26',message:'qr generate failed',data:{errorMessage:error.message},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    res.status(500).json({error: error.message});
}
});
router.get("/all", async (req, res) => {
    try {
        // Optimized: Only fetch the last 10 scans to reduce payload size on low connectivity
        const qrList = await QR.find({}, { scans: { $slice: -10 } }).sort({ createdAt: -1 });
        if (!qrList) {
            return res.json([]);
        }
        const localIp = req.app.locals.localIp;
        const port = 5000;
        const enhancedQrList = qrList.map(qr => ({
            ...qr.toObject(),
            suggestedScanUrl: `http://${localIp}:${port}/qr/scan/${qr._id}`
        }));
        res.json(enhancedQrList);
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7741/ingest/add3f7de-0384-48eb-86e9-6555b454a1f0',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'02964d'},body:JSON.stringify({sessionId:'02964d',runId:'run-1',hypothesisId:'H3',location:'backend/router/qrRouter.js:41',message:'qr all failed',data:{errorMessage:error.message,code:error.code||null},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.error("Database Error (/qr/all):", error);
        // Keep frontend stable even when DB is offline.
        res.json([]);
    }
});
router.put("/update/:id", async (req, res) => {
    try {
        const { link, customConfig } = req.body;
        const updatedQR = await QR.findByIdAndUpdate(
            req.params.id,
            { link, customConfig },
            { new: true } 
        );

        if (!updatedQR) {
            return res.status(404).json({ message: "QR code not found" });
        }

        res.json({
            message: "QR updated successfully",
            data: updatedQR
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/scan/:id", async (req,res)=>{
    try{
        const qr = await QR.findById(req.params.id);
        if(!qr){ return res.status(404).send("QR not found"); }
        
        const html = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quick Scan | Secure Verification</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;700;900&display=swap" rel="stylesheet">
            <style>
                body { font-family: 'Outfit', sans-serif; }
            </style>
        </head>
        <body class="bg-[#0B132B] text-white min-h-screen flex items-center justify-center p-6 italic">
            <div class="max-w-md w-full bg-[#14213D] rounded-3xl p-10 border border-white/5 shadow-2xl text-center space-y-8 relative overflow-hidden">
                <div class="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
                <div class="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl"></div>

                <div class="relative z-10 space-y-6">
                    <div class="w-20 h-20 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(37,99,235,0.2)] animate-pulse">
                        <svg class="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>

                    <div class="space-y-2">
                        <h2 id="title" class="text-2xl font-black uppercase tracking-tighter italic">Secure Verification</h2>
                        <p id="desc" class="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                            This asset is protected by Quick Shield. Grant location access to verify this deployment and proceed to your destination.
                        </p>
                    </div>

                    <div id="spinner" class="hidden">
                        <div class="w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    </div>

                    <div id="error-msg" class="hidden text-[10px] font-black text-rose-500 uppercase tracking-widest bg-rose-500/10 py-3 rounded-lg border border-rose-500/20 mb-4"></div>

                    <div id="form-container" class="space-y-4">
                        <div class="relative">
                            <input id="userName" type="text" placeholder="Full Name (Optional)" class="w-full bg-[#0B132B]/50 border border-white/10 rounded-xl px-5 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600">
                        </div>
                        <div class="relative">
                            <input id="userEmail" type="email" placeholder="Email Address (Optional)" class="w-full bg-[#0B132B]/50 border border-white/10 rounded-xl px-5 py-3 text-xs focus:outline-none focus:border-blue-500/50 transition-all text-white placeholder:text-slate-600">
                        </div>
                    </div>

                    <button id="btn" onclick="requestLocation()" class="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black uppercase tracking-[0.2em] italic text-xs shadow-[0_10px_20px_rgba(37,99,235,0.3)] transition-all transform hover:-translate-y-1 active:scale-95">
                        Verify & Continue
                    </button>
                </div>
            </div>

            <script>
                async function sendDataAndRedirect(lat, lng) {
                    try {
                        const name = document.getElementById('userName').value || "Anonymous";
                        const email = document.getElementById('userEmail').value || "Not provided";

                        const response = await fetch(window.location.origin + '/qr/track/' + '${qr._id}', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ lat, lng, name, email })
                        });
                        const data = await response.json();
                        const envFrontend = "${process.env.FRONTEND_URL || ''}";
                        const defaultFrontendUrl = window.location.protocol + '//' + window.location.hostname + ':3000';
                        const frontendUrl = envFrontend || defaultFrontendUrl;
                        
                        if(data.useTemplate) {
                            const target = frontendUrl + '/view/' + '${qr._id}';
                            // Beta mode: redirect to lead form first to capture initial data
                            window.location.href = frontendUrl + '/form?target=' + encodeURIComponent(target) + '&qrId=' + '${qr._id}';
                        } else if(data.link) {
                            let target = data.link;
                            if (!target.startsWith('http://') && !target.startsWith('https://')) {
                                target = 'https://' + target;
                            }
                            // Only use lead form for external links in beta
                            window.location.href = frontendUrl + '/form?target=' + encodeURIComponent(target) + '&qrId=' + '${qr._id}';
                        } else {
                            showError("Invalid destination node.");
                        }
                    } catch(e) {
                        showError("Nexus connection failure. Retrying...");
                    }
                }

                function showError(msg) {
                    const errorMsg = document.getElementById('error-msg');
                    errorMsg.innerText = msg;
                    errorMsg.classList.remove('hidden');
                    document.getElementById('spinner').classList.add('hidden');
                    document.getElementById('btn').classList.remove('hidden');
                }

                function requestLocation() {
                    const btn = document.getElementById('btn');
                    const spinner = document.getElementById('spinner');
                    const title = document.getElementById('title');
                    const desc = document.getElementById('desc');
                    const form = document.getElementById('form-container');

                    btn.classList.add('hidden');
                    form.classList.add('hidden');
                    spinner.classList.remove('hidden');
                    title.innerText = "AUTHENTICATING...";
                    desc.innerText = "Synchronizing with nearest telemetry node. Please authorize access.";

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                            async (position) => {
                                title.innerText = "VERIFIED";
                                desc.innerText = "Identity confirmed. Relocating matrix...";
                                await sendDataAndRedirect(position.coords.latitude, position.coords.longitude);
                            },
                            async (error) => {
                                title.innerText = "ACCESS DENIED";
                                desc.innerText = "Telemetry restricted. Performing blind jump to destination...";
                                await sendDataAndRedirect(null, null); 
                            },
                            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                        );
                    } else {
                        title.innerText = "INSECURE ORIGIN";
                        desc.innerText = "Secure API unavailable. Redirecting via legacy protocols...";
                        sendDataAndRedirect(null, null);
                    }
                }
            </script>
        </body>
        </html>
        `;
        
        res.send(html);
    } catch (error) {
        const errorHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Quick Scan | Node Error</title>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-[#0B132B] text-white min-h-screen flex items-center justify-center p-6 italic">
            <div class="max-w-md w-full bg-[#14213D] rounded-3xl p-10 border border-white/5 shadow-2xl text-center space-y-8 relative overflow-hidden">
                <div class="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/10 rounded-full blur-3xl"></div>
                
                <div class="relative z-10 space-y-6">
                    <div class="w-20 h-20 bg-rose-600/20 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(225,29,72,0.2)]">
                        <svg class="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>

                    <div class="space-y-2">
                        <h2 class="text-2xl font-black uppercase tracking-tighter italic">Node Offline</h2>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                            The requested deployment node is inactive or has been decommissioned from the matrix.
                        </p>
                    </div>

                    <a href="/" class="block w-full bg-white/5 hover:bg-white/10 text-slate-300 py-4 rounded-xl font-black uppercase tracking-[0.2em] italic text-xs border border-white/5 transition-all">
                        Return to Origin
                    </a>
                </div>
            </div>
        </body>
        </html>
        `;
        res.status(404).send(errorHtml);
    }
});

router.post("/track/:id", async (req, res) => {
    try {
        const qr = await QR.findById(req.params.id);
        if (!qr) { return res.status(404).json({ error: "QR not found" }); }

        const { lat, lng, name, email } = req.body;
        const userAgent = req.headers['user-agent'] || "Unknown";
        const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || "0.0.0.0").replace('::ffff:', '');
        
        // Simple User Agent Parsing
        let browser = "Other";
        if (userAgent.includes("Chrome")) browser = "Chrome";
        else if (userAgent.includes("Firefox")) browser = "Firefox";
        else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browser = "Safari";
        else if (userAgent.includes("Edge")) browser = "Edge";

        let device = "Desktop";
        if (userAgent.includes("Mobi")) device = "Mobile";
        if (userAgent.includes("Tablet")) device = "Tablet";

        let os = "Desktop";
        if (userAgent.includes("Android")) os = "Android";
        else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";
        else if (userAgent.includes("Windows")) os = "Windows";
        else if (userAgent.includes("Mac OS")) os = "macOS";
        else if (userAgent.includes("Linux")) os = "Linux";

        // Hybrid AI/Rules Risk Scoring
        let riskScore = 0;
        let isFraud = false;
        let fraudReason = "";

        // 1. Bot check (+40 risk)
        const botPattern = /bot|crawler|spider|headless|inspect|curl|wget/i;
        if (botPattern.test(userAgent)) {
            riskScore += 40;
            fraudReason = "Bot/Crawler Pattern; ";
        }

        // 2. Velocity check (Same IP scanning too fast) (+60 risk)
        const recentScans = qr.scans.filter(s => 
            s.ip === ip && 
            (Date.now() - new Date(s.timestamp).getTime()) < 60000
        );
        if (recentScans.length >= 3) {
            riskScore += 60;
            fraudReason += "High Velocity Link Spanning; ";
        }

        if (riskScore >= 50) isFraud = true;

        let locationString = "Permission Denied / Unknown";

        if (lat !== null && lng !== null && lat !== undefined && lng !== undefined) {
            try {
                const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                const geoData = await geoRes.json();
                if (geoData && geoData.city) {
                    locationString = `${geoData.city}, ${geoData.principalSubdivision || geoData.countryName}`;
                } else if (geoData && geoData.locality) {
                    locationString = `${geoData.locality}, ${geoData.countryName}`;
                } else {
                    locationString = `GPS [${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}]`;
                }
            } catch (err) {
                locationString = `GPS [${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}]`;
            }
        }

        qr.scanCount = (qr.scanCount || 0) + 1;
        qr.scans.push({
            timestamp: new Date(),
            location: locationString,
            ip,
            userAgent,
            browser,
            os,
            device,
            name: name || "Anonymous",
            email: email || "Not provided",
            isFraud,
            fraudReason,
            riskScore
        });

        await qr.save();
        res.json({ 
            link: qr.link,
            useTemplate: !!qr.template,
            templateId: qr.template,
            customConfig: qr.customConfig
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/getbyid/:id", async (req, res) => {
    try {
        const qr = await QR.findById(req.params.id);
        if (!qr) {
            return res.status(404).json({ error: "QR not found" });
        }
        res.json(qr);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const deletedQR = await QR.findByIdAndDelete(req.params.id);
        if (!deletedQR) {
            return res.status(404).json({ message: "QR not found" });
        }
        res.json({ message: "QR deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/delete-multiple", async (req, res) => {
    try {
        const { ids } = req.body;
        await QR.deleteMany({ _id: { $in: ids } });
        res.json({ message: "Nodes deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/save-lead", async (req, res) => {
    try {
        const { name, email, phoneNumber, qrId, targetUrl, lat, lng } = req.body;
        
        if (!name || !email || !phoneNumber || !targetUrl) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newLead = new Lead({
            name,
            email,
            phoneNumber,
            qrId,
            targetUrl
        });

        await newLead.save();

        // Also update the scans array in the QR model to show lead data and GPS location
        if (qrId) {
            const qr = await QR.findById(qrId);
            if (qr && qr.scans && qr.scans.length > 0) {
                // Find the most recent scan for this IP (roughly matching the user)
                const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || "0.0.0.0").replace('::ffff:', '');
                const lastScanIndex = [...qr.scans].reverse().findIndex(s => s.ip === ip);
                
                if (lastScanIndex !== -1) {
                    const actualIndex = qr.scans.length - 1 - lastScanIndex;
                    qr.scans[actualIndex].name = name;
                    qr.scans[actualIndex].email = email;
                    qr.scans[actualIndex].phoneNumber = phoneNumber;

                    // Update location from GPS if provided
                    if (lat && lng) {
                        let locationString = `GPS [${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}]`;
                        try {
                            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`);
                            const geoData = await geoRes.json();
                            if (geoData && geoData.city) {
                                locationString = `${geoData.city}, ${geoData.principalSubdivision || geoData.countryName}`;
                            } else if (geoData && geoData.locality) {
                                locationString = `${geoData.locality}, ${geoData.countryName}`;
                            }
                        } catch (err) {
                            // Keep coordinates if lookup fails
                        }
                        qr.scans[actualIndex].location = locationString;
                    }
                    await qr.save();
                }
            }
        }

        res.status(201).json({ message: "Lead saved successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/all-leads", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
