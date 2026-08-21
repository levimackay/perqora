import type { Metadata } from "next";
import { loginAction } from "./actions";

export const metadata: Metadata = { title: "Admin login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-text-primary text-2xl font-semibold">Admin access</h1>
        <p className="text-text-secondary mt-2 text-sm">Enter the shared admin token to continue.</p>
      </div>

      <form action={loginAction} className="flex flex-col gap-4">
        <label className="text-text-secondary flex flex-col gap-2 text-sm">
          Access token
          <input
            type="password"
            name="token"
            required
            autoFocus
            className="border-control-border bg-surface-raised text-text-primary focus-visible:border-accent rounded-md border px-3 py-2 outline-none"
          />
        </label>

        {error ? (
          <p className="text-status-error text-sm" role="alert">
            That token is not valid.
          </p>
        ) : null}

        <button
          type="submit"
          className="bg-accent text-text-on-accent hover:bg-accent-600 rounded-md px-4 py-2.5 text-sm font-medium transition-colors duration-150"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
