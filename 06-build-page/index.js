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
    const destPath = pagesPath;
    await copyDirectory(assetsPath, destPath);

    console.log('Updated assets');
  } catch (err) {
    console.error('Failed to update assets', err);
  }
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

async function buildProject() {
  try {
    // Удаляем папку и её содержимое
    await fs.rm(distPath, { recursive: true, force: true });

    // Создаем директорию проекта
    await fs.mkdir(path.join(distPath), { recursive: true });

    // Обновляем индекс, стили и ассеты
    await Promise.all([
      updateIndex(),
      updateStyle(),
      updateAssets()
    ]);

    console.log('Project built successfully!');
  } catch (err) {
    console.error('Failed to build project', err);
  }
}

buildProject();

