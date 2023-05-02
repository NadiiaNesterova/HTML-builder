const fs = require('fs');
const path = require('path');

const directory = './03-files-in-folder/secret-folder';

fs.readdir(directory, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    const filePath = path.join(directory, file);
    const fileStats = fs.statSync(filePath);

    if (fileStats.isFile()) {
      const name = path.basename(file, path.extname(file));
      const extension = path.extname(file).substring(1);
      const sizeInBytes = fileStats.size;

      console.log(`${name} - ${extension} - ${sizeInBytes} bytes`);
    }
  });
});
