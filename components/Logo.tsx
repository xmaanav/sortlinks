import { FiLink } from "react-icons/fi";

export default function Logo({ className = "w-7 h-7", textClassName = "text-xl font-bold tracking-tight" }: { className?: string; textClassName?: string }) {
    return (
        <div className="flex items-center gap-2 select-none">
            <div className={`flex items-center justify-center rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 ${className}`}>
                <FiLink className="w-4 h-4" />
            </div>
            <span className={`${textClassName} text-gray-900 dark:text-white font-bold`}>
                SortLinks
            </span>
        </div>
    );
}
