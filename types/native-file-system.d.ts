interface ChooseFileSystemEntriesOptionsAccepts {
  description?: string;
  mimeTypes?: string[];
  extensions?: string[];
}

interface ChooseFileSystemEntriesOptions {
  type?: 'openFile' | 'saveFile' | 'openDirectory';
  multiple?: boolean;
  accepts?: ChooseFileSystemEntriesOptionsAccepts[];
  excludeAcceptAllOption?: boolean;
}

interface FileSystemHandlePermissionDescriptor {
  writable?: boolean;
}

interface FileSystemCreateWriterOptions {
  keepExistingData?: boolean;
}

interface FileSystemGetFileOptions {
  create?: boolean;
}

interface FileSystemGetDirectoryOptions {
  create?: boolean;
}

interface FileSystemRemoveOptions {
  recursive?: boolean;
}

enum SystemDirectoryType {
  'sandbox',
}

interface GetSystemDirectoryOptions {
  type: SystemDirectoryType;
}

interface FileSystemWriter {
  write(position: number, data: BufferSource | Blob | string): Promise<void>;
  truncate(size: number): Promise<void>;
  close(): Promise<void>;
}

interface FileSystemWriterConstructor {
  new (): FileSystemWriter;
}

interface FileSystemHandle {
  isFile: Readonly<boolean>;
  isDirectory: Readonly<boolean>;
  name: Readonly<string>;
  queryPermission(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>;
  requestPermission(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>;
}

interface FileSystemHandleConstructor {
  new (): FileSystemHandle;
}

interface FileSystemFileHandle extends FileSystemHandle {
  getFile(): Promise<File>;
  createWriter(
    options?: FileSystemCreateWriterOptions,
  ): Promise<FileSystemWriter>;
}

interface FileSystemFileHandleConstructor {
  new (): FileSystemFileHandle;
}

interface FileSystemDirectoryHandle extends FileSystemHandle {
  getFile(
    name: string,
    options?: FileSystemGetFileOptions,
  ): Promise<FileSystemFileHandle>;
  getDirectory(
    name: string,
    options?: FileSystemGetDirectoryOptions,
  ): Promise<FileSystemDirectoryHandle>;
  getEntries(): AsyncIterable<FileSystemFileHandle | FileSystemDirectoryHandle>;
  removeEntry(name: string, options?: FileSystemRemoveOptions): Promise<void>;
}

interface FileSystemDirectoryHandleConstructor {
  new (): FileSystemDirectoryHandle;
  getSystemDirectory(
    options: GetSystemDirectoryOptions,
  ): Promise<FileSystemDirectoryHandle>;
}

interface Window {
  chooseFileSystemEntries(
    options?: ChooseFileSystemEntriesOptions & { multiple?: false },
  ): Promise<FileSystemFileHandle>;
  chooseFileSystemEntries(
    options?: ChooseFileSystemEntriesOptions & { multiple: true },
  ): Promise<FileSystemFileHandle[]>;
  FileSystemHandle: FileSystemHandleConstructor;
  FileSystemFileHandle: FileSystemFileHandleConstructor;
  FileSystemDirectoryHandle: FileSystemDirectoryHandleConstructor;
  FileSystemWriter: FileSystemWriterConstructor;
}
