import fs from 'fs/promises';
import path from 'path';
import pdfParse from 'pdf-parse';

export async function GET() {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  const files = await fs.readdir(uploadDir);

  const fileData = await Promise.all(
    files.map(async (file) => {
      const filePath = path.join(uploadDir, file);
      const dataBuffer = await fs.readFile(filePath);

      let textContent = '';
      try {
        // Extraction du texte à partir du PDF
        const pdf = await pdfParse(dataBuffer);
        textContent = pdf.text;
      } catch (err) {
        console.error(`Erreur lors de l'analyse du fichier PDF ${file}`, err);
      }

      return {
        name: file,
        path: `/uploads/${file}`,
        textContent, // Le texte extrait du fichier PDF
        uploadDate: (await fs.stat(filePath)).mtime,
      };
    })
  );

  return Response.json({ files: fileData });
}
