import { GenreData } from '@/schemas/schemas';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface SubCategoryDropdownProps {
  subcategories: Array<GenreData> | null | undefined;
  selectedSubcategory: GenreData | undefined;
  handleSubCategoryChange: (item?: GenreData) => void;
};

const SubCategoryDropdown = ({ subcategories, selectedSubcategory, handleSubCategoryChange }: SubCategoryDropdownProps): React.JSX.Element => {
  return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button className='text-[hsl(var(--text-color))] max-w-[60%] min-w-[300px] mb-4 xl:mb-0 border-orange-400' variant='outline'>
            {selectedSubcategory ? selectedSubcategory.name : 'Filter by subcategory'}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          avoidCollisions={false}
          className='w-56 text-[hsl(var(--text-color))] max-h-[350px] overflow-y-auto'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => handleSubCategoryChange()}>
              Show all
            </DropdownMenuItem>
            {subcategories?.map((item) => {
              return (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => handleSubCategoryChange(item)}>
                  {item.name}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  );
};

export default SubCategoryDropdown;
