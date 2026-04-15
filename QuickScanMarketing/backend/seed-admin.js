const mongoose = require('./connection');
const User = require('./models/userModel');

const createAdmin = async () => {
    try {
        const adminData = {
            name: "Master Admin",
            email: "admin@smartqr.com",
            password: "adminpassword123",
            role: "admin"
        };

        const existing = await User.findOne({ email: adminData.email });
        if (existing) {
            console.log("Admin user already exists.");
            process.exit();
        }

        await new User(adminData).save();
        console.log("*****************************************");
        console.log("ADMIN ACCOUNT CREATED SUCCESSFULLY");
        console.log("Email: " + adminData.email);
        console.log("Password: " + adminData.password);
        console.log("*****************************************");
        process.exit();
    } catch (err) {
        console.error("Error creating admin:", err);
        process.exit(1);
    }
};

createAdmin();
