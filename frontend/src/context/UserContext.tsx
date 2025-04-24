'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth } from '../../lib/firebase'; // Assure-toi d'importer la bonne instance de Firebase
import { onAuthStateChanged } from 'firebase/auth';

// Crée un contexte pour l'utilisateur
interface User {
  [x: string]: string;
  uid: string;
  firstName: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Écoute les changements de l'état de l'authentification
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Vérifie si un prénom est disponible dans displayName
        setUser({
          uid: firebaseUser.uid,
          firstName: firebaseUser.displayName || 'Utilisateur', // Si displayName n'est pas défini, affiche 'Utilisateur'
        });
      } else {
        setUser(null);
      }
    });

    // Nettoyage de l'abonnement lors du démontage
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook pour utiliser le contexte utilisateur
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser doit être utilisé à l\'intérieur de UserProvider');
  }
  return context;
};
