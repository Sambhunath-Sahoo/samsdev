import personalInfo from '@/data/personal-info.json'

export default function Home() {
  const { personal, experience } = personalInfo
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 section-spacing">
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black dark:text-white leading-[1.1] mb-8">
            {personal.title}
          </h1>
          <p className="text-xl sm:text-2xl text-gray-800 dark:text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
            I&apos;m {personal.name}, {personal.bio}
          </p>
        </div>
      </section>

      {/* Work Experience Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Work Experience</h2>
        
        <div className="space-y-8">
          {experience.map((exp, index) => (
            <div key={exp.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${index === 0 ? 'bg-gray-900 dark:bg-gray-100' : 'bg-blue-600'} rounded-lg flex items-center justify-center`}>
                    <span className={`${index === 0 ? 'text-white dark:text-gray-900' : 'text-white'} font-bold text-sm`}>
                      {exp.company.split(' ').map(word => word[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black dark:text-white">{exp.company}</h3>
                  <p className="text-sm text-gray-800 dark:text-gray-200">{exp.position}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - {exp.endDate === 'Present' ? 'Present' : new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-gray-800 dark:text-gray-200 mb-3">
                    {exp.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Built with Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-black dark:text-white mb-4">Built with:</h3>
          <div className="flex items-center justify-center space-x-6">
            <span className="text-gray-800 dark:text-gray-200">Next.js</span>
            <span className="text-gray-800 dark:text-gray-200">Tailwind CSS</span>
            <span className="text-gray-800 dark:text-gray-200">Vercel</span>
          </div>
        </div>
      </section>
    </div>
  );
}