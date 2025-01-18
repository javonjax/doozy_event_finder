import CategoryHeader from "./CategoryHeader";
import CategoryContent from "./CategoryContent";

const CategoryLanding = (): React.JSX.Element => {
  return (
    <>
      <div className="h-full w-full max-w-7xl">
        <div className="mx-4 flex flex-col items-center">
          <CategoryHeader />
          <CategoryContent />
        </div>
      </div>
    </>
  );
};

export default CategoryLanding;
