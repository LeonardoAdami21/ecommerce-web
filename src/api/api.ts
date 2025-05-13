import axios from "axios";

// Define a URL base da API, idealmente vinda de variáveis de ambiente
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/v2";

// Cria uma instância do axios com configurações comuns
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autenticação a todas requisições
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de erros nas respostas
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Lidar com erros 401 (não autorizado) globalmente
    if (error.response && error.response.status === 401) {
      // Se receber 401, poderia limpar o token e redirecionar para login
      // Mas essa lógica deve ser cuidadosa para evitar loops de redirecionamento
      console.log("Sessão expirada ou token inválido");
      // Não faça redirecionamento aqui se isto for causar loops infinitos
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
