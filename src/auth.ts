import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Google sign-in with stateless JWT sessions. No database adapter: the only thing
 * persisted about a visitor is their Google account id, next to their ticked points.
 * Reads AUTH_SECRET, AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET from the environment.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    session({ session, token }) {
      if (!token.sub) return session;
      return { ...session, user: { ...session.user, id: token.sub } };
    },
  },
});
