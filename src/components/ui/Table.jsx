import React from "react";

export const Table = ({ children }) => (
  <table className="w-full shadow border-collapse border border-gray-300">
    {children}
  </table>
);

export const TableHead = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

export const TableRow = ({ children }) => (
  <tr className="border-b border-gray-300">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="p-2 border border-gray-300">{children}</td>
);

export const TableBody = ({ children }) => <tbody>{children}</tbody>;
