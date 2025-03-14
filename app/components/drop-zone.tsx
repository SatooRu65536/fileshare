import classNames from "classnames";
import { forwardRef, HTMLProps, useImperativeHandle } from "react";
import { useDropzone } from "react-dropzone";

interface Props extends HTMLProps<HTMLDivElement> {
  onFileDrop?: (files: File[]) => void;
}

export interface FileDropzoneRef {
  open: () => void;
}

export const FileDropzone = forwardRef(
  ({ children, className, onFileDrop, ...props }: Props, ref) => {
    const { getRootProps, getInputProps, open, acceptedFiles, isDragActive } =
      useDropzone({
        onDrop: onFileDrop,
        multiple: false,
      });

    useImperativeHandle(
      ref,
      () =>
        ({
          open: () => open(),
        } satisfies FileDropzoneRef),
    );

    return (
      <div
        {...getRootProps()}
        onClick={undefined}
        {...props}
        className={classNames(className, "relative")}
      >
        <input name="file" {...getInputProps()} />
        <input
          name="name"
          type="hidden"
          value={acceptedFiles.at(0)?.name ?? ""}
        />
        <input
          name="type"
          type="hidden"
          value={acceptedFiles.at(0)?.type ?? ""}
        />

        {isDragActive && (
          <p className="absolute inset-0 m-auto inline-block w-fit h-fit">
            Drop the files here ...
          </p>
        )}
        <div style={{ opacity: isDragActive ? 0 : 1 }}>{children}</div>
      </div>
    );
  },
);
