export default function SkeletonTable() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded transition-colors"></div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                        <tr>
                            {['Rank', 'Item', 'Points', 'Max', 'Qty'].map((header) => (
                                <th key={header} className="px-6 py-3">
                                    <div className="h-3 w-12 bg-slate-200 dark:bg-slate-700 rounded"></div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {[1, 2, 3, 4, 5, 6, 7].map((row) => (
                            <tr key={row}>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-12 ml-auto bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-12 ml-auto bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="h-4 w-8 ml-auto bg-slate-100 dark:bg-slate-800 rounded"></div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
