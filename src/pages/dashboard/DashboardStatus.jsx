import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const DashboardStatus = () => {
  const deploymentData = [
    { name: "Unmanaged", value: 14, color: "#f87171" },
    { name: "Unprotected", value: 1, color: "#fbbf24" },
    { name: "Protected", value: 4, color: "#34d399" },
  ];

  const protectionData = [
    { name: "Critical", value: 1, color: "#f87171" },
    { name: "Warning", value: 2, color: "#fbbf24" },
    { name: "OK", value: 3, color: "#34d399" },
  ];

  const databaseData = [
    { name: "More than a week ago", value: 4, color: "#f87171" },
    { name: "Within last 7 days", value: 1, color: "#fbbf24" },
    { name: "Within last 3 days", value: 8, color: "#c084fc" },
    { name: "Within last 24 hours", value: 20, color: "#34d399" },
  ];

  // ✅ Dynamically calculate total for center label
  const totalDeployment = deploymentData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalProtection = protectionData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalDatabase = databaseData.reduce((sum, item) => sum + item.value, 0);

  const attentionRequired = [
    {
      client: "Kaspersky Management Console",
      totalComputers: 9,
      computerStatus: "Critical 1",
      deploymentStatus: "Unmanaged 6",
      protectionStatus: "Unprotected 1",
      databaseStatus: "More than a week ago 2",
    },
  ];

  const renderDonut = (data, centerLabel) => (
    <div className="relative flex justify-center items-center w-full max-w-[250px] mx-auto">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={50}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute font-bold text-lg sm:text-xl text-gray-700 dark:text-gray-200">
        {centerLabel}
      </div>
    </div>
  );

  return (
    <div className="p-1 sm:p-6 bg-white dark:bg-gray-900 min-h-screen sm:w-full w-[400px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            Stock Status
          </h3>
          {renderDonut(deploymentData, totalDeployment)}
          <div className="mt-3 text-sm sm:text-md space-y-1">
            {deploymentData.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between text-gray-600 dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Protection Status */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            Sell Status
          </h3>
          {renderDonut(protectionData, totalProtection)}
          <div className="mt-3 text-sm sm:text-md space-y-1">
            {protectionData.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between text-gray-600 dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Database Status */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 shadow">
          <h3 className="text-center text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
            Medicine Status
          </h3>
          {renderDonut(databaseData, totalDatabase)}
          <div className="mt-3 text-sm sm:text-md space-y-1">
            {databaseData.map((d, idx) => (
              <div
                key={idx}
                className="flex justify-between text-gray-600 dark:text-gray-300"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.color }}
                  ></span>
                  {d.name}
                </span>
                <span>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attention Required Table */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow">
        <h3 className="px-4 py-3 text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 border-b">
          Attention Required
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-md">
            <thead className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Total Computers</th>
                <th className="p-3 text-left">Computer Status</th>
                <th className="p-3 text-left">Deployment Status</th>
                <th className="p-3 text-left">Protection Status</th>
                <th className="p-3 text-left">Database Status</th>
              </tr>
            </thead>
            <tbody>
              {attentionRequired.map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-300 dark:border-gray-700"
                >
                  <td className="p-3">{row.client}</td>
                  <td className="p-3">{row.totalComputers}</td>
                  <td className="p-3 text-red-500">{row.computerStatus}</td>
                  <td className="p-3 text-red-500">{row.deploymentStatus}</td>
                  <td className="p-3 text-yellow-500">
                    {row.protectionStatus}
                  </td>
                  <td className="p-3 text-red-500">{row.databaseStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatus;
