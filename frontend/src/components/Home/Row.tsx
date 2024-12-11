const Row = ({children}: {children: React.ReactNode}): React.JSX.Element => {
  return (
    <div className='w-full flex flex-col md:flex-row grow justify-center items-center gap-16'>
        {children}
    </div>
  );
};

export default Row;
