import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatPrice, formatDate } from "@/utils/format";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { toast } from "react-toastify";

export default function PropertyCard({ property, isSaved = false, onSaveToggle }) {
  const navigate = useNavigate();
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  const handleViewDetails = () => {
    navigate(`/property/${property.Id}`);
  };

  const handleSaveToggle = async (e) => {
    e.stopPropagation();
    
    try {
      setIsHeartAnimating(true);
      
      if (isSaved) {
        await savedPropertyService.remove(property.Id);
        toast.success("Property removed from saved");
      } else {
        await savedPropertyService.save(property.Id);
        toast.success("Property saved!");
      }
      
      if (onSaveToggle) {
        onSaveToggle(property.Id);
      }
    } catch (error) {
      toast.error("Failed to update saved properties");
    } finally {
      setTimeout(() => setIsHeartAnimating(false), 600);
    }
  };

  return (
    <Card className="property-card-hover cursor-pointer overflow-hidden group">
      <div className="relative" onClick={handleViewDetails}>
        <div className="aspect-[4/3] overflow-hidden">
<img
            src={property.images?.[0] || '/api/placeholder/400/300'}
            alt={property.title || 'Property'}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        <div className="absolute top-4 left-4">
          <Badge 
            variant="accent" 
            className="bg-gradient-to-r from-accent to-accent/90 text-white font-semibold px-3 py-1 shadow-md"
          >
            {property.status}
          </Badge>
        </div>

        <button
          onClick={handleSaveToggle}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all duration-200 group"
        >
          <ApperIcon 
            name={isSaved ? "Heart" : "Heart"}
            className={`h-5 w-5 transition-all duration-200 ${
              isSaved 
                ? "text-red-500 fill-current" 
                : "text-gray-600 hover:text-red-500"
            } ${isHeartAnimating ? "heart-animation" : ""}`}
          />
        </button>
      </div>

      <div className="p-6" onClick={handleViewDetails}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-2xl font-bold text-gray-900 bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            {formatPrice(property.price)}
          </h3>
          <div className="text-sm text-gray-500">
            Listed {formatDate(property.listingDate)}
          </div>
        </div>

        <h4 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h4>

        <div className="flex items-center text-gray-600 mb-4">
          <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-700">
            <div className="flex items-center">
              <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} bed{property.bedrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} bath{property.bathrooms !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center">
              <ApperIcon name="Square" className="h-4 w-4 mr-1" />
              <span>{property.squareFeet?.toLocaleString()} sq ft</span>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-200"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails();
          }}
        >
          View Details
          <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
}