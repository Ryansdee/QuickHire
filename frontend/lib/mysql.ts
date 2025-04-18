// lib/mysql.ts
import mysql from 'mysql2/promise';

// Crée une connexion à la base de données MySQL
export const getConnection = async () => {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root', // Remplace par ton mot de passe MySQL
    database: 'quickhire', // Ton nom de base de données
  });
  return connection;
};
