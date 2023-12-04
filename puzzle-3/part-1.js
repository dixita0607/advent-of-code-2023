const fs = require("fs").promises;
const path = require("path");

const isSymbol = (c) => {
  const re = /[^\d\.]/;
  return !!c && re.test(c);
};

const readFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName);
    return data.toString();
  } catch (e) {
    console.error(`Got an error trying to read file: ${e.message}`);
  }
};

const main = async () => {
  const fileContents = await readFile(path.join(__dirname, "./input.txt"));
  const allLines = fileContents.split("\n");
  const totalOfParts = allLines.reduce((total, line, lineIndex) => {
    const numbersRe = /[0-9]+/g;
    const matches = line.matchAll(numbersRe);
    for (const match of matches) {
      for (i = match.index; i <= match.index + match[0].length - 1; i++) {
        const currentLine = allLines[lineIndex];
        const previousLine = allLines[lineIndex - 1];
        const nextLine = allLines[lineIndex + 1];
        if (
          isSymbol(currentLine?.[i - 1]) ||
          isSymbol(currentLine?.[i + 1]) ||
          isSymbol(previousLine?.[i]) ||
          isSymbol(nextLine?.[i]) ||
          isSymbol(previousLine?.[i - 1]) ||
          isSymbol(nextLine?.[i - 1]) ||
          isSymbol(previousLine?.[i + 1]) ||
          isSymbol(nextLine?.[i + 1])
        ) {
          total = total + Number(match[0]);
          break;
        }
      }
    }
    return total;
  }, 0);

  console.log("Answer is: ", totalOfParts);
};

main();
