// /src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const connection = await getConnection();

    const [rows] = await connection.execute('SELECT * FROM jobs');
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des jobs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { jobTitle, experienceYears, skills, location, description, tags } = await request.json();

    if (!jobTitle || !experienceYears || !skills || !location || !description || !tags) {
      return NextResponse.json({ error: 'Tous les champs doivent être remplis' }, { status: 400 });
    }

    const connection = await getConnection();

    const query = `
      INSERT INTO jobs (jobTitle, experienceYears, skills, location, description, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await connection.execute(query, [
      jobTitle,
      experienceYears,
      skills,
      location,
      description,
      tags,
    ]);

    await connection.end();

    const insertId = result.insertId;

    return NextResponse.json({ success: true, jobId: insertId });
  } catch (error) {
    console.error('Erreur lors de la création de l\'offre d\'emploi:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Erreur serveur inconnue' }, { status: 500 });
  }
}
