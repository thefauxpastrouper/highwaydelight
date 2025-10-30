import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExperienceCard from "./ExperienceCard";
import Header from "./Header";
import api from "./AxiosRequest";
import type {AxiosPromise} from 'axios';
import { type Experience } from "./data/experiences";

const getExperiences = async (): AxiosPromise<Experience[]> => {
    return api.get('experiences');
}
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [experiences, setExperiences] = useState<Experience[]>([]);

   useEffect(() => {
     const storedData = localStorage.getItem("experiences");
 
     if (storedData) {
       // Load from localStorage first
       setExperiences(JSON.parse(storedData));
     } else {
       // Fetch from API if not available locally
       getExperiences()
         .then((response) => {
           console.log("Fetched experiences:", response.data);
           setExperiences(response.data);
           localStorage.setItem("experiences", JSON.stringify(response.data));
         })
         .catch((err) => {
           console.error("Failed to fetch experiences:", err);
         });
     }
   }, []);

  const filteredExperiences = experiences.filter(
    (exp) =>
      exp.title.toLowerCase().includes(query.toLowerCase()) ||
      exp.location.toLowerCase().includes(query.toLowerCase()) ||
      exp.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <h1 className="text-2xl font-bold mb-6">
          Search Results {query && `for "${query}"`}
        </h1>
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredExperiences.map((experience) => (
              <ExperienceCard key={experience._id} {...experience} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No experiences found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
