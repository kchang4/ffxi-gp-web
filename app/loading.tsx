export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-50 dark:bg-slate-900">
            <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium">Loading Guild Data...</p>
            </div>
        </div>
    );
}
