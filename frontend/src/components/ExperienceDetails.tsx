import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import { Button } from "./Button";
import api from "./AxiosRequest";
import type { AxiosPromise } from "axios";
import {type Experience} from "./data/experiences"
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

  const getExperience = async (id: string): AxiosPromise<Experience> => {
  return api.get(`/experiences/${id}`);
  }

const ExperienceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [experience, setExperience] = useState<Experience | null>(null); 

    useEffect(() => {
      if (id) {
        getExperience(id)
          .then((response) => {
            console.log("Fetched experience details:", response.data);
            setExperience(response.data);
          })
          .catch((err) => {
          console.error("Failed to fetch experience details:", err);
        });
      }
  }, [id]);

  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold">Experience not found</h1>
        </div>
      </div>
    );
  }

interface GroupedDate {
  date: string;
  timeSlots: { time: string; slots: string }[];
}

const grouped: GroupedDate[] = experience.dates.map((obj) => {
  const formattedDate = obj.date;

  const timeSlots = obj.timeSlots.map((slot) => ({
    time: slot.time,
    slots: slot.availableSeats
      ? `${slot.availableSeats} left`
      : slot.status || "sold out",
  }));

  return { date: formattedDate, timeSlots };
});

console.log(grouped);

  
  // [
  //   { time: "07:00 am", slots: "6 left" },
  //   { time: "9:00 am", slots: "3 left" },
  //   { time: "11:00 am", slots: "5 left" },
  //   { time: "1:00 pm", slots: "Sold out" }
  // ];

  const subtotal = experience.price * quantity;
  const taxes = Math.round(subtotal * 0.03);
  const total = subtotal + taxes;

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select both date and time.");
      return;
    }

    if (quantity > Number(experience.dates.find(item => item.date === selectedDate)?.timeSlots.find(slot => slot.time === selectedTime)?.availableSeats)) {
      toast.error("Not enough available slots.");
      return;
    }

    navigate("/checkout", {
      state: {
        experienceId: experience._id,
        experience: experience.title,
        date: selectedDate,
        time: selectedTime,
        city: experience.location,
        quantity,
        subtotal,
        taxes,
        total
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Details
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video overflow-hidden rounded-lg mb-6">
              <img
                src={experience.image}
                alt={experience.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h1 className="text-3xl font-bold mb-4">{experience.title}</h1>
            <p className="text-muted-foreground mb-6">{experience.fullDescription}</p>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Choose date</h2>
              <div className="flex gap-2 flex-wrap">
                {grouped.map((item) => (
                  <Button
                    key={item.date}
                    variant={selectedDate === item.date ? "default" : "outline"}
                    onClick={() => setSelectedDate(item.date)}
                    className={selectedDate === item.date ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                  >
                    {item.date}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Choose time</h2>
              <div className="flex gap-2 flex-wrap">
                {grouped
                    .find((item) => item.date === selectedDate)
                    ?.timeSlots.map((slot) => (
                      <Button
                        key={slot.time}
                        variant={
                          slot.slots === "sold out"
                            ? "outline"
                            : selectedTime === slot.time
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          slot.slots !== "sold out" && setSelectedTime(slot.time)
                        }
                        disabled={slot.slots === "sold out"}
                        className={`
                          ${selectedTime === slot.time ? "bg-accent hover:bg-accent/90 text-accent-foreground" : ""}
                          ${slot.slots === "sold out" ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                      >
                        <div className="flex flex-col items-center">
                          <span>{slot.time}</span>
                          <span
                            className={`text-xs ${
                              slot.slots === "sold out" ? "text-destructive" : "text-muted-foreground"
                            }`}
                          >
                            {slot.slots}
                          </span>
                        </div>
                      </Button>
                  ))}

              </div>
              <p className="text-sm text-muted-foreground mt-2">All times are in IST (GMT +5:30)</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground">{experience.included.join(", ")}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm sticky top-24">
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Starts at</span>
                    <span className="text-2xl font-bold">₹{experience.price}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quantity</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes</span>
                      <span>₹{taxes}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total</span>
                      <span>₹{total}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExperienceDetails;
