import { type LoaderFunctionArgs } from "@remix-run/cloudflare";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  if (params.file === undefined)
    throw new Response("Bad Request", { status: 400 });

  const res = await context.cloudflare.env.R2.get(params.file);
  if (res === null) throw new Response("Not Found", { status: 404 });

  return new Response(res.body, {
    headers: {
      "Content-Type":
        res.httpMetadata?.contentType ?? "application/octet-stream",
    },
  });
};
