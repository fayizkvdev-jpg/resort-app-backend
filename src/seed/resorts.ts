import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resort from '../models/Resort';
import connectDB from '../config/db';

dotenv.config();

const images = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3H-VD3Wc2L-4AxhLMZ8jRjQU4hrDXdgwfiw&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0gltIDH2LvxMhsK5KMEZ58Zcq2ifCx2fkNA&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmVBBG2nPwGQPO3qiCbizRb7Bu8MbjdHHCdg&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWKxFcgvsaG0_oJBWEAweULwv0tKPSwL9PoQ&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtSUGqGuSodk1_sYvGA-S-v9y_UVXNeF_MlQ&s',
    'https://media.istockphoto.com/id/536048545/photo/tropical-resort.jpg?s=612x612&w=0&k=20&c=TR9a_ToayikLVagrZlq8ebvZFRZx_WH25q9_9m884Jk='
];

const resortNames = [
    'Paradise Cove', 'Sunset Beach', 'Ocean Breeze', 'Mountain Retreat', 'Tropical Haven',
    'Azure Waters', 'Golden Sands', 'Emerald Isle', 'Serenity Bay', 'Crystal Lagoon',
    'Palm Grove', 'Coral Reef', 'Seaside Bliss', 'Highland Escape', 'Valley View',
    'Forest Hideaway', 'Desert Oasis', 'Lakefront Lodge', 'River Bend', 'Skyline Suites'
];

const facilitiesList = ['Gym', 'Spa', 'WiFi', 'Bar', 'Restaurant', 'Parking', 'Concierge', 'Beach Access'];

const seedResorts = async () => {
    try {
        await connectDB();

        // Clear existing resorts
        await Resort.deleteMany({});
        console.log('Existing resorts cleared');

        const resorts = [];
        for (let i = 0; i < 40; i++) {
            const name = `${resortNames[i % resortNames.length]} ${Math.floor(i / resortNames.length) + 1}`;
            const image = images[i % images.length];
            const price = Math.floor(Math.random() * 5000) + 2000; // Random price between 2000 and 7000
            const pool = Math.random() > 0.3;
            const turf = Math.random() > 0.5;

            const facilities: Record<string, boolean> = {};
            // Add random facilities
            facilitiesList.forEach(fac => {
                if (Math.random() > 0.5) {
                    facilities[fac] = true;
                }
            });

            resorts.push({
                name,
                description: `Experience luxury at ${name}. Enjoy our world-class amenities and breathtaking views. Perfect for a relaxing getaway.`,
                price,
                image,
                pool,
                turf,
                facilities
            });
        }

        await Resort.insertMany(resorts);
        console.log('40 Dummy resorts seeded successfully');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding resorts:', error);
        process.exit(1);
    }
};

seedResorts();
