import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Error({ message = "Something went wrong", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-error/10 to-error/20 rounded-full flex items-center justify-center">
          <ApperIcon name="AlertTriangle" className="h-8 w-8 text-error" />
        </div>
        
        <h3 className="font-display text-2xl font-semibold text-gray-900 mb-3">
          Oops! Something went wrong
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}. Please try again or contact support if the problem persists.
        </p>
        
        {onRetry && (
          <Button 
            onClick={onRetry} 
            variant="primary"
            className="inline-flex items-center"
          >
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}