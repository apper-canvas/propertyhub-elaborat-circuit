import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PropertyGrid from "@/components/organisms/PropertyGrid";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { useNavigate } from "react-router-dom";

export default function SavedProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [savedData, allProperties] = await Promise.all([
        savedPropertyService.getAll(),
        propertyService.getAll()
      ]);
      
      // Filter properties to only show saved ones
      const savedPropertyIds = savedData.map(saved => saved.propertyId);
      const filteredProperties = allProperties.filter(property => 
        savedPropertyIds.includes(property.Id)
      );
      
      setProperties(filteredProperties);
      setSavedProperties(savedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToggle = async (propertyId) => {
    try {
      // Remove from saved and update the list
      await savedPropertyService.remove(propertyId);
      
      // Reload the saved properties list
      const updatedSaved = await savedPropertyService.getAll();
      setSavedProperties(updatedSaved);
      
      // Update the displayed properties
      const savedPropertyIds = updatedSaved.map(saved => saved.propertyId);
      const allProperties = await propertyService.getAll();
      const filteredProperties = allProperties.filter(property => 
        savedPropertyIds.includes(property.Id)
      );
      setProperties(filteredProperties);
    } catch (error) {
      console.error("Failed to update saved properties:", error);
    }
  };

  const handleBrowseProperties = () => {
    navigate("/");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Saved Properties
          </h1>
          <Badge variant="primary" className="text-lg px-4 py-2">
            {properties.length} saved
          </Badge>
        </div>
        
        <Button 
          variant="outline"
          onClick={handleBrowseProperties}
          className="flex items-center"
        >
          <ApperIcon name="Search" className="h-4 w-4 mr-2" />
          Browse More
        </Button>
      </div>

      {/* Content */}
      {properties.length === 0 ? (
        <Empty 
          title="No saved properties yet"
          message="Start saving properties you're interested in to keep track of your favorites. You can save properties from the search results or individual property pages."
          actionLabel="Browse Properties"
          onAction={handleBrowseProperties}
          icon="Heart"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <PropertyGrid
            properties={properties}
            savedProperties={savedProperties}
            onSaveToggle={handleSaveToggle}
            viewMode="grid"
          />
        </motion.div>
      )}
    </div>
  );
}