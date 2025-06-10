// import { Button } from "../../components/ui/Button";

import { Link } from "react-router-dom";

const InfoCard = ({ icon: Icon, title, content, linkLabel, linkTo }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-200">
          {title}
        </h3>
      </div>
      {linkLabel && linkTo && (
        <Link to={linkTo} className="text-xs text-blue-600 hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
    <p className="mt-4 text-xs text-gray-500 dark:text-gray-300">{content}</p>
  </div>
);

export default InfoCard;
