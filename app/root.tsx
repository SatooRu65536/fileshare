import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import {
  ActionFunctionArgs,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  MetaFunction,
  unstable_parseMultipartFormData as parseMultipartFormData,
  type LinksFunction,
} from "@remix-run/cloudflare";
import "./tailwind.css";

export const meta: MetaFunction = () => {
  return [
    { title: "SatooRu's Files" },
    { name: "description", content: "SatooRu のファイル共有サービス!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export const action = async ({ request, context }: ActionFunctionArgs) => {
  if (request.method !== "POST")
    return new Response("Method Not Allowed", { status: 405 });

  const uploadHandler = createMemoryUploadHandler({
    maxPartSize: 1024 * 1024 * 1024, // 1GB
  });
  const formData = await parseMultipartFormData(request, uploadHandler);
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;
  const type = formData.get("type") as string | null;

  if (file === null) return new Response("No file found", { status: 400 });
  if (name === null) return new Response("No name found", { status: 400 });

  context.cloudflare.env.R2.put(name, await file.arrayBuffer(), {
    httpMetadata: { contentType: type ?? undefined },
  });

  return new Response("OK", { status: 200 });
};

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
