// this is the main file for any backend folder
const express = require('express');
const UserRouter = require('./router/userRouter');
const QRRouter = require('./router/qrRouter');
const AdminRouter = require('./router/adminRouter');

const TemplateRouter = require('./router/templateRouter');
const OrderRouter = require('./router/orderRouter');
const cors = require('cors');
require('./connection')
const app = express();
const port = 5000;

// Permissive CORS for local development
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Log all requests for debugging
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/user', UserRouter);
app.use('/qr', QRRouter);
app.use('/admin', AdminRouter);
app.use('/template', TemplateRouter);
app.use('/order', OrderRouter);

//route or endpoint
app.get('/',(req,res) =>{
    res.send('response from express');
});

//add
app.get('/add',(req,res) =>{
    res.send('response from add');
});

//getall
app.get('/getall',(req,res) =>{
    res.send('response from getall');
});

//delete
app.get('/delete',(req,res) =>{
    res.send('response from delete');
});

//update
app.get('/update',(req,res) =>{
    res.send('response from update');
});



app.listen(port, '0.0.0.0', () => {
    const networkInterfaces = require('os').networkInterfaces();
    let localIp = 'localhost';
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                localIp = net.address;
                break;
            }
        }
    }
    console.log(`Server started on http://0.0.0.0:${port} (also accessible at http://${localIp}:${port})`);
    
    // Auto-seed Admin Accounts on Startup
    const User = require('./models/userModel');
    const seedAdmins = async () => {
        try {
            const accounts = [
                { name: 'System Admin', email: 'admin@smartqr.com', password: '4321', role: 'admin' },
                { name: 'Rahul Varma', email: 'rahulvarma100000@gmail.com', password: '4321', role: 'admin' },
                { name: 'Mariya', email: 'quibtiamariya@gmail.com', password: '1234', role: 'admin' }
            ];
            for (const acc of accounts) {
                const existing = await User.findOne({ email: acc.email });
                if (existing) {
                    // Update role and password for both accounts to ensure access
                    if (acc.email === 'admin@smartqr.com' || acc.email === 'rahulvarma100000@gmail.com') {
                    existing.role = 'admin';
                    existing.password = acc.password;
                    existing.status = 'approved';
                    await existing.save();
                    console.log(`[SEED] Verified ${acc.email} admin clearance`);
                    } else if (existing.role !== 'admin') {
                        existing.role = 'admin';
                        await existing.save();
                        console.log(`[SEED] Promoted ${acc.email} to ADMIN`);
                    }
                } else {
                    await new User(acc).save();
                    console.log(`[SEED] Created ADMIN account: ${acc.email}`);
                }
            }
        } catch (e) { console.error('[SEED ERROR]', e); }
    };
    seedAdmins();
});