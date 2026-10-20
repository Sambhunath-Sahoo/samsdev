import { auth, signIn, signOut } from "@/auth";
import { Rail } from "@/components/section-shell";

/** Sign-in / sign-out strip shown above anything that saves progress. Signs back in to `redirectTo`. */
export async function AuthBar({
  redirectTo,
  progressUnavailable,
  signedOutMessage,
  signedInMessage,
  framed = true,
}: {
  redirectTo: string;
  progressUnavailable: boolean;
  signedOutMessage: string;
  signedInMessage: string;
  /** Wrap in the page rail. Pass false when the bar already sits inside one. */
  framed?: boolean;
}) {
  const session = await auth();
  const user = session?.user;

  async function signInWithGoogle() {
    "use server";
    await signIn("google", { redirectTo });
  }

  async function signOutOfSite() {
    "use server";
    await signOut({ redirectTo });
  }

  const body = (
    <>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-4 md:px-10">
          {user ? (
            <>
              <p className="text-sm text-muted">
                Signed in as <span className="text-ink">{user.name ?? user.email}</span>. {signedInMessage}
              </p>
              <form action={signOutOfSite}>
                <button type="submit" className="btn btn-secondary btn-sm">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <p className="text-sm text-muted">{signedOutMessage}</p>
              <form action={signInWithGoogle}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Sign in with Google
                </button>
              </form>
            </>
          )}
        </div>
        {progressUnavailable && (
          <p role="alert" className="border-t border-line px-6 py-3 text-sm text-danger md:px-10">
            Your saved progress could not be loaded right now. Ticks will not be saved until it is back.
          </p>
        )}
    </>
  );

  return <section>{framed ? <Rail>{body}</Rail> : body}</section>;
}
