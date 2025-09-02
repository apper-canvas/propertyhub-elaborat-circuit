import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

export default function Empty({ 
  title = "No properties found", 
  message = "Try adjusting your search criteria or filters to find more properties.",
  actionLabel = "Clear Filters",
  onAction,
  icon = "Home"
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-full flex items-center justify-center">
          <ApperIcon name={icon} className="h-10 w-10 text-primary" />
        </div>
        
        <h3 className="font-display text-2xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message}
        </p>
        
        {onAction && (
          <Button 
            onClick={onAction} 
            variant="primary"
            className="inline-flex items-center"
          >
            <ApperIcon name="RotateCcw" className="h-4 w-4 mr-2" />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}