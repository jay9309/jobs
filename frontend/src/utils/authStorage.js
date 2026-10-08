export const getToken = () => localStorage.getItem("jobnest_token");
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem("jobnest_user") || "null"); } catch { return null; }
};
