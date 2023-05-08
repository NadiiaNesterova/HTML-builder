const readline = require('readline');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const filename = './02-write-file/text.txt';
const fileStream = fs.createWriteStream(filename, { flags: 'a' });

fs.access(filename, (err) => {
  if (err) {
    fileStream.end();
    console.log(`File ${filename} created`);
  }
});

console.log('Hello! Write something... (type "exit" to exit):');

rl.on('line', (input) => {
  if (input === 'exit') {
    console.log('Goodbye!');
    fileStream.end();
    process.exit(0);
  } else {
    console.log(`You entered: ${input}`);
    fs.appendFile(filename, input + '\n', (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
});

rl.on('SIGINT', () => {
  console.log('\rGoodbye!');
  fileStream.end();
  process.exit(0);
});
