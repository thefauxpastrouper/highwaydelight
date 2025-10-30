import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

interface ExperienceCardProps {
  _id: string;
  title: string;
  location: string;
  price: number;
  image: string;
  description: string;
}

const ExperienceCard = ({ _id, title, location, price, image, description }: ExperienceCardProps) => {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden border-2 hover:border-primary/20 hover:shadow-xl transition-all duration-300 group">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-lg leading-tight line-clamp-1">{title}</h3>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">{description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">From</span>
            <span className="font-bold text-xl">₹{price}</span>
          </div>
          <Link to={`/experience/${_id}`}>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 rounded-md px-3 bg-accent hover:bg-accent/90 text-accent-foreground font-medium">
              View Details
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
