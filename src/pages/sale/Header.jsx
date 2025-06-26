const Header = ({
  searchQuery,
  setSearchQuery,
  isCompoundMode,
  setCompoundModeType, // updated prop to handle switching tab
  openRetailSaleModal,
}) => {
  return (
    <header className="mb-6">
      <div className="flex justify-between flex-1 items-center mb-4">
        <nav className="sm:flex hidden space-x-4 mb-3">
          <button
            className="text-gray-600 dark:text-white"
            aria-label="ទំព័រដើម"
          >
            ទំព័រដើម
          </button>
          <button className="text-gray-600 dark:text-white" aria-label="ផលិតផល">
            ផលិតផល
          </button>
          <button
            onClick={openRetailSaleModal}
            className="text-emerald-600 hover:border-emerald-600 hover:border border border-emerald-600 px-3 py-2  hover:bg-emerald-600 hover:text-white"
            aria-label="លក់ថ្នាំរាយ"
          >
            លក់ថ្នាំរាយ
          </button>
        </nav>
      </div>

      <div className="flex justify-between items-center ">
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
