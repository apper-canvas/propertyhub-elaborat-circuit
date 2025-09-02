const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'saved_property_c';

// All available fields from saved_property_c table
const allFields = [
  {"field": {"Name": "Id"}},
  {"field": {"Name": "propertyId"}},
  {"field": {"Name": "savedDate"}}
];

export const savedPropertyService = {
  getAll: async () => {
    try {
      const params = {
        fields: allFields,
        orderBy: [{"fieldName": "savedDate", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error("Error fetching saved properties:", response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching saved properties:", error?.response?.data?.message || error);
      throw error;
    }
  },

  save: async (propertyId) => {
    try {
      // First check if already saved
      const existing = await this.getAll();
      const alreadySaved = existing.find(s => s.propertyId === propertyId);
      if (alreadySaved) {
        return alreadySaved;
      }
      
      const savedData = {
        propertyId: propertyId,
        savedDate: new Date().toISOString()
      };
      
      const params = {
        records: [savedData]
      };
      
      const response = await apperClient.createRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error saving property:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to save ${failed.length} properties:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error saving property:", error?.response?.data?.message || error);
      throw error;
    }
  },

  remove: async (propertyId) => {
    try {
      // First find the saved property record by propertyId
      const saved = await this.getAll();
      const savedProperty = saved.find(s => s.propertyId === propertyId);
      
      if (!savedProperty) {
        throw new Error("Saved property not found");
      }
      
      const params = { 
        RecordIds: [savedProperty.Id]
      };
      
      const response = await apperClient.deleteRecord(tableName, params);
      
      if (!response.success) {
        console.error("Error removing saved property:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to remove ${failed.length} saved properties:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return savedProperty;
      }
      
      return savedProperty;
    } catch (error) {
      console.error("Error removing saved property:", error?.response?.data?.message || error);
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
        console.error("Error fetching saved property:", response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Saved property not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching saved property ${id}:`, error?.response?.data?.message || error);
      throw error;
    }
}
};