import {z} from 'zod';
export const BookingSchema = z.object({
    experienceId: z.string().min(1),
    fullName: z.string().min(1),
    email: z.email(),
    bookingDate: z.string().min(1),
    time: z.string().min(1),
    quantity: z.number().nonnegative(),
    subtotal: z.number().nonnegative(),
    taxes: z.number().nonnegative(),
    discount: z.number().nonnegative().optional(),
    totalPrice: z.number().nonnegative()
});


export const PromoCodeSchema = z.object({
    promoCode: z.string().min(1)
});

// export const ExperienceSchema = z.object({
//     title: z.string().min(1),
//     location: z.string().min(1),
//     price: z.number().nonnegative(),
//     image: z.url(),
//     desciption: z.string().min(1),
//     fullDescription: z.string().min(1),
//     included: z.array(z.string()),
//     duration: z.string().min(1),
//     groupSize: z.string().min(1),
//     dates: z.array(z.object({
//         date: z.string().min(1),
//         timeSlots: z.array(z.object({
//             time: z.string().min(1),
//             availableSeats: z.number().nonnegative(),
//             status: z.enum(["available", "sold out"]),
//             price: z.number().nonnegative(),
//         }))
//     }))
// })