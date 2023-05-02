const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  text: process.stdout
});

const filename = './02-write-file/text.txt';
const fileStream = fs.createWriteStream(filename, { flags: 'a' });

if (!fs.existsSync(filename)) {
  fs.writeFileSync(filename, '');
  console.log(`File ${filename} created`);
}

console.log('Hello! Write something... (type "exit" to exit):');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    process.exit(0);
  } else {
    console.log(`You entered: ${input}`);
    fileStream.write(input + '\n');
  }
});

process.on('SIGINT', () => {
  console.log('\rGoodbye!');
  fileStream.end();
  process.exit(0);
});
