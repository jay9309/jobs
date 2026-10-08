import api from "./api";

export const applyToJob = (jobId) => api.post(`/applications/${jobId}/apply`);
export const getMyApplications = () => api.get("/applications/my");
