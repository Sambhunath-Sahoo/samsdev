import servicesData from "@/data/services.json";
import type { ServiceItem } from "@/types/content";

export const services: ServiceItem[] = servicesData as ServiceItem[];

export function getServices(): ServiceItem[] {
  return services;
}


