import Row from "./Row";
import Card from "./Card";
import { useToast } from "@/hooks/use-toast";
import { Music, Trophy, Film, Drama, Puzzle, Flame, Radar } from "lucide-react";
import { useContext } from "react";
import {
  LocationContext,
  LocationContextProvider,
} from "../Providers/LocationContext";
import { NavigateFunction, useNavigate } from "react-router-dom";

const Home = (): React.JSX.Element => {
  const locationContext = useContext<LocationContextProvider | undefined>(
    LocationContext,
  );
  const navigate: NavigateFunction = useNavigate();
  const { toast } = useToast();

  const handleClickLocalCard: React.MouseEventHandler<
    HTMLAnchorElement
  > = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): Promise<void> => {
    e.preventDefault();
    if (!locationContext) {
      console.error("Location context is unavailable.");
      return;
    }
    try {
      const { requestLocation } = locationContext;
      await requestLocation();
      navigate("/local");
    } catch (error) {
      toast({
        title: "Location Services Required",
        description: "Please enable location services to see local events.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <div className="flex h-full w-full max-w-7xl flex-col items-center">
      <div className="mt-8 flex w-full flex-col items-center text-[hsl(var(--text-color))]">
        <h1 className="text-center text-[2rem]">
          Finding something to do has never been easier.
        </h1>
        <h2 className="text-center text-[1.4rem]">
          Pick a category to get started.
        </h2>
      </div>
      <div className="flex w-full grow flex-col items-center gap-16 p-8">
        <Row>
          <Card
            path={`/popular`}
            label="Popular"
            color="orange"
            icon={<Flame size={120} />}
          />
          <Card
            path={`/local`}
            label="Local"
            icon={<Radar size={120} className="ml-2" />}
            onClick={handleClickLocalCard}
          />
        </Row>
        <Row>
          <Card path={`/music`} label="Music" icon={<Music size={120} />} />
          <Card path={`/sports`} label="Sports" icon={<Trophy size={120} />} />
          <Card path={`/arts`} label="Arts" icon={<Drama size={120} />} />
        </Row>
        <Row>
          <Card path={`/film`} label="Film" icon={<Film size={120} />} />
          <Card path={`/misc`} label="Misc" icon={<Puzzle size={120} />} />
        </Row>
      </div>
    </div>
  );
};

export default Home;
