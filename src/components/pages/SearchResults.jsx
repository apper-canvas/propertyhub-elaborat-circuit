import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyFilters from "@/components/molecules/PropertyFilters";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";

const sortOptions = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "size-large", label: "Size: Largest First" },
  { value: "size-small", label: "Size: Smallest First" }
];

export default function SearchResults() {
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    priceMin: null,
    priceMax: null,
    propertyTypes: [],
    bedroomsMin: null,
    bathroomsMin: null,
    squareFeetMin: null,
    features: []
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFiltersAndSort();
  }, [properties, filters, sortBy]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [propertiesData, savedData] = await Promise.all([
        propertyService.getAll(),
        savedPropertyService.getAll()
      ]);
      setProperties(propertiesData);
      setSavedProperties(savedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...properties];

    // Apply filters
    if (filters.priceMin) {
      filtered = filtered.filter(p => p.price >= filters.priceMin);
    }
    if (filters.priceMax) {
      filtered = filtered.filter(p => p.price <= filters.priceMax);
    }
    if (filters.propertyTypes?.length) {
      filtered = filtered.filter(p => filters.propertyTypes.includes(p.type));
    }
    if (filters.bedroomsMin) {
      filtered = filtered.filter(p => p.bedrooms >= filters.bedroomsMin);
    }
    if (filters.bathroomsMin) {
      filtered = filtered.filter(p => p.bathrooms >= filters.bathroomsMin);
    }
    if (filters.squareFeetMin) {
      filtered = filtered.filter(p => p.squareFeet >= filters.squareFeetMin);
    }
    if (filters.features?.length) {
      filtered = filtered.filter(p => 
        filters.features.every(feature => p.features.includes(feature))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.listingDate) - new Date(a.listingDate));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.listingDate) - new Date(b.listingDate));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "size-large":
        filtered.sort((a, b) => b.squareFeet - a.squareFeet);
        break;
      case "size-small":
        filtered.sort((a, b) => a.squareFeet - b.squareFeet);
        break;
    }

    setFilteredProperties(filtered);
  };

  const handleSaveToggle = async (propertyId) => {
    try {
      const savedData = await savedPropertyService.getAll();
      setSavedProperties(savedData);
    } catch (error) {
      console.error("Failed to refresh saved properties:", error);
    }
  };

  const resetFilters = () => {
    setFilters({
      priceMin: null,
      priceMax: null,
      propertyTypes: [],
      bedroomsMin: null,
      bathroomsMin: null,
      squareFeetMin: null,
      features: []
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-80 flex-shrink-0">
          <PropertyFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h1 className="font-display text-2xl font-bold text-gray-900">
                Properties for Sale
              </h1>
              <Badge variant="primary" className="text-sm">
                {filteredProperties.length} result{filteredProperties.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "grid" 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ApperIcon name="Grid3X3" className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === "list" 
                      ? "bg-primary text-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <ApperIcon name="List" className="h-4 w-4" />
                </button>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Property Grid */}
          {filteredProperties.length === 0 ? (
            <Empty 
              title="No properties match your criteria"
              message="Try adjusting your search filters to find more properties."
              actionLabel="Clear All Filters"
              onAction={resetFilters}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <PropertyGrid
                properties={filteredProperties}
                savedProperties={savedProperties}
                onSaveToggle={handleSaveToggle}
                viewMode={viewMode}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}