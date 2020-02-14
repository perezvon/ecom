export const serverURL = "http://localhost:3001";

export const sessionAuth = () => ({
  Authorization: localStorage.getItem("sessionAuth")
});