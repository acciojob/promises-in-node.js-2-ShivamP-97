const fs = require('fs');
const path = require('path');

// Function to read a file asynchronously using promises
function readFileAsync(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err); // propagate file not found (ENOENT) errors
        return;
      }
      resolve(data);
    });
  });
}

// Function to calculate sum of a specified column
function sumColumn(filePath, columnName) {
  return readFileAsync(filePath)
    .then((data) => {
      if (!data) {
        throw new Error('CSV file is empty.');
      }

      const lines = data.trim().split('\n');
      const headers = lines[0].split(',');

      const colIndex = headers.indexOf(columnName);
      if (colIndex === -1) {
        throw new Error(`Column '${columnName}' not found in the CSV.`);
      }

      // Sum the values in the column
      let sum = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        sum += Number(cols[colIndex]);
      }

      return sum;
    });
}

// Command-line arguments: node main.js <csvFile> <columnName>
const filePath = process.argv[2];
const columnName = process.argv[3];

if (!filePath || !columnName) {
  console.error('Please provide both CSV file path and column name.');
  process.exit(1);
}

// Call sumColumn and log result
sumColumn(filePath, columnName)
  .then((sum) => {
    console.log(`The Sum of ${columnName} is ${sum}`);
  })
  .catch((err) => {
    if (err.code === 'ENOENT') {
      console.error(`ENOENT: no such file or directory, open '${filePath}'`);
    } else {
      console.error(err.message);
    }
  });
