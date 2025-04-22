// lib/response.ts
import { getConnection } from './mysql';  // Assurez-vous que la fonction de connexion est correctement définie

// Fonction pour soumettre une réponse
export const submitResponse = async (testId: string, candidateId: string, code: string) => {
  const connection = await getConnection();

  const query = `
    INSERT INTO responses (test_id, candidate_id, code)
    VALUES (?, ?, ?)
  `;
  const [result] = await connection.execute(query, [testId, candidateId, code]);

  await connection.end();
  return result;
};

// Fonction pour récupérer toutes les réponses pour un test
export const getResponses = async (testId: string) => {
  const connection = await getConnection();

  const query = `
    SELECT * FROM responses
    WHERE test_id = ?
    ORDER BY timestamp DESC
  `;
  const [rows] = await connection.execute(query, [testId]);

  await connection.end();
  return rows;
};

// Fonction pour accepter une réponse
export const acceptResponse = async (responseId: number) => {
  const connection = await getConnection();

  const query = `
    UPDATE responses
    SET status = 'accepted'
    WHERE id = ?
  `;
  const [result] = await connection.execute(query, [responseId]);

  await connection.end();
  return result;
};

// Fonction pour rejeter une réponse
export const rejectResponse = async (responseId: number) => {
  const connection = await getConnection();

  const query = `
    UPDATE responses
    SET status = 'rejected'
    WHERE id = ?
  `;
  const [result] = await connection.execute(query, [responseId]);

  await connection.end();
  return result;
};

export const getResponsesByEmployer = async (author: string) => {
  const connection = await getConnection();

  const query = `
    SELECT r.*, j.jobTitle
    FROM responses r
    INNER JOIN jobs j ON r.test_id = j.id
    WHERE j.author = ?
    ORDER BY r.timestamp DESC
  `;
  const [rows] = await connection.execute(query, [author]);

  await connection.end();
  return rows;
};