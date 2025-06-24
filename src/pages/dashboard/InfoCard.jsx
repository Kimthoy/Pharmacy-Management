// import { Button } from "../../components/ui/Button";

import { Link } from "react-router-dom";

const InfoCard = ({ icon: Icon, title, content, linkLabel, linkTo }) => (
  <div className="bg-white shadow-lg sm:shadow-md dark:bg-gray-800  rounded-lg p-4  transition-all dark:hover:shadow-gray-500">
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icon className="h-5 w-5 text-gray-500 dark:text-gray-300 mr-2" />
        <h3 className="text-md  text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      {linkLabel && linkTo && (
        <Link
          to={linkTo}
          className="text-md underline text-blue-600 hover:underline dark:text-blue-700"
        >
          {linkLabel}
        </Link>
      )}
    </div>
    <p className="font-extralight text-gray-500 mt-4 text-md dark:text-gray-500">
      {content}
    </p>
  </div>
);

export default InfoCard;
