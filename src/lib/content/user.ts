import userData from "@/data/user.json";
import type { UserProfile } from "@/types/content";

export const user: UserProfile = userData as UserProfile;

export function getUser(): UserProfile {
  return user;
}


