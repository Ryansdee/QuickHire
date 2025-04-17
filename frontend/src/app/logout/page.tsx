'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase'; // Assure-toi que le chemin est correct
import { useUser } from '../../context/UserContext'; // Assure-toi que tu importes correctement le hook

const Logout = () => {
  const router = useRouter();
  const { setUser } = useUser(); // On va utiliser cette fonction pour réinitialiser l'utilisateur dans le contexte

  useEffect(() => {
    const logoutUser = async () => {
      try {
        // On déconnecte l'utilisateur de Firebase
        await signOut(auth);

        // On réinitialise l'utilisateur dans le contexte
        setUser(null);

        // On redirige vers la page de connexion après la déconnexion
        router.push('/signin');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    };

    logoutUser();
  }, [router, setUser]); // On utilise useEffect pour déconnecter dès que la page est rendue

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Déconnexion en cours...</h2>
        <p className="text-center text-gray-600">Vous allez être redirigé vers la page de connexion.</p>
      </div>
    </div>
  );
};

export default Logout;
