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
      className={`p-4 rounded-lg text-center ${bgColor} border ${borderColor}`}
    >
      <Icon className={`h-6 w-6 mx-auto ${textColor}`} />
      <h3 className={`text-sm font-semibold mt-2 ${textColor}`}>{value}</h3>
      <p className="text-xs text-gray-700 dark:text-gray-300">{title}</p>
    </div>
  );
};

export default StatsCard;
