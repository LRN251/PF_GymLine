import { jwtDecode } from "jwt-decode"
const getState = ({ getStore, getActions, setStore }) => {
    return {
        store: {
            message: null,
            token: null,
            user: null,
            logged: null,
            users: null,
        },
        actions: {
            getAllUsers: async () => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/users", {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setStore({
                            users: userData.results,
                            message: userData.message
                        });
                    } else {
                        console.error("Error al obtener usuarios:", response.statusText);
                        setStore({ users: [], message: null });
                    }
                } catch (error) {
                    console.error("Error al obtener usuarios:", error);
                    setStore({ users: [], message: null });
                }
            },
            signup: async (dataEmail, dataPassword, dataName, dataLastname, dataNickname) => {
                try {
                    //console.log(dataName, dataLastname, dataNickname, dataEmail, dataPassword)
                    const response = await fetch(process.env.BACKEND_URL + "/api/signup", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "email": dataEmail,
                            "password": dataPassword,
                            "nickname": dataNickname,
                            "name": dataName,
                            "lastname": dataLastname,
                            "rol": "member"
                        })
                    });
                    //console.log(response);
                    if (response.ok) {
                        const data = await response.json();
                        //console.log(data);
                        return true;
                    } else {
                        const errorData = await response.json();
                        if (errorData.message) {
                            console.error(`Signup error: ${errorData.message}`);
                        } else {
                            console.error("An error occurred during user creation");
                        }
                        return false;
                    }
                } catch (error) {
                    console.error("An error occurred during user creation", error);
                    return false;
                }
            },
            login: async (dataEmail, dataPassword) => {
                try {
                    const response = await fetch(process.env.BACKEND_URL + "/api/login", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "email": dataEmail,
                            "password": dataPassword,
                        })
                    });
                    console.log("Este es el respone: "+response);
                    if (response.ok) {
                        const data = await response.json();
                        
                        sessionStorage.setItem("token", data.token);
                        sessionStorage.setItem("userID", data.user.id);
                        // Decodificar el token JWT para obtener el rol del usuario
                        const token = data.token;
                        //console.log("Token ", token)
                        const decodedToken = jwtDecode(token);
                        //console.log("Token Decodificado ", decodedToken);
                        const userRole = decodedToken.sub.rol;
                        setStore({
                            user: data.user,
                            token: data.token,
                            logged: true
                        });
                        console.log("Data", data.user)
                        // Redirigir basado en el rol del usuario
                        const redirectMap = {
                            'admin': '/adminview',
                            'member': '/member',
                            'coach': '/coach',
                        };
                        const defaultRoute = '/guest'; // Ruta predeterminada si el rol no coincide
                        //window.location = redirectMap[userRole] || defaultRoute;
                        return true;
                    } else {
                        console.error("An error occurred during user login");
                        return false;
                    }
                } catch (error) {
                    console.error("An error occurred during user login", error);
                    return false;
                }
            },
            verifyAuthToken: async () => {
                const token = sessionStorage.getItem("token");
                //console.log(token);
                if (!token) {
                    setStore({ logged: false });
                    //window.location = '/login';
                    return false;
                }
                try {
                    let response = await fetch(process.env.BACKEND_URL + "/api/protected", {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Methods": "*"
                        }
                    });
                    if (response.ok) {
                        const userData = await response.json();
                        setStore({
                            user: userData.response.user,
                            token: token,
                            logged: true
                        });
                    } else {
                        sessionStorage.removeItem("token");
                        setStore({ logged: false });
                        //window.location = '/login';
                    }
                } catch (error) {
                    console.error("Token validation failed", error);
                    sessionStorage.removeItem("token");
                    setStore({ logged: false });
                   // window.location = '/login';
                }
            },
            logout: () => {
                setStore({
                    user: null,
                    token: null,
                    logged: false,
                });
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("userID");
            }
        }
    };
};
export default getState;