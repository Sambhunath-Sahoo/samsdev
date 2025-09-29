export default function About() {
  return (
    <div className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-black dark:text-white leading-tight mb-8">
            I'm Your Name. I live in Your City, where I build the future.
          </h1>
          
          <div className="prose prose-lg text-gray-800 dark:text-gray-200 space-y-6">
            <p>
              I am a self-driven, career-oriented software engineer specializing in front-end development 
              and open-source, currently pursuing a bachelors degree in computer science. My expertise lies 
              in building interactive web applications on the client side. Primarily working with technologies 
              like JavaScript, Next.js, TypeScript and Python.
            </p>
            
            <p>
              I strongly believe in continuous learning and improving myself, so I try my best to learn in 
              any situation possible, unfavorable or not.
            </p>
            
            <p>
              Beyond learning, I enjoy writing technical articles and creating projects that both inspire 
              and benefit fellow developers. You can find my recent posts on my personal blog hosted on this site.
            </p>
            
            <blockquote className="border-l-4 border-gray-300 pl-6 italic text-gray-600">
              If you ever spot me in the wild, don't hesitate to say hello! Let's grab a drink and geek-out 
              over the latest advancements in front-end development or discuss our favorite programming language. ⚡
            </blockquote>
          </div>
        </div>
      </section>

      {/* Soft Skills Section */}
      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-8">Soft Skills</h2>
        <p className="text-gray-800 dark:text-gray-200 mb-6">Certain skills I've picked along the way that deserves mentioning:</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Attention to detail</h3>
            <p className="text-gray-800 dark:text-gray-200">
              I take pleasure in creating designs and UIs with careful precision, emphasizing quality over quantity.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Open-source/Collaboration</h3>
            <p className="text-gray-800 dark:text-gray-200">
              I founded a community on GitHub that helps newbie developers learn how to contribute to 
              open-source projects and collaborate in building together. Currently we are over 400 people 
              strong with room for growth.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-black dark:text-white mb-2">Ability to work with little supervision</h3>
            <p className="text-gray-800 dark:text-gray-200">
              I understand people are busy and would love to get things done timely, so I do my best in 
              delivering assignments and projects with little supervision, sparing you the need to closely 
              manage/oversee my work.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
