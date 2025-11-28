import { Request, Response } from 'express';
import Booking from '../models/Booking';

// Extend Request to include user property from auth middleware
interface AuthRequest extends Request {
    user?: {
        id: string;
        role: string;
    };
}

export const createBooking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const booking = new Booking({
            ...req.body,
            user: req.user.id,
        });
        await booking.save();
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = parseInt(req.query.skip as string) || 0;

        const bookings = await Booking.find()
            .populate('user', 'email')
            .populate('resort', 'name')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments();

        res.json({
            success: true,
            data: bookings,
            pagination: {
                total,
                limit,
                skip,
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getUserBookings = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = parseInt(req.query.skip as string) || 0;

        const bookings = await Booking.find({ user: req.user.id })
            .populate('resort', 'name image')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Booking.countDocuments({ user: req.user.id });

        res.json({
            success: true,
            data: bookings,
            pagination: {
                total,
                limit,
                skip,
                pages: Math.ceil(total / limit),
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};
