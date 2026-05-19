import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const branch = process.env.GITHUB_REF_NAME
const repository = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = repository && branch ? `/${repository}/${branch}/` : '/'

export default defineConfig({
  plugins: [react()],
  base,
})
