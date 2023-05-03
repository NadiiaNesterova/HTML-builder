const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const stylesPath = path.join(__dirname, 'styles');
const outputFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

async function mergeStyles() {
  try {
    const files = await readdir(stylesPath);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const cssContents = await Promise.all(
      cssFiles.map((file) => readFile(path.join(stylesPath, file), 'utf8'))
    );
    const output = cssContents.join('\n');
    await writeFile(outputFilePath, output);
    console.log('Styles merged successfully');
  } catch (err) {
    console.error('Error while merging styles', err);
  }
}

mergeStyles();
