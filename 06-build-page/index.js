const fs = require('fs').promises;
const path = require('path');

const distPath = './06-build-page/project-dist';
const indexPath = './06-build-page/project-dist/index.html';
const templatePath = './06-build-page/template.html';
const componentsPath = './06-build-page/components';
const stylePath = './06-build-page/project-dist/style.css';
const stylesPath = './06-build-page/styles';
const pagesPath = './06-build-page/project-dist/assets';
const assetsPath = './06-build-page/assets';

async function updateIndex() {
  try {
    const template = await fs.readFile(templatePath, 'utf8');

    const tags = template.match(/{{\s*([\w-]+)\s*}}/g) || [];

    const components = await Promise.all(tags.map((tag) => {
      const componentName = tag.slice(2, -2).trim();
      const componentPath = path.join(componentsPath, `${componentName}.html`);
      return fs.readFile(componentPath, 'utf8');
    }));

    let indexHtml = template;
    tags.forEach((tag, i) => {
      indexHtml = indexHtml.replace(tag, components[i]);
    });

    await fs.writeFile(indexPath, indexHtml);
  } catch (err) {
    console.error('Failed to update index.html', err);
  }
}

async function updateStyle() {
  try {
    const files = await fs.readdir(stylesPath);

    const styles = await Promise.all(files.map(async (file) => {
      const filePath = path.join(stylesPath, file);
      const fileData = await fs.readFile(filePath, 'utf8');
      return fileData;
    }));

    const styleData = styles.join('');
    await fs.writeFile(stylePath, styleData);
  } catch (err) {
    console.error('Failed to update style.css', err);
  }
}

async function updateAssets() {
  try {
    const filePaths = await readDirectoryRecursive(assetsPath);

    const destPath = pagesPath;
    await copyDirectory(assetsPath, destPath);

    console.log('Updated assets');
  } catch (err) {
    console.error('Failed to update assets', err);
  }
}

async function readDirectoryRecursive(dirPath) {
  const files = await fs.readdir(dirPath);

  const filePaths = await Promise.all(files.map(async (file) => {
    const filePath = path.join(dirPath, file);
    const stats = await fs.stat(filePath);
    if (stats.isFile()) {
      return filePath;
    } else if (stats.isDirectory()) {
      const subFilePaths = await readDirectoryRecursive(filePath);
      return subFilePaths;
    }
  }));

  return filePaths.flat();
}

async function copyDirectory(srcPath, destPath) {
  await fs.mkdir(destPath, { recursive: true });

  const files = await fs.readdir(srcPath, { withFileTypes: true });

  await Promise.all(files.map(async (file) => {
    const srcFilePath = path.join(srcPath, file.name);
    const destFilePath = path.join(destPath, file.name);

    if (file.isFile()) {
      await fs.copyFile(srcFilePath, destFilePath);
    } else if (file.isDirectory()) {
      await copyDirectory(srcFilePath, destFilePath);
    }
  }));
}

// Создаем директорию проекта
fs.mkdir(path.join(distPath), { recursive: true })
  .then(() => {
    return Promise.all([
      updateIndex(),
      updateStyle(),
      updateAssets()
    ]);
  })
  .then(() => {
    console.log('Project built successfully!');
  })
  .catch((err) => {
    console.error('Failed to build project', err);
  });
