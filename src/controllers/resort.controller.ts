import { Request, Response } from 'express';
import Resort from '../models/Resort';

export const createResort = async (req: Request, res: Response): Promise<void> => {
    try {
        const resort = new Resort(req.body);
        await resort.save();
        res.status(201).json({ success: true, data: resort });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getResorts = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = parseInt(req.query.skip as string) || 0;

        const resorts = await Resort.find().skip(skip).limit(limit);
        const total = await Resort.countDocuments();

        res.json({
            success: true,
            data: resorts,
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

export const getResortById = async (req: Request, res: Response): Promise<void> => {
    try {
        const resort = await Resort.findById(req.params.id);
        if (!resort) {
            res.status(404).json({ success: false, message: 'Resort not found' });
            return;
        }
        res.json({ success: true, data: resort });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const updateResort = async (req: Request, res: Response): Promise<void> => {
    try {
        const resort = await Resort.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!resort) {
            res.status(404).json({ success: false, message: 'Resort not found' });
            return;
        }
        res.json({ success: true, data: resort });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const deleteResort = async (req: Request, res: Response): Promise<void> => {
    try {
        const resort = await Resort.findByIdAndDelete(req.params.id);
        if (!resort) {
            res.status(404).json({ success: false, message: 'Resort not found' });
            return;
        }
        res.json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};
