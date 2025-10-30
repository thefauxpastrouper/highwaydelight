export interface TimeSlotAndPrice {
  time: string;
  availableSeats: number;
  status: "available" | "sold out";
  price: number;
}

export interface DateAvailability {
  date: string; // using string here because date inputs usually return strings in the UI
  timeSlots: TimeSlotAndPrice[];
}

export interface Experience {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
  fullDescription: string;
  included: string[];
  duration: string;
  groupSize: string;
  dates: DateAvailability[];
}