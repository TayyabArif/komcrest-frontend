import axios from 'axios';
import Cookies from 'js-cookie';

const cookieValue = Cookies.get('myCookie');

// Decode the cookie value and parse it as JSON
let token;
if (cookieValue) {
  try {
    const decodedValue = decodeURIComponent(cookieValue);
    const parsedValue = JSON.parse(decodedValue); 
    token = parsedValue.token; 
  } catch (error) {
    console.error('Failed to parse cookie or extract token', error);
  }
}
const jsonInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
});

const formDataInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
    Authorization: `Bearer ${token}`,
  },
});

export { jsonInstance, formDataInstance };
