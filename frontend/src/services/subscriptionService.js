import api from "./api";
export const getPlans = (all = false) => api.get(`/subscriptions/plans${all ? "?all=true" : ""}`);
export const getMySubscription = () => api.get("/subscriptions/my");
export const createPlan = (payload) => api.post("/subscriptions/plans", payload);
export const updatePlan = (id, payload) => api.put(`/subscriptions/plans/${id}`, payload);
