import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const propertyTypes = ["House", "Apartment", "Condo", "Townhouse", "Villa"];
const popularFeatures = ["Garage", "Pool", "Garden", "Fireplace", "Balcony", "Gym"];

export default function PropertyFilters({ filters, onFiltersChange, onReset }) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePropertyTypeToggle = (type) => {
    const currentTypes = localFilters.propertyTypes || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    handleFilterChange("propertyTypes", newTypes);
  };

  const handleFeatureToggle = (feature) => {
    const currentFeatures = localFilters.features || [];
    const newFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter(f => f !== feature)
      : [...currentFeatures, feature];
    handleFilterChange("features", newFeatures);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.priceMin || localFilters.priceMax) count++;
    if (localFilters.propertyTypes?.length) count++;
    if (localFilters.bedroomsMin) count++;
    if (localFilters.bathroomsMin) count++;
    if (localFilters.squareFeetMin) count++;
    if (localFilters.features?.length) count++;
    return count;
  };

  return (
    <div className="bg-surface rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-900 flex items-center">
            <ApperIcon name="Filter" className="h-5 w-5 mr-2" />
            Filters
            {getActiveFiltersCount() > 0 && (
              <Badge variant="primary" className="ml-2">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="lg:hidden"
            >
              <ApperIcon name={isExpanded ? "ChevronUp" : "ChevronDown"} className="h-4 w-4" />
            </Button>
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" onClick={onReset}>
                Reset
              </Button>
            )}
          </div>
        </div>

        <div className={`space-y-6 ${isExpanded ? "block" : "hidden lg:block"}`}>
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Price Range</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={localFilters.priceMin || ""}
                  onChange={(e) => handleFilterChange("priceMin", e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={localFilters.priceMax || ""}
                  onChange={(e) => handleFilterChange("priceMax", e.target.value ? parseInt(e.target.value) : null)}
                />
              </div>
            </div>
          </div>

          {/* Property Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Property Type</label>
            <div className="flex flex-wrap gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => handlePropertyTypeToggle(type)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    localFilters.propertyTypes?.includes(type)
                      ? "bg-primary text-white border-primary shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Min Bedrooms</label>
              <select
                value={localFilters.bedroomsMin || ""}
                onChange={(e) => handleFilterChange("bedroomsMin", e.target.value ? parseInt(e.target.value) : null)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Min Bathrooms</label>
              <select
                value={localFilters.bathroomsMin || ""}
                onChange={(e) => handleFilterChange("bathroomsMin", e.target.value ? parseInt(e.target.value) : null)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="1.5">1.5+</option>
                <option value="2">2+</option>
                <option value="2.5">2.5+</option>
                <option value="3">3+</option>
                <option value="3.5">3.5+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Square Footage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Minimum Square Feet</label>
            <Input
              type="number"
              placeholder="Min Square Feet"
              value={localFilters.squareFeetMin || ""}
              onChange={(e) => handleFilterChange("squareFeetMin", e.target.value ? parseInt(e.target.value) : null)}
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Features</label>
            <div className="flex flex-wrap gap-2">
              {popularFeatures.map((feature) => (
                <button
                  key={feature}
                  onClick={() => handleFeatureToggle(feature)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-all duration-200 ${
                    localFilters.features?.includes(feature)
                      ? "bg-secondary text-white border-secondary shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-secondary"
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}