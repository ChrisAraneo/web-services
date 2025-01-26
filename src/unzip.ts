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

    unzipper.on('progress', function (fileIndex, fileCount) {
      console.log('Extracted file ' + (fileIndex + 1) + ' of ' + fileCount);
    });

    unzipper.extract({
      path: output,
      filter: function (file) {
        return file.type !== 'SymbolicLink';
      },
    });
  });
}
