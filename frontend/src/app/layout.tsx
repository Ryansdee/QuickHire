'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './globals.css'; // Si tu utilises un fichier global pour les styles
import { UserProvider, useUser } from '../context/UserContext'; // Import du contexte

// Navbar : Affiche soit le prénom de l'utilisateur, soit les liens de connexion/inscription
const Navbar = () => {
  const { user } = useUser();  // Accès à l'utilisateur du contexte
  const [isDropdownOpen, setDropdownOpen] = useState(false); // Pour gérer l'ouverture du dropdown
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Référence du menu dropdown

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  // Fonction pour fermer le dropdown si un clic est effectué en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    // Ajouter l'événement à l'écoute du document
    document.addEventListener('mousedown', handleClickOutside);

    // Nettoyage de l'écouteur d'événements
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          <Link href="/" className="px-6 py-2 bg-transparent text-gray-800 rounded-lg hover:bg-transparent transition bouton">
          QuickHire
          </Link></h1>
        <div className="space-x-6">
          {/* Si l'utilisateur est connecté, on affiche son prénom et un menu déroulant */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition bouton"
              >
                Bonjour, {user.firstName}!
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-48">
                  <ul>
                    <li>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Mon Profil
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Paramètres
                      </Link>
                    </li>
                    <li>
                      <Link href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Déconnexion
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // Si l'utilisateur n'est pas connecté, on affiche les liens d'inscription et de connexion
            <>
              <Link
                href="/signup"
                className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
              >
                Inscription
              </Link>
              <Link
                href="/signin"
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Connexion
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

// Layout principal avec le contexte utilisateur et la navbar partagée entre les pages
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body>
        <UserProvider>
          {/* Navbar avec affichage du prénom ou liens de connexion */}
          <Navbar />
          {/* Contenu principal des pages */}
          <main>{children}</main>
          {/* Footer */}
          <footer className="bg-gray-800 py-6 text-center text-white">
            <p>&copy; 2025 QuickHire. Tous droits réservés.</p>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
