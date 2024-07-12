// AuthContext.tsx
import React, { createContext, useState, ReactNode, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  MemberId: Number;
  setMemberId: (MemberId: Number) => void;
  posterID: Number;
  setPosterID: (PosterID: Number) => void;
  logout: () => void;
  email: string;
  setEmail: (email: string) => void;
}

//createContext Function: This creates a new context object with a default value of undefined. 
//The context will hold values of type AuthContextType.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

//AuthProvider Component: This component provides the context to its child components.
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [MemberId, setMemberId] = useState<Number>(0);
  const [email, setEmail] = useState<string>("")
  const [posterID, setPosterID] = useState<Number>(0)

  const logout = () => {
    const isComfirmed = window.confirm("Are you sure you want to log out?")

    if(isComfirmed){
      setIsAuthenticated(false);
      setMemberId(0);
      setEmail("")
      setPosterID(0)
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, setMemberId, MemberId, logout, email, setEmail, posterID, setPosterID }}>
      {children}
    </AuthContext.Provider>
  );
};

/*
AuthContext.Provider: This component makes the isAuthenticated state and 
the setIsAuthenticated function available to any nested components that need them. 
The value prop of the provider is an object containing isAuthenticated 
and setIsAuthenticated.
*/

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/*
useAuth Hook: This is a custom hook to consume the AuthContext more easily.
useContext Hook: It uses the useContext hook to access the AuthContext.
Error Handling: If the context is undefined, it means that useAuth is being used outside
of an AuthProvider, which is not allowed. In this case, it throws an error.
Return Value: If the context is correctly used, it returns the context value, 
which includes isAuthenticated and setIsAuthenticated.
*/
