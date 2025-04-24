// lib/submissions.ts
import mysql from 'mysql2';

// Configuration de la connexion à la base de données
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',  // Remplacez par votre mot de passe DB
  database: 'quickhire', // Remplacez par votre base de données
});

// Connecter à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
    return;
  }
  console.log('Connecté à la base de données MySQL');
});

// Fonction pour insérer le feedback dans la base de données
export async function insertFeedback(testId: string, candidateId: string, code: string, feedback: string, score: number) {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO feedbacks (test_id, candidate_id, code, feedback, score, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [testId, candidateId, code, feedback, score, 'completed'];

    db.query(query, params, (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'insertion du feedback dans la base de données:', err);
        reject({ error: 'Erreur lors de l\'insertion dans la base de données' });
      } else {
        console.log('Feedback inséré avec succès:', results);
        resolve({ success: true });
      }
    });
  });
}
