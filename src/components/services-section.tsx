import { getServices } from "@/lib/content/services";
import type { SanityServiceItem } from "@/types/content";

// Hardcoded icons - mapped by title or index
const SERVICE_ICONS: Record<string, string> = {
  "Backend Development": "🔧",
  "Frontend Development": "🎨",
  "Database Design": "🗄️",
  "Cloud Infrastructure": "☁️",
  "API Integration": "🔗",
  "Performance Optimization": "⚡",
};

// Fallback icons if title doesn't match
const FALLBACK_ICONS = ["💻", "🚀", "⚙️", "🎯", "🔨", "📊", "🌐", "🛠️"];

function getIconForService(service: SanityServiceItem, index: number): string {
  return SERVICE_ICONS[service.title] || FALLBACK_ICONS[index % FALLBACK_ICONS.length];
}

export async function ServicesSection() {
  const services = await getServices();
  
  if (!services || services.length === 0) return null;

  return (
    <section id="services" className="section-padding container-padding">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Expertise</p>
          <h2 className="mt-1 text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            WHAT I DO
          </h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={service._id}
              className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{getIconForService(service, index)}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
