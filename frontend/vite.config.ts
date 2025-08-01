import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
  define: {
    'process.env': env
  },
	plugins: [react()],
	server: {
		port: 3000,
		historyApiFallback: true,
	},
	build: {
		outDir: "build",
	},
}
})
