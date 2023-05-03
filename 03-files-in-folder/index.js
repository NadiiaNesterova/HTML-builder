const fs = require('fs');
const path = require('path');

const directory = './03-files-in-folder/secret-folder';

async function readDirectory() {
  try {
    const files = await fs.promises.readdir(directory);
    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStats = await fs.promises.stat(filePath);
      if (fileStats.isFile()) {
        const name = path.basename(file, path.extname(file));
        const extension = path.extname(file).substring(1);
        const sizeInBytes = fileStats.size;

        console.log(`${name} - ${extension} - ${sizeInBytes} bytes`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readDirectory();
