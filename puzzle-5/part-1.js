const fs = require("fs");
const path = require("path");
const readline = require("readline");

const getRangeEnd = (start, length) => start + (length - 1);

const getDestinationNumber = (sourceNumber, mapping) => {
  const { sourceStart, destinationStart, rangeLength } = mapping;
  const sourceEnd = getRangeEnd(sourceStart, rangeLength);
  const destinationEnd = getRangeEnd(destinationStart, rangeLength);
  if (sourceNumber === sourceStart) return destinationStart;
  if (sourceNumber === sourceEnd) return destinationEnd;
  if (sourceNumber < sourceStart) return undefined;
  if (sourceNumber > sourceEnd) return undefined;
  if (sourceNumber > sourceStart && sourceNumber < sourceEnd)
    return destinationEnd - (sourceEnd - sourceNumber);
  else return undefined;
};

const getNextInput = (sourceNumber, mappings) => {
  let destinationNumber;
  for (let i = 0; i < mappings.length; i++) {
    destinationNumber = getDestinationNumber(sourceNumber, mappings[i]);
    if (!!destinationNumber) break;
  }
  return destinationNumber || sourceNumber;
};

const main = () => {
  let seeds = [];
  let currentMappings;
  let nextInputFromMappings;

  const readableStream = fs.createReadStream(
    path.join(__dirname, "./input.txt")
  );
  const rl = readline.createInterface({ input: readableStream });

  rl.on("line", (line) => {
    // Get seeds
    if (line.includes("seeds:")) {
      seeds = line
        .split("seeds:")[1]
        .trim()
        .split(" ")
        .map((seed) => Number(seed.trim()));
      nextInputFromMappings = seeds;
    }

    // Get mappings
    if (!line.includes("seeds:") && !line.includes("map:") && line !== "") {
      const [destinationStart, sourceStart, rangeLength] = line.split(" ");
      if (!currentMappings) currentMappings = [];
      currentMappings.push({
        destinationStart: Number(destinationStart),
        sourceStart: Number(sourceStart),
        rangeLength: Number(rangeLength),
      });
    }

    // Calculate next input if everything is available
    if (
      nextInputFromMappings.length > 0 &&
      !!currentMappings &&
      line.includes("map:")
    ) {
      nextInputFromMappings = nextInputFromMappings.map((source) =>
        getNextInput(source, currentMappings)
      );
      currentMappings = null;
    }
  });

  rl.on("close", () => {
    const locationsMapping = nextInputFromMappings.map((source) =>
      getNextInput(source, currentMappings)
    );
    console.log("The answer is:", Math.min(...locationsMapping));
  });
};

main();
