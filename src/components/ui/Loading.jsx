export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-48 animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse"></div>
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Property cards skeleton */}
      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-surface rounded-xl shadow-md overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="aspect-[4/3] bg-gradient-to-r from-gray-200 to-gray-300"></div>
            
            {/* Content skeleton */}
            <div className="p-6 space-y-4">
              {/* Price and date */}
              <div className="flex items-center justify-between">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
              </div>
              
              {/* Title */}
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
              
              {/* Address */}
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              
              {/* Property details */}
              <div className="flex items-center space-x-4">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
              
              {/* Button */}
              <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}