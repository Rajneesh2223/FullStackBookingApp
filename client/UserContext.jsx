import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        // Check if token is present in localStorage
        const token = localStorage.getItem('token');
        console.log('use context token:', token);

        if (token) {
            // If token is present, make API request to fetch user data
            axios.get('/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(({data}) => {
                setUser(data);
                setReady(true);
            }).catch(error => {
                console.log('Profile fetch error:', error);
                setReady(true);
            });
        } else {
            console.log('Token is not present');
            setReady(true);  // Mark ready as true even if no token is found
        }
    }, []);
    
    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}
