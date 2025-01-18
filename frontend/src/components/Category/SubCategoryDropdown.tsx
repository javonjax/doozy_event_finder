import { GenreData } from "@/schemas/schemas";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ListFilter } from "lucide-react";

export interface SubCategoryDropdownProps {
  subcategories: Array<GenreData> | null | undefined;
  selectedSubcategory: GenreData | undefined;
  handleSubCategoryChange: (item?: GenreData) => void;
}

const SubCategoryDropdown = ({
  subcategories,
  selectedSubcategory,
  handleSubCategoryChange,
}: SubCategoryDropdownProps): React.JSX.Element => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          className="mb-4 min-w-[300px] max-w-[60%] border-orange-400 text-[hsl(var(--text-color))] xl:mb-0"
          variant="outline"
        >
          <ListFilter />
          {selectedSubcategory
            ? selectedSubcategory.name
            : "Filter by subcategory"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        avoidCollisions={false}
        className="max-h-[350px] w-56 overflow-y-auto text-[hsl(var(--text-color))]"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleSubCategoryChange()}>
            Show all
          </DropdownMenuItem>
          {subcategories?.map((item) => {
            return (
              <DropdownMenuItem
                key={item.id}
                onClick={() => handleSubCategoryChange(item)}
              >
                {item.name}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SubCategoryDropdown;
