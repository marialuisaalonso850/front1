import { useEffect, useState } from "react";
import axios from "axios";
import config from "../config.json";
import Mapa from '../js/Mapa';
import PortalLayout from '../layout/PortalLayout';
import '../assets/dashboard.css';
import {Link} from 'react-router-dom';
import { useAuth } from "../Autenticacion/AutProvider";


const Dashboard = () => {
  const [parqueaderos, setParqueaderos] = useState([]);
  const auth= useAuth()
  useEffect(() => {
    fetchParqueaderos();
  }, []);

  const fetchParqueaderos = async () => {
    try {
      
      const res = await axios.get(config.apiUrl, {
        headers:{
          Authorization: `Bearer ${auth.getAccessToken()}`
        }
      });
      console.log('token',auth.getAccessToken);
      setParqueaderos(res.data);
    } catch (error) {
      console.error("Error fetching parqueaderos:", error);
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
                  <Link to= '/Posts 'className="btn btn-primary">

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
       
      </div>
    </PortalLayout>
  );
}

export default Dashboard;
