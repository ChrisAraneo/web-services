import path from 'node:path';

import { download } from './download';
import { unzip } from './unzip';

const REPOSITORIES = ['minecraft-players-number-notifier', 'email-service'];

function downloadRepository(repository: string) {
  return new Promise<string>((resolve, reject) => {
    console.log(`Downloading ${repository}`);

    download(
      `https://codeload.github.com/ChrisAraneo/${repository}/zip/refs/heads/master`,
      path.normalize(process.cwd() + `/${repository}.zip`),
    )
      .then(() => {
        resolve(repository);
      })
      .catch((error: unknown) => {
        reject(error);
      });
  });
}

REPOSITORIES.forEach((repository) => {
  downloadRepository(repository)
    .then(() => {
      console.log('Downloaded repository ' + repository);

      const archive = path.normalize(`${process.cwd()}/${repository}.zip`);
      const output = path.normalize(`${process.cwd()}/${repository}`);

      console.log(`Extracting file ${archive}`);

      unzip(archive, output)
        .then(() => {
          console.log(`Extracted ${archive} into ${output}`);
        })
        .catch((error: unknown) => {
          console.error(`Extracting error (${archive})`);
          console.error(error);
        });
    })
    .catch((error) => {
      console.error('Error during downloading repository');
      console.error(error);
    });
});
