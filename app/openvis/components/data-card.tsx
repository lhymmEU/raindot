import React from "react";

interface DataCardProps {
  title: string;
  description: string | string[];
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

const LoadingAnimation = () => (
  <div className="flex items-center justify-center p-8">
    <div className="relative">
      {/* Animated loading dots */}
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>

      {/* Shimmer effect */}
      <div className="mt-6 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
      </div>

      {/* Loading text */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500 animate-fade-in">
          Loading visualization...
        </p>
      </div>
    </div>
  </div>
);

export const DataCard: React.FC<DataCardProps> = ({
  title,
  description,
  children,
  className = "",
  isLoading = false,
}) => {
  return (
    <div
      className={`
      bg-white 
      rounded-xl 
      border 
      border-gray-200 
      transition-shadow 
      duration-300 
      overflow-hidden
      ${className}
    `}
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Content with Suspense */}
      <div className="p-6">
        {isLoading ? <LoadingAnimation /> : children}
      </div>
    </div>
  );
};

export default DataCard;
