import { forwardRef, HTMLProps, useCallback, useImperativeHandle } from "react";
import { useDropzone } from "react-dropzone";

interface Props extends HTMLProps<HTMLDivElement> {
  onFileDrop: (files: File[]) => void;
}

export interface FileDropzoneRef {
  open: () => void;
}

export const FileDropzone = forwardRef(
  ({ children, onFileDrop, ...props }: Props, ref) => {
    const { getRootProps, getInputProps, open, isDragActive } = useDropzone({
      onDrop: onFileDrop,
    });

    useImperativeHandle(
      ref,
      () =>
        ({
          open: () => open(),
        } satisfies FileDropzoneRef),
    );

    return (
      <div {...getRootProps()} onClick={undefined}>
        <input {...getInputProps()} />
        {isDragActive ? <p>Drop the files here ...</p> : children}
      </div>
    );
  },
);
