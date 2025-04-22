'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useUser } from '../../context/UserContext'; // Contexte utilisateur
import { HiOutlineDocumentText, HiOutlineBriefcase } from 'react-icons/hi';

const Dashboard = () => {
  const { user, setUser } = useUser(); // Accède à l'utilisateur connecté et à la fonction setUser
  const router = useRouter();
  const [responses, setResponses] = useState([]); // État pour stocker les réponses
  const [loading, setLoading] = useState(true); // Indicateur de chargement

  // Vérifier si un utilisateur est stocké dans localStorage et le charger dans le contexte
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData); // Met à jour l'utilisateur dans le contexte
    } else {
      // Si l'utilisateur n'est pas connecté, rediriger vers la page de connexion
      router.push('/signin');
    }
  }, [setUser, router]);

  // Charger les réponses de l'employeur lorsqu'un utilisateur est connecté
  useEffect(() => {
    if (user) {
      console.log('Utilisateur connecté:', user); // Déboguer l'objet utilisateur

      // Vérifier si l'ID de l'utilisateur est défini
      if (user.id) {
        const fetchResponses = async () => {
          try {
            const response = await fetch(`/api/response?employerId=${user.id}`);
            const data = await response.json();
            setResponses(data); // Met à jour les réponses dans l'état
          } catch (error) {
            console.error('Erreur lors du chargement des réponses:', error);
          } finally {
            setLoading(false); // Fin du chargement
          }
        };

        fetchResponses();
      } else {
        console.error('L\'ID de l\'utilisateur est indéfini');
      }
    }
  }, [user]);

  // Si l'utilisateur n'est pas connecté, le rediriger vers /signin
  if (!user) {
    return null; // Ne rien rendre si l'utilisateur n'est pas connecté
  }

  const firstN = user.firstName.split(' ')[0];

  return (
    <>
      <Head>
        <title>Dashboard - QuickHire</title>
        <meta name="description" content="Tableau de bord de votre compte QuickHire" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-6 text-center">Bienvenue {firstN} sur votre tableau de bord</h2>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Gérez votre profil, vos candidatures et vos offres d'emploi en toute simplicité.
          </p>

          {/* Section des cartes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Autres cartes */}
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
              <div className="flex items-center space-x-4">
                <HiOutlineDocumentText className="text-indigo-500 text-3xl" />
                <div>
                  <h4 className="text-xl font-semibold text-gray-800">Réponses reçues</h4>
                  {loading ? (
                    <p className="text-gray-600">Chargement des réponses...</p>
                  ) : (
                    <p className="text-gray-600">Vous avez {responses.length} réponses à vos offres d'emploi.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Affichage des réponses */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Réponses aux offres :</h3>
            {responses.length > 0 ? (
              <ul>
                {responses.map((response) => (
                  <li key={response.id} className="border-b py-4">
                    <h4 className="font-semibold text-gray-800">{response.jobTitle}</h4>
                    <p className="text-gray-600">Candidat: {response.candidate_id}</p>
                    <p className="text-gray-600">Code soumis: {response.code}</p>
                    <p className="text-gray-600">Statut: {response.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Aucune réponse reçue pour vos offres d'emploi.</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
