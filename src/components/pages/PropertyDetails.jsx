import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import PhotoGallery from "@/components/molecules/PhotoGallery";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { propertyService } from "@/services/api/propertyService";
import { savedPropertyService } from "@/services/api/savedPropertyService";
import { formatPrice, formatDate } from "@/utils/format";
import { toast } from "react-toastify";

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isHeartAnimating, setIsHeartAnimating] = useState(false);

  useEffect(() => {
    loadProperty();
    checkIfSaved();
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const propertyData = await propertyService.getById(parseInt(id));
      setProperty(propertyData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const savedProperties = await savedPropertyService.getAll();
      setIsSaved(savedProperties.some(saved => saved.propertyId === parseInt(id)));
    } catch (error) {
      console.error("Failed to check saved status:", error);
    }
  };

  const handleSaveToggle = async () => {
    try {
      setIsHeartAnimating(true);
      
      if (isSaved) {
        await savedPropertyService.remove(parseInt(id));
        setIsSaved(false);
        toast.success("Property removed from saved");
      } else {
        await savedPropertyService.save(parseInt(id));
        setIsSaved(true);
        toast.success("Property saved!");
      }
    } catch (error) {
      toast.error("Failed to update saved properties");
    } finally {
      setTimeout(() => setIsHeartAnimating(false), 600);
    }
  };

  const handleContact = () => {
    toast.success("Contact form would open here in a real application");
  };

  const handleScheduleTour = () => {
    toast.success("Tour scheduling would open here in a real application");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadProperty} />;
  if (!property) return <Error message="Property not found" />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6 hover:bg-primary/10"
      >
        <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
        Back to Results
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photo Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PhotoGallery images={property.images} title={property.title} />
          </motion.div>

          {/* Property Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-4">
                      <ApperIcon name="MapPin" className="h-5 w-5 mr-2" />
                      <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                    </div>
                  </div>
                  <Badge variant="accent" className="bg-gradient-to-r from-accent to-accent/90 text-white">
                    {property.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
                    <ApperIcon name="Bed" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-lg text-gray-900">{property.bedrooms}</div>
                    <div className="text-sm text-gray-600">Bedroom{property.bedrooms !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-xl">
                    <ApperIcon name="Bath" className="h-6 w-6 mx-auto mb-2 text-secondary" />
                    <div className="font-semibold text-lg text-gray-900">{property.bathrooms}</div>
                    <div className="text-sm text-gray-600">Bathroom{property.bathrooms !== 1 ? "s" : ""}</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-accent/5 to-accent/10 rounded-xl">
                    <ApperIcon name="Square" className="h-6 w-6 mx-auto mb-2 text-accent" />
                    <div className="font-semibold text-lg text-gray-900">{property.squareFeet?.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Sq Ft</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-xl">
                    <ApperIcon name="Calendar" className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="font-semibold text-lg text-gray-900">{property.yearBuilt}</div>
                    <div className="text-sm text-gray-600">Year Built</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{property.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Features */}
          {property.features && property.features.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Features & Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div key={index} className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                        <ApperIcon name="Check" className="h-4 w-4 text-success mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Listed {formatDate(property.listingDate)}
                  </div>
                </div>

                <div className="space-y-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleContact}
                    className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                  >
                    <ApperIcon name="Phone" className="h-5 w-5 mr-2" />
                    Contact Agent
                  </Button>

                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={handleScheduleTour}
                    className="w-full bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary/80"
                  >
                    <ApperIcon name="Calendar" className="h-5 w-5 mr-2" />
                    Schedule Tour
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSaveToggle}
                    className="w-full group"
                  >
                    <ApperIcon 
                      name="Heart"
                      className={`h-5 w-5 mr-2 transition-all duration-200 ${
                        isSaved 
                          ? "text-red-500 fill-current" 
                          : "text-gray-600 group-hover:text-red-500"
                      } ${isHeartAnimating ? "heart-animation" : ""}`}
                    />
                    {isSaved ? "Remove from Saved" : "Save Property"}
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-6">
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <span>Property Type:</span>
                      <span className="font-medium text-gray-900">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Year Built:</span>
                      <span className="font-medium text-gray-900">{property.yearBuilt}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Square Feet:</span>
                      <span className="font-medium text-gray-900">{property.squareFeet?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Price per Sq Ft:</span>
                      <span className="font-medium text-gray-900">
                        ${Math.round(property.price / property.squareFeet)?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}