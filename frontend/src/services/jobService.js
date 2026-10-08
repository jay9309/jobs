import api from "./api";
export const getJobs = (params = {}) => api.get("/jobs", { params });
export const getAdminJobs = (params = {}) => api.get("/jobs/admin/all", { params });
export const getJob = (id) => api.get(`/jobs/${id}`);
export const previewJobUrl = (url) => api.post("/jobs/admin/preview-url", { url });
export const createJob = (payload) => api.post("/jobs/admin", payload);
export const updateJob = (id, payload) => api.put(`/jobs/admin/${id}`, payload);
export const deleteJob = (id) => api.delete(`/jobs/admin/${id}`);
