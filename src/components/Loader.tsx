import React from "react";

const Loader = ({
                    fullPage = true,
                    size = 48,
                    color = "#3B82F6",
                    text = ""
                }) => {
    return (
        <div
            className={`flex flex-col justify-center items-center gap-3 ${
                fullPage ? "h-screen w-screen" : "h-full w-full"
            }`}
            role="status"
            aria-label="Loading"
        >
            <svg
                className="animate-spin"
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke={color}
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill={color}
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
            </svg>
            {text && (
                <span className="text-sm text-gray-600 dark:text-gray-300">
          {text}
        </span>
            )}
        </div>
    );
};

export default Loader;
