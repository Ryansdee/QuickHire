'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { useUser } from '../../context/UserContext';

const Settings = () => {
  const { user, setUser } = useUser();
  const router = useRouter();
  const currentUser = getAuth().currentUser;

  // States pour gérer les informations modifiées
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!user || !currentUser) {
      router.push('/signin'); // Si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
    }
  }, [user, currentUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Mise à jour du prénom et du nom
      if (currentUser && firstName !== user?.firstName || lastName !== user?.lastName) {
        await updateProfile(currentUser, {
          displayName: `${firstName} ${lastName}`,
        });
      }

      // Mise à jour de l'email
      if (email !== currentUser?.email) {
        await updateEmail(currentUser!, email);
      }

      // Mise à jour du mot de passe
      if (password) {
        await updatePassword(currentUser!, password);
      }

      // Mise à jour du numéro de téléphone dans le contexte
      setUser((prevUser) => ({
        ...prevUser!,
        firstName,
        lastName,
        phoneNumber,
      }));

      setSuccess('Vos informations ont été mises à jour avec succès !');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Paramètres du Profil</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        {/* Formulaire de mise à jour */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
              Prénom
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
              Numéro de téléphone
            </label>
            <input
              type="text"
              id="phoneNumber"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
              Nouveau mot de passe (laisser vide pour ne pas modifier)
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 mt-1 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-gray-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
            >
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
