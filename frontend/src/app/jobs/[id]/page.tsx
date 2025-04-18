// src/app/jobs/[id]/page.tsx
import Link from 'next/link';  // Importer Link de Next.js
import { notFound } from 'next/navigation';
import { getJobById } from '../../../../lib/jobs';  // Fonction pour récupérer les détails du job

const JobDetailPage = async ({ params }: { params: { id: string } }) => {
  const jobId = params.id;
  const job = await getJobById(jobId);

  if (!job) {
    notFound();  // Si le job n'existe pas, rediriger vers une page 404
  }


  const description = job.description.split('\n').map((text, index) => (
    <p key={index} className="text-base text-gray-700 leading-relaxed mb-4">{text}</p>
  ));

  
  const title = job.jobTitle.split(",");
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">

      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-8">
          {/* Job Title */}
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">{job.jobTitle}</h2>
          <p className="text-lg text-indigo-600 mb-6">{job.company || "QuickHire"}</p>

          {/* Job Location and Experience */}
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <p className="mr-4">{job.location}</p>
            <span>•</span>
            <p className="ml-4">{job.experienceYears} ans d'expérience</p>
          </div>

          {/* Job Description */}
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Description du poste</h3>
          
          {/* Splitting job description into paragraphs */}
          <div className="space-y-4">
            {description}
          </div>

          {/* Tags Section */}
          <div className="flex flex-wrap gap-2 mb-6">
            {job.tags && job.tags.split(',').map((tag: string, index: number) => (
              <span key={index} className="inline-block px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full">{tag}</span>
            ))}
          </div>

          {/* Apply Button with dynamic URL to test page */}
          <div className="flex justify-center">
            <Link href={`/test?id=${job.id}`} passHref>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors">
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
