const fs = require('fs').promises;
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    await fs.mkdir(destDir, { recursive: true });

    const files = await fs.readdir(srcDir);

    for (let file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      const stat = await fs.stat(srcPath);

      if (stat.isFile()) {
        await fs.copyFile(srcPath, destPath);
      }

      if (stat.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }

    const destFiles = await fs.readdir(destDir);
    for (let file of destFiles) {
      const destPath = path.join(destDir, file);

      if (!files.includes(file)) {
        const stat = await fs.stat(destPath);
        if (stat.isFile()) {
          await fs.unlink(destPath);
        }
        if (stat.isDirectory()) {
          await fs.rmdir(destPath);
        }
      }
    }

  } catch (err) {
    console.error(err);
  }
}

const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');
copyDir(srcDir, destDir);
