const fs = require("fs").promises;
const path = require("path");

const readFile = async (path) => {
  try {
    const data = await fs.readFile(path);
    return data.toString();
  } catch (e) {
    throw new Error("Could not read file");
  }
};

const parse = (lines) => {
  const directions = lines[0].split("");
  const lookups = lines.slice(1).reduce((obj, lookup) => {
    const [key, tuple] = lookup.split("=");
    const [left, right] = tuple.trim().split(",");
    obj[key.trim()] = {
      L: left.trim().slice(1),
      R: right.trim().slice(0, 3),
    };
    return obj;
  }, Object.create(null));
  return { directions, lookups };
};

const main = async () => {
  const fileContents = (await readFile(path.join(__dirname, "./input.txt")))
    .split("\n")
    .filter((line) => !!line);

  const { directions, lookups } = parse(fileContents);

  let currentStep = "AAA";
  let totalSteps = 0;
  let index = 0;

  while (currentStep !== "ZZZ" || totalSteps === 0) {
    currentStep = lookups[currentStep][directions[index]];
    totalSteps = totalSteps + 1;
    index = index + 1;
    if (index === directions.length) {
      index = 0;
    }
  }

  console.log("The answer is:", totalSteps);
};

main();
