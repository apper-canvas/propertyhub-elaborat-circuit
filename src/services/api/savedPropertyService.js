import savedPropertiesData from "@/services/mockData/savedProperties.json";

const DELAY = 200;

export const savedPropertyService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    return [...savedPropertiesData];
  },

  save: async (propertyId) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    
    // Check if already saved
    const existing = savedPropertiesData.find(s => s.propertyId === propertyId);
    if (existing) {
      return { ...existing };
    }
    
    const newSaved = {
      Id: savedPropertiesData.length > 0 ? Math.max(...savedPropertiesData.map(s => s.Id)) + 1 : 1,
      propertyId: propertyId,
      savedDate: new Date().toISOString()
    };
    
    savedPropertiesData.push(newSaved);
    return { ...newSaved };
  },

  remove: async (propertyId) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const index = savedPropertiesData.findIndex(s => s.propertyId === propertyId);
    if (index === -1) {
      throw new Error("Saved property not found");
    }
    const removed = savedPropertiesData.splice(index, 1)[0];
    return { ...removed };
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const saved = savedPropertiesData.find(s => s.Id === id);
    if (!saved) {
      throw new Error("Saved property not found");
    }
    return { ...saved };
  }
};