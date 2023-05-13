import axios from 'axios';
import { createContext, useEffect, useState } from 'react';

//define the context
export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  // fetch info if !user
  useEffect(() => {
    if (!user) {
      //get data from backend
      axios.get('/profile').then(({ data }) => {
        setUser(data);
      });
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
