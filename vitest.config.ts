import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  resolve: {
    alias: {
      // Next.js aliases "server-only" (and "client-only") internally at
      // build time without requiring the package to be installed. Plain
      // Vite has no such alias, so lib modules that `import "server-only"`
      // (rate-limit.ts, prisma.ts, benefits.ts, device.ts, eligibility.ts)
      // fail to resolve under Vitest without this. See test-stubs/server-only.ts.
      "server-only": path.resolve(__dirname, "test-stubs/server-only.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["**/node_modules/**", "tests/e2e/**"],
  },
});
