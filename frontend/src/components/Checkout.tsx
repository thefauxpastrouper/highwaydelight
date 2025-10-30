import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "./Header";
import { Button } from "./Button";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "./AxiosRequest";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [validDiscount, setValidDiscount] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!bookingData) {
    navigate("/");
    return null;
  }

  const handlePayment = async () => {
    if (!fullName.trim() || !email.trim()) {
      toast.error("Please fill in all required fields", {className: "text-2xl font-bold"});
      return;
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and safety policy",{className: "text-2xl font-bold"});
      return;
    }
    try {
      const response = await api.post("/bookings", {
      experienceId: bookingData.experienceId,
      fullName,
      email,
      bookingDate: bookingData.date,
      time: bookingData.time,
      quantity: bookingData.quantity,
      subtotal: bookingData.subtotal,
      taxes: bookingData.taxes,
      discount: validDiscount ? discount : 0,
      totalPrice: bookingData.total - (validDiscount ? discount : 0),
    });

    if (response.status === 201) {
      toast.success("Payment successful!");
      navigate("/confirmation", { state: { refId: response.data.refId } });
    }

  } catch (error: any) {
    console.error("Error processing payment:", error);
    toast.error(error.response?.data?.message || "Payment failed. Please try again.");
  }
}

async function handleClick() {
  try {
    const response = await api.post('/promo/validate', { promoCode: promoCode });
    
    if (response.data.valid) {
      console.log("Promo code is valid:", response.data);
      setDiscount(response.data.discount);
      setValidDiscount(response.data.valid);
      toast.success("Promo code applied!");
    } else {
      setDiscount(response.data.discount);
      setValidDiscount(response.data.valid);
      console.warn("Invalid promo code:", response.data.message);
      toast.error(response.data.message || "Invalid promo code");
    }

  } catch (error: any) {
    console.error("Error validating promo:", error);
    toast.error(error.response?.data?.message || "Something went wrong!");
  }
}


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Checkout
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Full name</label>
                    <input
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  <Button variant="default" className="bg-foreground text-background hover:bg-foreground/90"
                    onClick={handleClick}
                  >
                    Apply
                  </Button>
                </div>

                <div className="flex items-center space-x-2">
                <CheckboxPrimitive.Root
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                    className="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
                <Check className="h-4 w-4" />
                </CheckboxPrimitive.Indicator>
                </CheckboxPrimitive.Root>
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the terms and safety policy
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span className="font-medium">{bookingData.experience}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{bookingData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">City</span>
                  <span className="font-medium">{bookingData.city}</span>
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{bookingData.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes</span>
                    <span>₹{bookingData.taxes}</span>
                  </div>
                 {validDiscount? <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-green-600 font-medium">
                      -₹{discount}
                    </span>
                  </div> : null}
                  
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total</span>
                    <span>₹{bookingData.total - (validDiscount ? discount : 0)}</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
                  onClick={handlePayment}
                >
                  Pay and Confirm
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
