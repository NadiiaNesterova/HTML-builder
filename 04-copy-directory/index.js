const fs = require('fs');
const path = require('path');

async function copyDir(srcDir, destDir) {
  try {
    // Создаем папку, если она не существует
    await fs.promises.mkdir(destDir, { recursive: true });

    // Читаем содержимое директории
    const files = await fs.promises.readdir(srcDir);

    // Рекурсивно обходим все файлы и папки внутри исходной директории
    for (let file of files) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      // Получаем информацию о файле или папке
      const stat = await fs.promises.stat(srcPath);

      // Если это файл, то копируем его
      if (stat.isFile()) {
        await fs.promises.copyFile(srcPath, destPath);
      }

      // Если это папка, то рекурсивно вызываем эту же функцию для копирования содержимого папки
      if (stat.isDirectory()) {
        await copyDir(srcPath, destPath);
      }
    }

    // Удаляем файлы, которых нет в исходной директории
    const destFiles = await fs.promises.readdir(destDir);
    for (let file of destFiles) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, file);

      // Если файл не существует в исходной директории, то удаляем его
      if (!files.includes(file)) {
        const stat = await fs.promises.stat(destPath);
        if (stat.isFile()) {
          await fs.promises.unlink(destPath);
        }
        if (stat.isDirectory()) {
          await fs.promises.rmdir(destPath);
        }
      }
    }

  } catch (err) {
    console.error(err);
  }
}

// Запускаем функцию
const srcDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');
copyDir(srcDir, destDir);
