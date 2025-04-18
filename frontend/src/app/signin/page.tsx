'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase'; // Importation du fichier firebase.js
import { useUser } from '../../context/UserContext'; // Assure-toi d'importer correctement le hook

const SignIn = () => {
  const router = useRouter();
  const { setUser } = useUser();  // Accède à la fonction pour mettre à jour l'utilisateur

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Connexion avec Firebase
      await signInWithEmailAndPassword(auth, email, password);

      const currentUser = auth.currentUser;
      
      // Si l'utilisateur est connecté, on récupère et on met à jour son prénom dans le contexte
      if (currentUser) {
        const userData = { firstName: currentUser.displayName || 'Utilisateur', email: currentUser.email };
        
        // Sauvegarde l'utilisateur dans localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Met à jour l'utilisateur dans le contexte
        setUser(userData);
      }

      // Redirection vers le tableau de bord après connexion réussie
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message); // Affichage de l'erreur en cas de problème de connexion
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Connexion</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Votre email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-6 text-center">
              <button
                type="submit"
                className="w-full py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                Se connecter
              </button>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Pas encore de compte?{' '}
                <button
                  onClick={() => router.push('/signup')}
                  className="text-indigo-500 hover:underline"
                >
                  Inscrivez-vous
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
