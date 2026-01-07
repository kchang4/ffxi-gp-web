
interface NumberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function NumberInput({ label, className, ...props }: NumberInputProps) {
    return (
        <div>
            <label className="block text-[10px] text-slate-500 dark:text-slate-400 mb-1 font-medium text-center">
                {label}
            </label>
            <input
                type="number"
                className={`w-full bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 rounded text-center font-bold text-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 p-2 lg:p-1 text-base lg:text-sm ${className || ''}`}
                {...props}
            />
        </div>
    );
}
