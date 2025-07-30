import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
  },
  define: {
    // Suppress React warnings in development mode
    __DEV__: mode === 'development' ? 'false' : 'true',
  },
  plugins: [
    react(),
    expressPlugin(),
    warningSuppressionPlugin()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      const app = createServer();

      // Add Express app as middleware to Vite dev server
      server.middlewares.use(app);
    },
  };
}

function warningSuppressionPlugin(): Plugin {
  return {
    name: "warning-suppression",
    apply: "serve",
    transformIndexHtml: {
      enforce: 'pre',
      transform(html) {
        // Inject our warning suppression script at the very beginning
        return html.replace(
          '<head>',
          `<head>
    <script>
      // Immediate React warning suppression - runs before any other code
      (function() {
        const originalWarn = console.warn;
        console.warn = function(format, ...args) {
          if (typeof format === 'string' &&
              format.includes('Support for defaultProps will be removed') &&
              args.some(arg => typeof arg === 'string' && (arg.includes('XAxis') || arg.includes('YAxis')))) {
            return; // Suppress Recharts defaultProps warnings
          }
          return originalWarn.apply(console, [format, ...args]);
        };
      })();
    </script>`
        );
      }
    }
  };
}
