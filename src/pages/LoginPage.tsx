import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { userLogin } from "../services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await userLogin(email, password);
      navigate("/");
      return res;
    } catch (err) {
      console.log(err);
      throw new Error("Email ou senha inválidos");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600">{error}</p>}
        <Button>Entrar</Button>
        <Link
          className="text-blue-600 underline hover:text-blue-700 block text-center"
          to="/auth/register"
        >
          Registrar
        </Link>
      </form>
    </div>
  );
};

export default Login;
