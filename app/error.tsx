'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an analytics reporting service if needed
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <p className="text-slate-500 max-w-md text-center">
                We couldn&apos;t load the application data. This might be a temporary glitch.
            </p>
            <button
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
            >
                Try again
            </button>
        </div>
    );
}
