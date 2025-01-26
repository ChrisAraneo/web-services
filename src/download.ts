import fs from 'fs';
import http from 'http';
import https from 'https';

const RAW_HEADERS = 'rawHeaders';
const LOCATION = 'Location';
const CONTENT_TYPE = 'content-type';
const CONTENT_LENGTH = 'content-length';

interface FileInfo {
  mime: string;
  size: number;
}

export async function download(
  url: string,
  filePath: string,
): Promise<FileInfo | null> {
  const proto = !url.charAt(4).localeCompare('s') ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo: FileInfo | null = null;

    const request = proto.get(url, (response) => {
      if (response.statusCode === 302) {
        return download(
          response[RAW_HEADERS][
            response[RAW_HEADERS].findIndex((i) => i === LOCATION) + 1
          ],
          filePath,
        );
      } else if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        });
        return;
      }

      fileInfo = {
        mime: response.headers[CONTENT_TYPE],
        size: parseInt(response.headers[CONTENT_LENGTH], 10),
      };

      response.pipe(file);
    });

    file.on('finish', () => resolve(fileInfo));

    request.on('error', (error: unknown) => {
      fs.unlink(filePath, () => reject(error));
    });

    file.on('error', (error: unknown) => {
      fs.unlink(filePath, () => reject(error));
    });

    request.end();
  });
}
