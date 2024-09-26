
import { jsonInstance,formDataInstance } from "../index" 

export const fetchDocuments = async () => {
    try {
        const response = await jsonInstance.get('/userdocuments');
        return response;
    } catch (error) {
        throw error;
    }
  };

  export const deleteDocuments = async (id) => {
    try {
        const response = await jsonInstance.delete(`/documents/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
  };

  export const addDocuments = async (data) => {
    try {
        const response = await formDataInstance.post(`/documents` , data);
        return response;
    } catch (error) {
        throw error;
    }
  };

  export const updateDocuments = async (id,data) => {
    try {
        const response = await formDataInstance.put(`/documents/${id}` , data);
        return response;
    } catch (error) {
        throw error;
    }
  };

  export const singleDocument = async (id) => {
    try {
        const response = await formDataInstance.get(`/documents/${id}`);
        return response;
    } catch (error) {
        throw error;
    }
  };