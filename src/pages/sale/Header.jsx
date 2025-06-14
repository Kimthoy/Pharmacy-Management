const Header = ({
  searchQuery,
  setSearchQuery,
  randomizeProducts,
  isCompoundMode,
  openRetailSaleModal, // New prop to trigger modal
}) => {
  return (
    <header className="mb-6">
      <div className="flex justify-between flex-1 items-center mb-4">
        <h1
          className="text-2xl font-bold dark:text-white"
          aria-label="ឱសថស្ថាន"
        >
          ឱសថស្ថាន
        </h1>
        <nav className="space-x-4">
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
            className="text-emerald-600 hover:border-emerald-600 hover:border border border-emerald-600 px-3 py-2 rounded-md hover:bg-emerald-600 hover:text-white"
            aria-label="លក់ថ្នាំរាយ"
          >
            លក់ថ្នាំរាយ
          </button>
        </nav>
      </div>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="ស្វែងរកថ្នាំ ..."
          aria-label="ស្វែងរកផលិតផល"
          className="w-full max-w-md p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 transition duration-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={randomizeProducts}
          className="btn bg-emerald-500 text-white rounded-xl w-24 px-3 ml-5 transition-all duration-200 ease-in-out transform hover:scale-105 hover:bg-emerald-600 active:bg-emerald-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label={isCompoundMode ? "ប្តូរទៅថ្នាំផ្សំ" : "ថ្នាំកាត់ផ្សំ"}
        >
          {isCompoundMode ? "ថ្នាំផ្សំ" : "ថ្នាំកាត់ផ្សំ"}
        </button>
      </div>
    </header>
  );
};

export default Header;
