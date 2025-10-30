import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "./Header";
import { Button } from "./Button";
import { CheckCircle } from "lucide-react";

const Confirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const refId = location.state?.refId;

  useEffect(() => {
    if (!refId) {
      navigate("/");
    }
  }, [refId, navigate]);

  if (!refId) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold">Booking Confirmed</h1>
          
          <p className="text-muted-foreground">
            Ref ID: <span className="font-mono font-medium text-foreground">{refId}</span>
          </p>

          <p className="text-muted-foreground">
            Your booking has been confirmed! We've sent a confirmation email with all the details.
          </p>

          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="mt-4"
          >
            Back to Home
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;
