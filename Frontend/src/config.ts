// config.ts
const BACKEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://caption-generator-q86a.onrender.com'
  : 'http://localhost:8080';

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? 'https://caption-generator-maad.vercel.app'
  : 'http://localhost:5173';

export const API_URL = `${BACKEND_URL}/api`;
