import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    env: {
      apiUrl: "http://127.0.0.1:8000"
    },
    // setupNodeEvents(on, config) {},
    supportFile: "cypress/support/e2e.ts",
  },
});
