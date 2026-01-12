"use client";

import { motion } from "framer-motion";
import { getServices } from "@/lib/content/services";

export function ServicesSection() {
  const services = getServices();

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
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {service.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

