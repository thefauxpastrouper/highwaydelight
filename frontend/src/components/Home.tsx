import ExperienceCard from "./ExperienceCard";
import Header from "./Header";
import api from "./AxiosRequest";
import type { AxiosPromise} from "axios";
import { useEffect, useState } from "react";
import { type Experience } from "./data/experiences";
  

const getExperiences = async (): AxiosPromise<Experience[]> => {
  console.log("Fetching experiences from API:", import.meta.env.VITE_API_BASE_URL);
  return api.get("/experiences");
};
const Home = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
        getExperiences()
        .then((response) => {
          console.log("Fetched experiences:", response.data);
          setExperiences(response.data);
        })
        .catch((err) => {
          console.error("Failed to fetch experiences:", err);
        });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Discover Adventures</h1>
          <p className="text-muted-foreground">Curated experiences for thrill-seekers and nature lovers</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {experiences.map((experience) => (
            <ExperienceCard key={experience._id} {...experience} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;