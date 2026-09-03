import dotenv from "dotenv";
import connectDB from "../config/db";
import User from "../models/User";
import bcrypt from "bcrypt";

dotenv.config();

const seedAdmin = async () : Promise<void> => {
    try{

        // vvalidate required environment variables
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;


        if (!adminEmail || !adminPassword) {
            throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment variables.");
        }

        await connectDB();

        const normalizedEmail = adminEmail.toLowerCase().trim();

        // Check if the admin user already exists
        const existingAdmin = await User.findOne({ email: normalizedEmail });


        if (existingAdmin) {
            console.log("Admin user already exists. No action taken.");
        }

         // hash the password before saving

         const salt =await bcrypt.genSalt(10);


        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        await User.create({
            name: "Admin",
            email: normalizedEmail,
            password: hashedPassword,
            role: "admin",
        });

        console.log("administration account created successfully.");

    }catch(error){
        console.error("Error seeding admin user:", error);
        process.exit(1);
    }
}

seedAdmin();