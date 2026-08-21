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
        <h1 className="text-2xl font-semibold text-text-primary">Admin access</h1>
        <p className="mt-2 text-sm text-text-secondary">Enter the shared admin token to continue.</p>
      </div>

      <form action={loginAction} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm text-text-secondary">
          Access token
          <input
            type="password"
            name="token"
            required
            autoFocus
            className="rounded-md border border-control-border bg-surface-raised px-3 py-2 text-text-primary outline-none focus-visible:border-accent"
          />
        </label>

        {error ? (
          <p className="text-sm text-status-error" role="alert">
            That token is not valid.
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-text-on-accent transition-colors duration-150 hover:bg-accent-600"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
