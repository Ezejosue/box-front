import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  user_id: string;
  email: string;
}

export const isTokenValid = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;

    const decoded = jwtDecode(token) as DecodedToken;
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};

export const getDecodedToken = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    return jwtDecode(token) as DecodedToken;
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
