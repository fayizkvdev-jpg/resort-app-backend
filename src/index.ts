import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/auth.routes';
import bookingRoutes from './routes/booking.routes';
import resortRoutes from './routes/resort.routes';
import User from './models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://resort-web-app.netlify.app'
        ];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Remove trailing slash from origin for comparison
        const normalizedOrigin = origin.replace(/\/$/, '');

        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/resorts', resortRoutes);

// Seeder
const seedAdmin = async () => {
    const adminEmail = 'admin@resort.com';
    const userEmail = 'user@resort.com';

    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await User.create({
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
        });
        console.log('Admin user seeded');
    }

    const userExists = await User.findOne({ email: userEmail });
    if (!userExists) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('user123', salt);
        await User.create({
            email: userEmail,
            password: hashedPassword,
            role: 'user',
        });
        console.log('Regular user seeded');
    }
};

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    seedAdmin();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
