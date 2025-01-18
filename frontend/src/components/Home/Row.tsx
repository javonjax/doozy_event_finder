const Row = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  return (
    <div className="flex w-full grow flex-col items-center justify-center gap-16 md:flex-row">
      {children}
    </div>
  );
};

export default Row;
