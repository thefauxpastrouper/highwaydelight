import mongoose from 'mongoose';

const timeSlotAndPriceSchema = new mongoose.Schema({
  time: { type: String, required: true },
  availableSeats: { type: Number, default: 0 },
  status: { type: String, enum: ["available", "sold out"], default: "available" },
  price: { type: Number, required: true },
});

const dateAvailabilitySchema = new mongoose.Schema({
  date: { type: String, required: true },
  timeSlots: [timeSlotAndPriceSchema],
});

const experienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String, required: true },
    fullDescription: { type: String, default: "Experience the thrill of river rafting with expert guides." },
    included: { type: [String], default: ["Safety gear", "Guided tour", "Refreshments"] },
    duration: { type: String, default: "3-4 hours" },
    groupSize: { type: String, default: "Up to 12 people" },
    dates: [dateAvailabilitySchema],
  },
  { timestamps: true }
);

const bookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: "Experience", required: true },
  fullName: {type: String, required:true},
  email: {type: String, required:true},
  bookingDate: {type: String, required:true},
  time: {type: String, required:true},
  quantity: {type: Number, required:true},
  subtotal: {type: Number, required:true},
  taxes: {type: Number, required:true},
  discount: {type: Number, required:false},
  totalPrice: {type: Number, required:true}
});
  
export default mongoose.model("Experience", experienceSchema);
export const Booking = mongoose.model("Booking", bookingSchema);
