'use client';

import { useUser } from '../../context/UserContext';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/firebase';
import { getAuth } from 'firebase/auth';
import Link from 'next/link';
import { useEffect } from 'react';

const Profile = () => {
  const { user } = useUser(); // Accès au contexte utilisateur
  const router = useRouter();
  const currentUser = getAuth().currentUser;

  // Si l'utilisateur n'est pas connecté, redirection vers la page de connexion
  if (!user || !currentUser) {
    // Pour que la redirection fonctionne après le rendu, utilisez useEffect
    useEffect(() => {
      router.push('/signin');
    }, []);
    return null;  // Ne pas afficher le profil si l'utilisateur n'est pas connecté
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Mon Profil</h2>
        
        {/* Affichage des informations de l'utilisateur */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700">Prénom :</p>
          <p className="text-gray-600">{user.firstName}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700">Nom :</p>
          <p className="text-gray-600">{user.lastName}</p>
        </div>
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700">Email :</p>
          <p className="text-gray-600">{currentUser.email}</p>
        </div>
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-700">Numéro de téléphone :</p>
          <p className="text-gray-600">{user.phoneNumber || 'Non renseigné'}</p>
        </div>

        {/* Lien vers la page de paramètres */}
        <div className="text-center">
          <button
            onClick={() => router.push('/settings')}
            className="w-full py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
          >
            Modifier mes informations
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
