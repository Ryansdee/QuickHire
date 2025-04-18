import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { filePath } = await request.json();

    if (!filePath) {
      return NextResponse.json({ error: 'Aucun chemin de fichier fourni' }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), 'public', filePath); // ou adapte selon ton dossier

    await fs.unlink(fullPath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
