import propertiesData from "@/services/mockData/properties.json";

const DELAY = 300;

export const propertyService = {
  getAll: async () => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    return [...propertiesData];
  },

  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const property = propertiesData.find(p => p.Id === id);
    if (!property) {
      throw new Error("Property not found");
    }
    return { ...property };
  },

  create: async (property) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const maxId = Math.max(...propertiesData.map(p => p.Id), 0);
    const newProperty = {
      ...property,
      Id: maxId + 1,
      listingDate: new Date().toISOString().split("T")[0]
    };
    propertiesData.push(newProperty);
    return { ...newProperty };
  },

  update: async (id, updates) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const index = propertiesData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    propertiesData[index] = { ...propertiesData[index], ...updates };
    return { ...propertiesData[index] };
  },

  delete: async (id) => {
    await new Promise(resolve => setTimeout(resolve, DELAY));
    const index = propertiesData.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Property not found");
    }
    const deleted = propertiesData.splice(index, 1)[0];
    return { ...deleted };
  }
};