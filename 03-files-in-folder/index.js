const fs = require('fs').promises;
const path = require('path');

const directory = './03-files-in-folder/secret-folder';

async function readDirectory() {
  try {
    const files = await fs.readdir(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const fileStats = await fs.stat(filePath);

      if (fileStats.isFile()) {
        const { name, ext } = path.parse(file);
        const sizeInBytes = fileStats.size;

        console.log(`${name} - ${ext.substring(1)} - ${sizeInBytes} bytes`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

readDirectory();
