const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.txt');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error("Error:", err);
    return;
  }
  console.log("File content:", data);
});

console.log("File read request sent");
