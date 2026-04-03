export const getToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

export const getUser = () => {
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const isLoggedIn = () => !!getToken();

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "/login";
};
