import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../Autenticacion/AutProvider";
import DefaultLayout from "../layout/DefaultLayout";
import { API_URL } from "../Autenticacion/constanst";
import { AuthResponse, AuthResponseError } from "../types/types";

export default function Login() {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorResponse, setErrorResponse] = useState("");
  const [loading, setLoading] = useState(false); 

  const auth = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setErrorResponse(""); 
    setLoading(true); 

    try {
      const response = await fetch(`${API_URL}/Login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          gmail,
          password
        })
      });

      if (response.ok) {
        console.log("Inicio de sesión exitoso.");
        const json = await response.json() as AuthResponse;

        if (json.body.accessToken && json.body.refreshToken) {
          auth.saveUser(json);
          navigate("/dashboard");
        }
      } else {
        console.log("Error en el inicio de sesión.");
        const json = await response.json() as AuthResponseError;
        setErrorResponse(json.body.error);
      }
    } catch (error) {
      console.error("Error de red:", error);
      setErrorResponse("Hubo un problema de red. Inténtalo de nuevo más tarde.");
    } finally {
      setLoading(false); // Ocultar indicador de carga independientemente del resultado
    }
  }

  // Si el usuario ya está autenticado, redirigirlo al panel de control
  if (auth.esAutentico) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <DefaultLayout>
      <div className="form-box">
        <div className="wrapper">
          <div className="img-area">
            <img src="https://i.ibb.co/1mwWC9J/5fc5c7eb-c331-4fee-825a-fdf685fcd47c.jpg" alt="imagen" />
          </div>
          <div className="form-area">
            <form className="form" onSubmit={handleSubmit}>
              <h1>Login</h1>
              {errorResponse && <div className="errorMessage">{errorResponse}</div>}
              <label>Email</label>
              <input
                type="email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)} />
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" disabled={loading}>{loading ? "Cargando..." : "Login"}</button>
              {/* Mostrar "Cargando..." en el botón mientras se envía la solicitud */}
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
