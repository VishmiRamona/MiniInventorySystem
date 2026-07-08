const ResponsiveTable = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            {children}
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTable;