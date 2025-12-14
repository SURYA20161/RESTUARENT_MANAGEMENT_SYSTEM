import express from 'express';
import session from 'express-session';
import dotenv from "dotenv";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from "url";
import passport from 'passport';
import './config/passport.js'; // Import passport configuration
import userRoute from './route/user.route.js';
import productRoute from './route/product.route.js';
import resetPasswordRoute  from './route/resetPassword.route.js';
import orderRoute from './route/order.route.js'
import cartRoute from './route/cart.route.js';
import contactRoute from './route/contact.route.js';
import tableBookingRoute from './route/tableBooking.route.js';


// import multer from 'multer';
// import { CloudinaryStorage } from 'multer-storage-cloudinary';
// import cloudinary from 'cloudinary';

const app = express()
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://elysianfeast.netlify.app', 'https://p1z5bgqv-5173.inc1.devtunnels.ms'],
    credentials: true
  }));

// app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}))
dotenv.config()
const port = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

if (!URI) {
    console.error("MongoDB URI not defined in environment variables");
    process.exit(1);
}

// Cloudinary configuration
// const { v2: cloudinaryv2 } = cloudinary;

// cloudinaryv2.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // Cloudinary storage configuration
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinaryv2,  // Use cloudinary.v2 here
//   params: {
//     folder: 'products', // Cloudinary folder for product images
//     format: async (req, file) => 'png', // File format (e.g., png)
//     public_id: (req, file) => `${Date.now()}-${file.originalname}`, // Unique file name
//   },
// });

// export const upload = multer({ storage });



// connect to MongoDB
try{
    await mongoose.connect(URI);
    console.log("Connected to MongoDB");

    // Import and run admin creation after DB connection
    const createOrUpdateAdmin = (await import('./services/adminService.js')).default;
    await createOrUpdateAdmin();
}
catch(error){
    console.error("Error connecting to MongoDB:", error);
}

// Define __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/user",userRoute);
app.use("/product",productRoute);
app.use('/user', resetPasswordRoute);
app.use('/cart', cartRoute)
app.use('/contact', contactRoute);

app.use("/order", orderRoute); // Prefix for all order-related routes
app.use("/table-booking", tableBookingRoute); // Prefix for all table booking-related routes

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());




app.listen(port, ()=> {
    //(`Server is running on port ${port}`);
});
