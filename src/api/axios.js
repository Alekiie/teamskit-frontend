import axios from 'axios';

const api=axios.create({baseURL:import.meta.env.VITE_BASE_URL})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("force-logout"));
    }

    return Promise.reject(error);
  }
);


api.interceptors.request.use((config)=>{
    const token= localStorage.getItem("access")
    if(token) config.headers.Authorization=`Bearer ${token}`
    return config
})

export default api;