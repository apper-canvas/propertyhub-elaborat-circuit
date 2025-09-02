import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { formatPrice } from "@/utils/format";
import { toast } from "react-toastify";

export default function MapView() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

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

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
  };

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleSaveToggle = async (propertyId) => {
    try {
      const isCurrentlySaved = savedProperties.some(saved => saved.propertyId === propertyId);
      
      if (isCurrentlySaved) {
        await savedPropertyService.remove(propertyId);
        toast.success("Property removed from saved");
      } else {
        await savedPropertyService.save(propertyId);
        toast.success("Property saved!");
      }
      
      // Refresh saved properties
      const savedData = await savedPropertyService.getAll();
      setSavedProperties(savedData);
    } catch (error) {
      toast.error("Failed to update saved properties");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="h-screen flex flex-col">
      {/* Map Header */}
      <div className="bg-surface border-b border-gray-200 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="font-display text-2xl font-bold text-gray-900">Property Map</h1>
            <Badge variant="primary">
              {properties.length} properties
            </Badge>
          </div>
          <Button 
            variant="outline"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <ApperIcon name="List" className="h-4 w-4 mr-2" />
            List View
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
          {/* Map Placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/10 flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="Map" className="h-16 w-16 mx-auto mb-4 text-primary/40" />
              <p className="text-gray-500 text-lg">Interactive Map View</p>
              <p className="text-gray-400 text-sm">Click on property markers to view details</p>
            </div>
          </div>

          {/* Property Markers */}
          <div className="absolute inset-0">
            {properties.map((property, index) => (
              <button
                key={property.Id}
                onClick={() => handlePropertyClick(property)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                  selectedProperty?.Id === property.Id ? "z-20 scale-110" : "z-10"
                }`}
                style={{
                  left: `${20 + (index % 8) * 10}%`,
                  top: `${15 + (Math.floor(index / 8) % 6) * 12}%`
                }}
              >
                <div className={`bg-gradient-to-r from-accent to-accent/90 text-white px-3 py-2 rounded-lg shadow-lg border-2 ${
                  selectedProperty?.Id === property.Id 
                    ? "border-white ring-2 ring-accent/50" 
                    : "border-accent/20"
                }`}>
                  <div className="font-semibold text-sm whitespace-nowrap">
                    {formatPrice(property.price)}
                  </div>
                </div>
                {/* Marker Pin */}
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent"></div>
              </button>
            ))}
          </div>
        </div>

        {/* Property Detail Popup */}
        {selectedProperty && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-6 left-6 right-6 md:left-6 md:right-auto md:w-96 z-30"
          >
            <Card className="shadow-2xl border-2 border-white">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="absolute top-3 right-3 z-10 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                  >
                    <ApperIcon name="X" className="h-4 w-4" />
                  </button>

                  {/* Property Image */}
                  <div className="aspect-[16/10] overflow-hidden rounded-t-xl">
                    <img
                      src={selectedProperty.images[0]}
                      alt={selectedProperty.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Property Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-display text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {formatPrice(selectedProperty.price)}
                      </div>
                      <Badge variant="accent" className="bg-gradient-to-r from-accent to-accent/90 text-white">
                        {selectedProperty.status}
                      </Badge>
                    </div>

                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                      {selectedProperty.title}
                    </h3>

                    <div className="flex items-center text-gray-600 mb-4">
                      <ApperIcon name="MapPin" className="h-4 w-4 mr-1" />
                      <span className="text-sm">{selectedProperty.address}, {selectedProperty.city}</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <ApperIcon name="Bed" className="h-4 w-4 mr-1" />
                          <span>{selectedProperty.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Bath" className="h-4 w-4 mr-1" />
                          <span>{selectedProperty.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <ApperIcon name="Square" className="h-4 w-4 mr-1" />
                          <span>{selectedProperty.squareFeet?.toLocaleString()} sq ft</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleViewDetails(selectedProperty.Id)}
                        className="flex-1"
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveToggle(selectedProperty.Id)}
                        className="px-3"
                      >
                        <ApperIcon 
                          name="Heart"
                          className={`h-4 w-4 ${
                            savedProperties.some(saved => saved.propertyId === selectedProperty.Id)
                              ? "text-red-500 fill-current" 
                              : "text-gray-600"
                          }`}
                        />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}