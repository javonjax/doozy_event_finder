import CategoryHeader from './CategoryHeader';
import CategoryContent from './CategoryContent';


const CategoryLanding = ({ path }: {path: string}): React.JSX.Element => {
  return (
    <>
    <div className='max-w-7xl w-full h-full'>
       <div className='mx-4'>
         <CategoryHeader />
         <CategoryContent />
       </div>
    </div>
    </>
  );
};

export default CategoryLanding;
