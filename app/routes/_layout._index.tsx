import { type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useLoaderData, useRouteError } from "@remix-run/react";
import { FileMetadata } from "~/types";
import { DataTable } from "~/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "~/components/ui/button";
import { Trash2, Upload } from "lucide-react";
import { FileDropzone, FileDropzoneRef } from "~/components/drop-zone";
import { useCallback, useRef } from "react";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { objects } = await context.cloudflare.env.R2.list();

  const files: FileMetadata[] =
    objects.map((obj) => ({
      path: obj.key,
      size: obj.size,
      lastModified: obj.uploaded.toUTCString(),
      type: obj.httpMetadata?.contentType ?? "",
    })) ?? [];

  return { authorized: true, files };
};

export const columns: ColumnDef<FileMetadata>[] = [
  {
    accessorKey: "path",
    header: "ファイルパス",
    sortingFn: (a, b, key) => {
      const aPath = (a.getValue(key) as string).toLowerCase();
      const bPath = (b.getValue(key) as string).toLowerCase();

      return aPath.localeCompare(bPath);
    },
  },
  {
    accessorKey: "type",
    header: "ファイルタイプ",
  },
  {
    accessorKey: "size",
    header: "サイズ",
    size: 50,
    cell: ({ row }) => {
      const size = row.getValue("size") as number;
      // 単位
      const units = ["B", "KB", "MB", "GB", "TB"];
      let unitIndex = 0;
      let sizeInUnit = size;
      while (sizeInUnit >= 1024 && unitIndex < units.length) {
        sizeInUnit /= 1024;
        unitIndex++;
      }
      return (
        <p className="inline-block w-16 text-right">
          {sizeInUnit.toFixed(2)} {units[unitIndex]}
        </p>
      );
    },
  },
  {
    accessorKey: "lastModified",
    header: "最終更新日時",
    cell: ({ row }) => {
      const lastModified = row.getValue("lastModified") as string;
      const date = new Date(lastModified);
      // yyyy-mm-dd hh:mm:ss
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      return (
        <p className="inline-block w-fit">
          {year}年{month}月{day}日 {hours}時{minutes}分
        </p>
      );
    },
  },
  {
    id: "delete",
    header: "削除",
    cell: ({ row }) => (
      <Button
        variant="destructive"
        className="text-center"
        size="icon"
        onClick={() => {
          console.log("削除", row.original.path);
        }}
      >
        <Trash2 />
      </Button>
    ),
  },
];
export default function Index() {
  const { files } = useLoaderData<typeof loader>();
  const formRef = useRef<HTMLFormElement>(null);
  const dropzoneRef = useRef<FileDropzoneRef>(null);

  const dropZoneOpen = useCallback(() => dropzoneRef.current?.open(), []);
  const onFileDrop = useCallback(() => {
    setInterval(() => {
      formRef.current?.submit();
    }, 100);
  }, []);

  return (
    <Form action="/" method="POST" encType="multipart/form-data" ref={formRef}>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-xl py-2">ファイル一覧</h2>
        <Button onClick={dropZoneOpen} size="icon">
          <Upload />
        </Button>
      </div>

      <FileDropzone ref={dropzoneRef} onFileDrop={onFileDrop}>
        <div className="rounded-md border">
          <DataTable className="border" columns={columns} data={files} />
        </div>
      </FileDropzone>
    </Form>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <main>
      <p>アクセスできませんでした</p>
    </main>
  );
}
