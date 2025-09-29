export default function Photos() {
  const photos = [
    {
      id: 1,
      title: "Workspace Setup",
      description: "My current development setup",
      src: "/api/placeholder/400/300",
      alt: "Development workspace with monitors and keyboard"
    },
    {
      id: 2,
      title: "Conference Talk",
      description: "Speaking at React Conference 2024",
      src: "/api/placeholder/400/300",
      alt: "Speaking at a conference"
    },
    {
      id: 3,
      title: "Team Collaboration",
      description: "Working with the team on a new project",
      src: "/api/placeholder/400/300",
      alt: "Team meeting and collaboration"
    },
    {
      id: 4,
      title: "Code Review",
      description: "Reviewing code with colleagues",
      src: "/api/placeholder/400/300",
      alt: "Code review session"
    },
    {
      id: 5,
      title: "Hackathon Win",
      description: "Winning first place at the local hackathon",
      src: "/api/placeholder/400/300",
      alt: "Hackathon team holding trophy"
    },
    {
      id: 6,
      title: "Open Source Contribution",
      description: "Contributing to open source projects",
      src: "/api/placeholder/400/300",
      alt: "Working on open source code"
    }
  ];

  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-6">
            Photos
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A visual journey through my work, events, and experiences in the tech world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => (
            <div key={photo.id} className="group cursor-pointer">
              <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden mb-3">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 text-sm">Photo {photo.id}</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                {photo.title}
              </h3>
              <p className="text-sm text-gray-600">
                {photo.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
