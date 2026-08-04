import React from 'react';

const TableSkeleton = ({ rows = 6 }) => {
  const rowArray = Array.from({ length: rows });

  return (
    <>
      {rowArray.map((_, idx) => (
        <tr key={idx} className="animate-pulse border-b border-[var(--border-color)]">
          <td className="py-4 px-3 text-center">
            <div className="w-4 h-4 mx-auto bg-slate-700/50 rounded" />
          </td>
          <td className="py-4 px-3">
            <div className="w-28 h-4 bg-slate-700/50 rounded" />
          </td>
          <td className="py-4 px-3">
            <div className="w-24 h-4 bg-cyan-500/20 rounded" />
          </td>
          <td className="py-4 px-3 hidden md:table-cell">
            <div className="w-20 h-4 bg-slate-700/50 rounded" />
          </td>
          <td className="py-4 px-3 hidden lg:table-cell">
            <div className="w-24 h-4 bg-slate-700/40 rounded" />
          </td>
          <td className="py-4 px-3 hidden sm:table-cell">
            <div className="w-16 h-4 bg-slate-700/40 rounded" />
          </td>
          <td className="py-4 px-3 hidden xl:table-cell">
            <div className="w-24 h-4 bg-slate-700/40 rounded" />
          </td>
          <td className="py-4 px-3">
            <div className="w-16 h-5 bg-emerald-500/20 rounded-full" />
          </td>
          <td className="py-4 px-3 hidden sm:table-cell">
            <div className="w-14 h-4 bg-teal-500/20 rounded" />
          </td>
          <td className="py-4 px-3 hidden lg:table-cell">
            <div className="w-20 h-3 bg-slate-700/40 rounded" />
          </td>
          <td className="py-4 px-3 text-right">
            <div className="w-24 h-6 ml-auto bg-slate-700/40 rounded-lg" />
          </td>
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
