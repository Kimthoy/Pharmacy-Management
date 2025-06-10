import { ShieldCheckIcon } from "@heroicons/react/24/outline";

const SystemMonitor = ({ activities }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
    <div className="flex items-center">
      <ShieldCheckIcon className="h-5 w-5 text-indigo-500 dark:text-indigo-300 mr-2" />
      <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-200">
        System Monitor
      </h3>
    </div>
    <ul className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
      {activities.map(({ id, action, time }) => (
        <li key={id} className="flex justify-between">
          <span>{action}</span>
          <span className="text-[10px] text-gray-400">{time}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default SystemMonitor;
