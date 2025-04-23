// src/app/jobs/[id]/page.tsx
import Link from 'next/link';  // Importer Link de Next.js
import { notFound } from 'next/navigation';
import { getJobById } from '../../../../lib/jobs';  // Fonction pour récupérer les détails du job
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from 'react';

const JobDetailPage = async ({ params }: { params: { id: string } }) => {
  const jobId = params.id;
  const job = await getJobById(jobId);

  if (!job) {
    notFound();  // Si le job n'existe pas, rediriger vers une page 404
  }

  const name = job.jobTitle.replaceAll(" ", "_")
  const urlName = name.toLowerCase();

  const description = job.description.split('\n').map((text: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
    <p key={index} className="text-base text-gray-700 leading-relaxed mb-4">{text}</p>
  ));

  
  const title = job.jobTitle.split(",");
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{job.jobTitle}</h2>
          <p className="text-lg text-green-600 mb-6">{job.company || "QuickHire"}</p>

          <div className="flex items-center text-sm text-gray-600 mb-6">
            <p className="mr-4">{job.location}</p>
            <span>•</span>
            <p className="ml-4">{job.experienceYears} ans d'expérience</p>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h3>
          
          <div className="space-y-4">
            {description}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags && job.tags.split(',').map((tag: string, index: number) => (
              <span key={index} className="inline-block px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-6">
            {job.lang && job.lang.split(',').map((lang: string, index: number) => (
              <span key={index} className="inline-block px-4 py-2 text-sm font-medium text-green-700 bg-transparent rounded-full">{lang}</span>
            ))}
          </div>

          <div className="flex justify-center">
            <Link href={`/test?name=${urlName}&lang=${job.lang}`} passHref>
              <button className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors cursor-pointer">
                Postuler maintenant
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
