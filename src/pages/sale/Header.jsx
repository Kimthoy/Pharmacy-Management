const Header = ({
  searchQuery,
  setSearchQuery,
  isCompoundMode,
  setCompoundModeType, // updated prop to handle switching tab
  openRetailSaleModal,
}) => {
  return (
    <header className="mb-6 z-10">
      <div className="flex justify-between items-center   bg-white">
        <input
          type="text"
          placeholder="ស្វែងរកថ្នាំ ..."
          aria-label="ស្វែងរកផលិតផល"
          className="sm:w-full max-w-md p-2 border  focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200 "
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center   gap-1 bg-gray-300 dark:bg-gray-800 border  p-1 ">
          <button
            onClick={() => setCompoundModeType("regular")}
            className={`px-4 py-2 text-sm transition ${
              !isCompoundMode
                ? "bg-emerald-500 text-white"
                : "text-gray-700 dark:text-white"
            }`}
          >
            លក់ដុំ
          </button>
          <button
            onClick={() => setCompoundModeType("compound")}
            className={`px-4 py-2 text-sm transition ${
              isCompoundMode
                ? "bg-emerald-500 text-white"
                : "text-gray-700 dark:text-white"
            }`}
          >
            ថ្នាំផ្សំ
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
