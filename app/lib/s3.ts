import { S3Client } from "@aws-sdk/client-s3";
import { AppLoadContext } from "@remix-run/cloudflare";

export function getS3Client(context: AppLoadContext) {
  const {
    R2_ENDPOINT_URL,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY_ID,
    R2_BUCKET_NAME,
  } = context.cloudflare.env;
  if (R2_ENDPOINT_URL === undefined)
    throw new Error("R2_ENDPOINT_URL is not defined");
  if (R2_ACCESS_KEY_ID === undefined)
    throw new Error("R2_ACCESS_KEY_ID is not defined");
  if (R2_SECRET_ACCESS_KEY_ID === undefined)
    throw new Error("R2_SECRET_ACCESS_KEY_ID is not defined");
  if (R2_BUCKET_NAME === undefined)
    throw new Error("R2_BUCKET_NAME is not defined");

  const s3 = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT_URL,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY_ID,
    },
  });

  return s3;
}

export function getBucketName(context: AppLoadContext) {
  return context.cloudflare.env.R2_BUCKET_NAME;
}
