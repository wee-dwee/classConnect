import {createContext, useEffect, useState} from "react";
import axios from "axios";
export const UserContext = createContext({});
export function UserContextProvider({children}) {
  const [user,setUser] = useState(null);
  const [ready,setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      // Fetch user profile with token included in request headers
      axios.get('http://localhost:3002/profile', { withCredentials: true })
        .then(({ data }) => {
          console.log(data);
          setUser(data);
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });
    }
  }, [user]); // Add user as a dependency if you want the effect to run whenever user changes
  
  return (
    <UserContext.Provider value={{user,setUser}}>
      {children}
    </UserContext.Provider>
  );
}