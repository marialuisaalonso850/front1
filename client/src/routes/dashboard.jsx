import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";
import Mapa from '../js/Mapa';
import PortalLayout from '../layout/PortalLayout';
import '../assets/dashboard.css';
import { Link } from 'react-router-dom';
import { useAuth } from "../Autenticacion/AutProvider";

const Dashboard = () => {
  const [parqueaderos, setParqueaderos] = useState([]);
  const [userRole, setUserRole] = useState(""); // Estado para almacenar el tipo de rol del usuario
  const auth = useAuth();

  useEffect(() => {
    fetchParqueaderos();
    getUserRole();
  }, []);

  const fetchParqueaderos = async () => {
    try {
      const res = await axios.get(config.apiUrl, {
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`
        }
      });
      setParqueaderos(res.data);
    } catch (error) {
      console.error("Error fetching parqueaderos:", error);
    }
  };

  const getUserRole = () => {
    const user = auth.getUser();
    if (user) {
      const rolesMap = {
        1: "Usuario",
        2: "Cliente",
        
      };
      setUserRole(rolesMap[user.rol] || "Desconocido"); // Asigna el tipo de rol del usuario al estado
    }
  };

  return (
    <PortalLayout>
      <div className="posts">
        <h1>Busqueda de parqueaderos</h1>
        <Mapa posts={parqueaderos} />
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Titulo</th>
                <th>Contenido</th>
                <th>Latitud</th>
                <th>Longitud</th>
                <th>Puestos</th>
              </tr>
            </thead>
            <tbody>
              {parqueaderos.map((parqueadero) => (
                <tr key={parqueadero._id}>
                  <td>{parqueadero.title}</td>
                  <td>{parqueadero.content}</td>
                  <td>{parqueadero.latitud}</td>
                  <td>{parqueadero.longitud}</td>
                  <td>{parqueadero.puestos}</td>
                  <td>
                    <Link to={`/post/${parqueadero._id}/info`} className="btn btn-primary">
                      Info
                    </Link>
                  </td>
                  <td>
                    <Link to='/Posts' className="btn btn-primary">
                      puesto
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        {/* Muestra el tipo de rol del usuario */}
        {userRole && <div>Tipo de rol: {userRole}</div>}
      </div>
    </PortalLayout>
  );
}

export default Dashboard;

