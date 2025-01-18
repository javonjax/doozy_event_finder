import { MenubarTrigger } from "@/components/ui/menubar";
import { NavLink } from "react-router-dom";

export interface NavBarItemProps {
  path: string;
  label: React.ReactNode;
}

const NavBarItem = ({ path, label }: NavBarItemProps): React.JSX.Element => {
  return (
    <NavLink to={`${path.toLowerCase()}`}>
      <MenubarTrigger className="mx-0 p-4 text-[hsl(var(--text-color))]">
        {label}
      </MenubarTrigger>
    </NavLink>
  );
};

export default NavBarItem;
