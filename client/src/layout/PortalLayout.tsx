import React from "react";
import { useAuth } from "../Autenticacion/AutProvider";
import { Link } from "react-router-dom";
import { API_URL } from "../Autenticacion/constanst";
export default function PortalLayout({children}: {children:React.ReactNode}){
 const auth = useAuth();

    async function handleSignOut(e:React.MouseEvent<HTMLAnchorElement>){
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/signout`,{
                method: "DELETE",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.getRefreshToken()}`
                }
            })

            if(response.ok){
                auth.signOut();
            }
        } catch (error) {
            
        }
    }

    return (
        <>
        <header className="principal">
            <div className="container-pri">
              <Link to="/" className="inicio">
                Parking<span className="span">Location.</span>{" "}
              </Link>
            </div>
            <nav>
            <ul>
              <li>
                <Link to="/Perfil">Perfil</Link>
              </li>
              <li>
                <Link to="/Dashboard">Mapa navegacion</Link>
              </li>
              <li>
                <Link to="/Posts">Crear Parqueadero</Link>
              </li>
              
              <li>
                <a href="/">
                  Salir
                </a>
              </li>
            </ul>
          </nav>
          </header>
  
        <main>{children}</main>
      </>
    )
}