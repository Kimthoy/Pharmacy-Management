const StatsCard = ({
  icon: Icon,
  title,
  value,
  bgColor,
  textColor,
  borderColor,
}) => {
  return (
    <div
      className={`p-4 rounded-lg sm:shadow-md shadow-lg  transition-all text-center ${bgColor} border ${borderColor}`}
    >
      <Icon className={`sm:h-6 h-8 sm:w-6 w-8 mx-auto  ${textColor}`} />
      <h3 className={`text-md font-semibold mt-2 ${textColor}`}>{value}</h3>
      <p className=" text-white dark:text-gray-200 text-md">{title}</p>
    </div>
  );
};

export default StatsCard;
