import React, { createContext, useContext, useState, useEffect } from "react";
import type { AccessTokenResponse, AuthResponse, User, parqueadero } from "../types/types";
import { API_URL } from "./constanst";

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthContext = createContext<ExtendedAuthContext>({
  esAutentico: false,
  getAccessToken: () => "",
  saveUser: (_userData: AuthResponse) => {},
  getRefreshToken: () => null,
  getUser: () => ({} as User | undefined),
  signOut: () => {},
  getParqueadero: () => ({} as parqueadero | undefined),
  saveParqueadero: (_parqueaderoData: AuthResponse) => void {}, // Corregido el nombre de la función
});


interface ExtendedAuthContext {
  esAutentico: boolean;
  getAccessToken: () => string;
  saveUser: (userData: AuthResponse) => void;
  getRefreshToken: () => string | null;
  getUser: () => User | undefined;
  signOut: () => void;
  getParqueadero: () => parqueadero | undefined;
  saveParqueadero: (parqueaderoData: AuthResponse) => void;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [esAutentico, setEsAutentico] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [parqueadero, setParqueadero] = useState<parqueadero | undefined>();

  useEffect(() => {
    checkAuth();
  }, []);

  async function requestNewAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${refreshToken}`,
        },
      });
      if (response.ok) {
        const json = await response.json() as AccessTokenResponse;

        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken; // Corrected property name here
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const json = await response.json();

        if (json.error) {
          throw new Error(json.error);
        }
        return json.body;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  // async function getParqueaderoInfo(accessToken: string) {
  //   try {
  //     const response = await fetch(`${API_URL}/parqueadero-info`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     if (response.ok) {
  //       const json = await response.json();

  //       if (json.error) {
  //         throw new Error(json.error);
  //       }
  //       return json.body;
  //     } else {
  //       throw new Error(response.statusText);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     return null;
  //   }
  // }

  async function checkAuth() {
    if (accessToken) {
      const userInfo = await getUserInfo(accessToken);
      // const parqueaderoInfo = await getParqueaderoInfo(accessToken);
      if (userInfo ) {
        saveSessionInfo(userInfo.user, accessToken, getRefreshToken()!, userInfo.rol || []);
        
        setIsLoading(false);
        return;
      }
    } else {
      const token = getRefreshToken();
      if (token) {
        const newAccessToken = await requestNewAccessToken(token);
        if (newAccessToken) {
          const userInfo = await getUserInfo(newAccessToken);
          // const parqueaderoInfo = await getParqueaderoInfo(newAccessToken);
          if (userInfo ) {
            saveSessionInfo(userInfo.user, newAccessToken, token, userInfo.rol || []);
            // saveParqueadero(parqueaderoInfo);
            setIsLoading(false);
            return;
          }
        }
      }
    }
    setIsLoading(false);
  }

  function signOut() {
    setEsAutentico(false);
    setAccessToken("");
    setUser(undefined);
    setParqueadero(undefined); // Añadido para limpiar la información del parqueadero al cerrar sesión
    localStorage.removeItem("token");
  }

  function saveSessionInfo(userInfo: User, accessToken: string, refreshToken: string, rol: number) {
    setAccessToken(accessToken);
    localStorage.setItem('token', JSON.stringify(refreshToken));
    setEsAutentico(true);
    setUser({ ...userInfo, rol: rol || 1  });
  }

  // function saveParqueadero(parqueaderoData: AuthResponse): void {
  //   setParqueadero(parqueaderoData.body.parqueadero);
  // }

  function getAccessToken() {
    return accessToken;
  }

  function getRefreshToken(): string | null {
    const tokenData = localStorage.getItem("token");
    if (tokenData) {
      const token = JSON.parse(tokenData);
      return token;
    }
    return null;
  }

  function saveUser(userData: AuthResponse) {
    saveSessionInfo(
      userData.body.user,
      userData.body.accessToken,
      userData.body.refreshToken,
      userData.body.user.rol || 1
    );
  }

  function saveParqueadero(parqueaderoData: AuthResponse): void {
    setParqueadero(parqueaderoData.body.parqueadero);
  }

 

  function getUser() {
    return user;
  }

  return (
    <AuthContext.Provider value={{ esAutentico, getAccessToken, saveUser, getRefreshToken, getUser, signOut }}>
      {isLoading ? <div>Cargando...</div> : children}
    </AuthContext.Provider>
  );

}

export const useAuth = () => useContext(AuthContext) as ExtendedAuthContext;


