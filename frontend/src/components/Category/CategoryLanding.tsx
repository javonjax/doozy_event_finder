import CategoryHeader from './CategoryHeader';
import CategoryContent from './CategoryContent';


const CategoryLanding = ({ path }: {path: string}): React.JSX.Element => {
  return (
    <>
    <div className='max-w-7xl w-full h-full'>
        <CategoryHeader />
        <CategoryContent />
    </div>
    </>
  );
};

export default CategoryLanding;
