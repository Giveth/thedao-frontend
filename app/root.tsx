import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { Providers } from "~/context/providers";
import Navbar from "~/components/Navbar";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-dao-blue">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Providers>
      <Navbar />
      <Outlet />
    </Providers>
  );
}

// HydrateFallback for SEO - shows static content while JavaScript loads
export function HydrateFallback() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-dao-blue text-white p-4">
      <h1 className="text-6xl font-bold mb-4">{message}</h1>
      <p className="text-xl mb-8">{details}</p>
      {stack && (
        <pre className="w-full max-w-4xl p-4 overflow-x-auto bg-dao-blue-dark rounded-lg">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

