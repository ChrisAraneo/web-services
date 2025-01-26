import DecompressZip from 'decompress-zip';

export async function unzip(archive: string, output: string) {
  return new Promise<void>((resolve, reject) => {
    const unzipper = new DecompressZip(archive);

    unzipper.on('error', (error: unknown) => {
      reject(error);
    });

    unzipper.on('extract', () => {
      resolve();
    });

    unzipper.extract({
      path: output,
      filter: (file: unknown) => {
        return file['type'] !== 'SymbolicLink';
      },
    });
  });
}
