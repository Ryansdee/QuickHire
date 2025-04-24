// /src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getConnection } from '../../../../lib/mysql';

export async function GET(request: NextRequest) {
  try {
    const connection = await getConnection();

    // Récupère le paramètre authorId depuis l'URL
    const authorId = request.nextUrl.searchParams.get('authorId');

    let rows;
    if (authorId) {
      // Si authorId est présent, filtrer les jobs
      [rows] = await connection.execute('SELECT * FROM jobs WHERE authorId = ?', [authorId]);
    } else {
      // Sinon, retourner tous les jobs (optionnel selon les besoins)
      [rows] = await connection.execute('SELECT * FROM jobs');
    }

    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des jobs:', error);
    return NextResponse.json({ error: 'Erreur lors de la récupération' }, { status: 500 });
  }
}


export async function POST(request: NextRequest) {
  try {
    const {
      jobTitle,
      experienceYears,
      skills,
      location,
      description,
      tags,
      authorId, // <- On récupère l'auteur
      company
    } = await request.json();

    if (
      !jobTitle ||
      !experienceYears ||
      !skills ||
      !location ||
      !description ||
      !tags ||
      !authorId ||
      !company
    ) {
      return NextResponse.json({ error: 'Tous les champs doivent être remplis' }, { status: 400 });
    }

    const connection = await getConnection();

    const query = `
      INSERT INTO jobs (jobTitle, experienceYears, skills, location, description, tags, authorId, company)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result]: any = await connection.execute(query, [
      jobTitle,
      experienceYears,
      skills,
      location,
      description,
      tags,
      authorId,
      company
    ]);

    await connection.end();

    const insertId = result.insertId;

    return NextResponse.json({ success: true, id: insertId }); // on renvoie aussi l'ID pour créer le test ensuite
  } catch (error) {
    console.error("Erreur lors de la création de l'offre d'emploi:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erreur serveur inconnue' },
      { status: 500 }
    );
  }
}
