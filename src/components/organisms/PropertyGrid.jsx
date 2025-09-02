import { motion } from "framer-motion";
import PropertyCard from "@/components/molecules/PropertyCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function PropertyGrid({ properties, savedProperties, onSaveToggle, viewMode = "grid" }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={
        viewMode === "grid"
          ? "grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          : "space-y-4"
      }
    >
      {properties.map((property) => (
        <motion.div
          key={property.Id}
          variants={itemVariants}
          layout
        >
          <PropertyCard
            property={property}
            isSaved={savedProperties.some(saved => saved.propertyId === property.Id)}
            onSaveToggle={onSaveToggle}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}