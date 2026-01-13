const fs = require('fs');

function readFile(filePath) {
  return new Promise((resolve, reject) => {
    if (!filePath) {
      reject(new Error("File path is required."));
      return;
    }

    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err); 
      } else {
        resolve(data);
      }
    });
  });
}

function sumColumn(filePath, columnName) {
  return readFile(filePath)
    .then((data) => {
      if (!data || !data.trim()) {
        throw "CSV file is empty.";
      }

      const rows = data.trim().split("\n");
      if (rows.length < 2) {
        throw "CSV file is empty.";
      }

      const headers = rows[0].split(",");
      const colIndex = headers.indexOf(columnName);

      if (colIndex === -1) {
        throw `Column '${columnName}' not found in the CSV.`;
      }

      let sum = 0;
      for (let i = 1; i < rows.length; i++) {
        const cols = rows[i].split(",");
        sum += parseFloat(cols[colIndex]);
      }

      return sum;
    });
}

const filePath = process.argv[2];
const columnName = process.argv[3];

sumColumn(filePath, columnName)
  .then((sum) => {
    console.log(`The Sum of ${columnName} is ${sum}`);
  })
  .catch((err) => {
    if (typeof err === "string") {
      console.log(err); 
    } else {
      console.log(err.message); 
    }
  });
