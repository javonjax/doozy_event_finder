import CategoryHeader from './CategoryHeader';
import CategoryContent from './CategoryContent';


const CategoryLanding = ({ path }: {path: string}): React.JSX.Element => {
  return (
    <>
    <div className='max-w-7xl w-full h-full'>
       <div className='mx-4 flex flex-col items-center'>
         <CategoryHeader />
         <CategoryContent />
       </div>
    </div>
    </>
  );
};

export default CategoryLanding;
