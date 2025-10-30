import express,{ type Request, type Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Experience, { Booking } from './db/db.js';
import cors from 'cors';
import {BookingSchema, PromoCodeSchema } from './zod/zodSchema.js';

const app = express();
dotenv.config();
app.use(express.json());

app.use(cors({
  origin: [
    'https://highwaydelight.thefauxpastrouper.space',
    'http://localhost:8081', // for local development
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

//mongodb connection logic
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set.");
    }
mongoose.connect(MONGO_URI, {
    authSource: "admin"
    }).then(()=>{
        console.log("✅ MongoDB connected");
    }).catch((err)=>{
        console.error("❌ MongoDB connection error:", err);
    });

const PORT = process.env.PORT || 3000;

app.get('/api/experiences/:id', async (req: Request, res: Response) => {
    try {
        const data = await Experience.findById(req.params.id);

        if (!data) {
      return res.status(404).json({ error: 'Experience not found' });
        }

        res.json(data);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message})
        }
        else {
            res.status(500).json({error: String(err)})
        }
    }  
});

app.get('/api/experiences', async (_req: Request, res: Response) => {
    try {
        const data = await Experience.find({});
        
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No Experiences found' });
        }

        res.json(data);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: String(err) });
        }
    }
});

app.post('/api/bookings', async (req: Request, res: Response) => {
    const result = BookingSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error,
        });
    }
    
    const session = await mongoose.startSession();
    session.startTransaction();
    
    const {
        experienceId,
        fullName,
        email,
        bookingDate,
        time,
        quantity,
        subtotal,
        taxes,
        discount,
        totalPrice,
    } = req.body;
    
    console.log("Incoming payment request:", req.body);
    
    try {
        console.log("hi")

        // ✅ Update available seats - FIXED: Correct path for nested array update
        const updatedExperience = await Experience.findOneAndUpdate(
            { _id: experienceId },
            {
                $inc: {
                "dates.$[dateElem].timeSlots.$[slot].availableSeats": -quantity
                }
            },
            {
                new: true,
                arrayFilters: [
                { 
                    "dateElem.date": bookingDate 
                },
                { 
                    "slot.time": time,
                    "slot.availableSeats": { $gte: quantity }  
                }
                ],
                session,
            }
            );

        
        if (!updatedExperience) {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({ 
                error: "Failed to update available seats." 
            });
        }
        
        console.log("Seats updated successfully");
        
        // ✅ Update sold-out status if needed
        await Experience.updateOne(
            {
                _id: experienceId,
                "dates.date": bookingDate,
                "dates.timeSlots.time": time,
                "dates.timeSlots.availableSeats": { $lte: 0 },
            },
            {
                $set: { 
                    "dates.$[dateElem].timeSlots.$[slot].status": "sold out" 
                },
            },
            {
                arrayFilters: [
                    { "dateElem.date": bookingDate },
                    { "slot.time": time }
                ],
                session,
            }
        );
        
        console.log("Sold-out status updated if needed");
        
        // ✅ Create new booking with proper date
        const newBooking = new Booking({
            experienceId,
            fullName,
            email,
            bookingDate,
            time,
            quantity,
            subtotal,
            taxes,
            discount,
            totalPrice,
        });
        
        await newBooking.save({ session });
        
        await session.commitTransaction();
        session.endSession();
        
        const refId = newBooking._id;
        res.status(201).json({ refId });
        console.log("completed");
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        
        console.error("Booking error:", err);
        
        if (err instanceof Error) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(500).json({ error: String(err) });
        }
    }
});

app.post('/api/promo/validate', async(req:Request, res:Response)=>{
    const result = PromoCodeSchema.safeParse(req.body);
      
    if (!result.success) {
        return res.status(400).json({
            success: false,
            errors: result.error,
        });
    }
    
    const { promoCode } = req.body;

    // Dummy promo code validation logic
    const validPromoCodes: { [key: string]: number } = {
        'SAVE10': 10,
        'DISCOUNT20': 20,
        'OFFER30': 30
    };

    if (promoCode in validPromoCodes) {
        const discount = validPromoCodes[promoCode];
        res.json({ valid: true, discount: discount });
    } else {
        res.json({ valid: false, discount: 0 });
    }
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server running...");
});