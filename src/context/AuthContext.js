//localhost:8000/login
import React, {createContext, useState, useEffect} from 'react';
import axios from 'axios';

export const AuthContext = createContext();


const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    

    useEffect(() => {
        if (authToken) {
          axios.get('http://localhost:8000/user', {
            headers: { Authorization: `Bearer ${authToken}` }
          })
          .then(response => {
            console.log(response.data);
            setUser(response.data);
        })
          .catch((err) => {
            console.log(err);
            logout();
        });
        }
      }, [authToken]);

    const login = async (username, password) => {
        try{
            const response = await axios.post('http://localhost:8000/login',
                {
                    email: username,
                    pw: password
                }
            )
            console.log("User is logged in successfully");
            const token = response.data.token;
            setAuthToken(token);
            localStorage.setItem('token', token);
            setUser(response.data.username);
        }
        catch(error){
            console.log("Login failed", error);
        }
    }

    const logout = () => {
        setAuthToken(null);
        setUser(null);
        localStorage.removeItem('token');
    }

    return(
        <AuthContext.Provider value={{ authToken, user, login, logout }}>
            { children }
        </AuthContext.Provider>
    )
}

export default AuthProvider;