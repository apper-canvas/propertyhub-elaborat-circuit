const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'property_c';

// All available fields from property_c table
const allFields = [
  {"field": {"Name": "Id"}},
  {"field": {"Name": "title"}},
  {"field": {"Name": "price"}},
  {"field": {"Name": "type"}},
  {"field": {"Name": "bedrooms"}},
  {"field": {"Name": "bathrooms"}},
  {"field": {"Name": "squareFeet"}},
  {"field": {"Name": "address"}},
  {"field": {"Name": "city"}},
  {"field": {"Name": "state"}},
  {"field": {"Name": "zipCode"}},
  {"field": {"Name": "description"}},
  {"field": {"Name": "features"}},
  {"field": {"Name": "images"}},
  {"field": {"Name": "latitude"}},
  {"field": {"Name": "longitude"}},
  {"field": {"Name": "yearBuilt"}},
  {"field": {"Name": "listingDate"}},
  {"field": {"Name": "status"}}
];

export const propertyService = {
  getAll: async () => {
    try {
      const params = {
        fields: allFields,
        orderBy: [{"fieldName": "listingDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching properties:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching properties:", error?.response?.data?.message || error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const params = {
        fields: allFields
      };
      
      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error("Error fetching property:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Property not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching property ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
  },

  create: async (property) => {
    try {
      // Only include updateable fields (exclude Id, listingDate which are system-generated)
      const updateableFields = {
        title: property.title,
        price: property.price,
        type: property.type,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        squareFeet: property.squareFeet,
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zipCode,
        description: property.description,
        features: property.features,
        images: property.images,
        latitude: property.latitude,
        longitude: property.longitude,
        yearBuilt: property.yearBuilt,
        status: property.status
      };
      
      const params = {
        records: [updateableFields]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error creating property:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} properties:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  update: async (id, updates) => {
    try {
      // Only include updateable fields
      const updateableFields = {
        Id: id,
        ...(updates.title && { title: updates.title }),
        ...(updates.price && { price: updates.price }),
        ...(updates.type && { type: updates.type }),
        ...(updates.bedrooms && { bedrooms: updates.bedrooms }),
        ...(updates.bathrooms && { bathrooms: updates.bathrooms }),
        ...(updates.squareFeet && { squareFeet: updates.squareFeet }),
        ...(updates.address && { address: updates.address }),
        ...(updates.city && { city: updates.city }),
        ...(updates.state && { state: updates.state }),
        ...(updates.zipCode && { zipCode: updates.zipCode }),
        ...(updates.description && { description: updates.description }),
        ...(updates.features && { features: updates.features }),
        ...(updates.images && { images: updates.images }),
        ...(updates.latitude && { latitude: updates.latitude }),
        ...(updates.longitude && { longitude: updates.longitude }),
        ...(updates.yearBuilt && { yearBuilt: updates.yearBuilt }),
        ...(updates.status && { status: updates.status })
      };
      
      const params = {
        records: [updateableFields]
      };
      
      const response = await apperClient.updateRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error updating property:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} properties:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const params = { 
        RecordIds: [id]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error deleting property:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} properties:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting property:", error?.response?.data?.message || error);
      throw error;
    }
  }
};