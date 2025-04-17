'use client';

import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../../../lib/firebase'; // Import de ta configuration Firebase
import { useUser } from '@/context/UserContext';

const SignUp = () => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [error, setError] = useState('');

  // Fonction pour gérer l'inscription
  const handleSignup = async (firstName: string, email: string, password: string) => {
    const auth = getAuth();
    const router = useRouter();
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Mise à jour du profil avec le prénom
      await updateProfile(user, {
        displayName: firstName,  // Met à jour le prénom
      });
  
      // Après la mise à jour, tu peux ajouter l'utilisateur dans le contexte
      const { setUser } = useUser(); // Assure-toi d'importer correctement useUser
      setUser({ firstName: user.displayName || 'Utilisateur' });
  
      // Rediriger vers le dashboard après inscription
      router.push('/dashboard');
    } catch (error) {
      console.error("Erreur d'inscription:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Inscription</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSignup}>
          {/* Prénom */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-800">
              Prénom
            </label>
            <input
              id="firstName"
              type="text"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
              placeholder="Votre prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
              placeholder="Votre @email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
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
              S'inscrire
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte?{' '}
              <button
                onClick={() => router.push('/signin')}
                className="text-indigo-500 hover:underline"
              >
                Connectez-vous
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
