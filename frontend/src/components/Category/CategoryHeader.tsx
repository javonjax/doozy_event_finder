import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";

// Header image and nav links for CategoryLanding.
const CategoryHeader = (): React.JSX.Element => {
  const path: string = useLocation().pathname.slice(1).toLowerCase();
  // const lowQualityImg: string = `${path}_header_lq.webp`;
  const highQualityImg: string = `${path}_header.webp`;
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = highQualityImg;
    img.onload = () => {
      setIsLoaded(true);
    };
  }, [highQualityImg]);

  return (
    <div className="relative my-4 h-[250px] w-full overflow-hidden rounded-2xl bg-cover bg-center">
      {!isLoaded && (
        <Skeleton
          className={`h-full w-full bg-white/10 transition-opacity ${isLoaded ? "opacity-0" : "opacity-100"}`}
        />
      )}
      <img
        loading="lazy"
        src={highQualityImg}
        alt={`${path} category header image.`}
        className={`h-full w-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute left-4 top-4 rounded-2xl bg-[hsl(var(--background))] p-4 text-[hsl(var(--text-color))]">
        <NavLink to={"/"} className="hover:text-orange-400">
          Home
        </NavLink>
        <span> / </span>
        <NavLink to={`/${path}`} className="text-orange-400">
          {path.charAt(0).toUpperCase() + path.slice(1)}
        </NavLink>
      </div>
    </div>
  );
};

export default CategoryHeader;
