'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './globals.css';
import { UserProvider, useUser } from '../context/UserContext';

const Navbar = () => {
  const { user } = useUser();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const firstN = user ? user.firstName.split(' ')[0] : '';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + navigation */}
        <div className="flex items-center gap-6">
          <Link href="/">
            <img src="/logo.png" alt="QuickHire logo" width={100} />
          </Link>
          <div className="flex gap-4 text-gray-700 text-base">
          <Link
            href="/"
            className="border-b-2 border-transparent hover:border-green-500 transition duration-300"
          >
            Page d’accueil
          </Link>
            <Link
              href="/testimonials"
              className="border-b-2 border-transparent hover:border-green-500 transition duration-300"
            >
              Avis sur l’entreprise
            </Link>
          </div>
        </div>

        {/* Connexion / Utilisateur */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Bonjour, {firstN}!
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 z-50">
                  <ul>
                    <li>
                      <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link href="/profile" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Mon Profil
                      </Link>
                    </li>
                    <li>
                      <Link href="/settings" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Paramètres
                      </Link>
                    </li>
                    <li>
                      <Link href="/logout" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">
                        Déconnexion
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/signup"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
              >
                Inscription
              </Link>
              <Link
                href="/signin"
                className="px-4 py-2 bg-green-200 text-gray-800 rounded-md hover:bg-green-300 transition"
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

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head />
      <body className="min-h-screen flex flex-col">
        <UserProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-gray-800 py-6 text-center text-green-400">
            <p>&copy; 2025 QuickHire. Tous droits réservés.</p>
          </footer>
        </UserProvider>
      </body>
    </html>
  );
}
