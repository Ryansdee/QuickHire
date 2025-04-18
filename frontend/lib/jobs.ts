// src/lib/jobs.ts (ou un fichier similaire dans ton projet)

import { getConnection } from './mysql';  // Import de la fonction de connexion à MySQL

export const getJobById = async (jobId: string) => {
  const connection = await getConnection();
  const [rows]: any = await connection.execute('SELECT * FROM jobs WHERE id = ?', [jobId]);
  await connection.end();

  return rows.length > 0 ? rows[0] : null;
};
