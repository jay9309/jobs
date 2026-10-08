import api from "./api";

export const createOrder = (planId) => api.post("/payments/create-order", { planId });
export const verifyPayment = (payload) => api.post("/payments/verify", payload);
