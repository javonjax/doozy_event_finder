import { NavLink } from "react-router-dom";
import { ColorClasses } from "@/schemas/schemas";
import clsx from "clsx";

export interface HomeCardProps {
  path: string;
  label: string;
  icon: React.ReactNode;
  color?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const Card = ({
  path,
  label,
  icon,
  onClick,
  color,
}: HomeCardProps): React.JSX.Element => {
  const handleCardClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  // Control the card colors with props.
  let colors: string;
  if (color && Object.keys(ColorClasses).includes(color)) {
    colors = ColorClasses[color];
  } else {
    colors = "bg-black text-white hover:bg-white hover:text-black";
  }

  return (
    <NavLink
      className={clsx(
        "duration-400 relative flex h-[250px] min-h-[175px] w-[70%] transform cursor-pointer overflow-hidden rounded-2xl border-2 transition-all hover:scale-105 md:h-full md:w-[30%]",
        colors,
      )}
      onClick={handleCardClick}
      to={path}
    >
      <div
        className={`absolute left-0 top-2 ${path === "/popular" ? "text-orange-400" : ""}`}
      >
        {icon}
      </div>
      <label className="absolute bottom-4 right-4 cursor-pointer text-[1.5rem]">
        {label}
      </label>
    </NavLink>
  );
};

export default Card;
