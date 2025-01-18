import { Ticket } from "lucide-react";

const Logo = (): React.JSX.Element => {
  return (
    <div className="flex items-center p-4 text-[hsl(var(--text-color))]">
      <Ticket className="-rotate-45 text-orange-400" />
      <span className="ml-1 text-3xl">Doozy</span>
    </div>
  );
};

export default Logo;
