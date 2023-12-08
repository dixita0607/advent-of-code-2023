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

const getStepsStartingWithA = (lookups) =>
  Object.keys(lookups).filter((key) => key.endsWith("A"));

const getNumberOfSteps = (start, directions, lookups) => {
  let currentStep = start;
  let totalSteps = 0;
  let index = 0;
  while (!currentStep.endsWith("Z")) {
    currentStep = lookups[currentStep][directions[index]];
    totalSteps = totalSteps + 1;
    index = index + 1;
    if (index === directions.length) {
      index = 0;
    }
  }
  return totalSteps;
};

const isPrime = (number) => {
  if (number <= 1) return false;
  if (number === 2) return true;
  for (let i = 3; i < number; i++) {
    if (number % i === 0) return false;
  }
  return true;
};

const getDistinctPrimeFactors = (number) => {
  const factors = {};
  for (let i = 2; i < number; i++) {
    if (number % i === 0 && isPrime(i)) {
      if (!factors[i]) factors[i] = 1;
      else factors[i] = factors[i] + 1;
    }
  }
  return factors;
};

const lcm = (numbers) => {
  const multiPlierNumbers = {};
  for (number of numbers) {
    const distinctFactors = getDistinctPrimeFactors(number);
    for (key of Object.keys(distinctFactors)) {
      if (!multiPlierNumbers[key]) {
        multiPlierNumbers[key] = distinctFactors[key];
      } else {
        if (distinctFactors[key] > multiPlierNumbers[key]) {
          multiPlierNumbers[key] = distinctFactors[key];
        }
      }
    }
  }
  return Object.keys(multiPlierNumbers).reduce(
    (mul, key) => mul * Math.pow(Number(key), multiPlierNumbers[key]),
    1
  );
};

const main = async () => {
  const fileContents = (await readFile(path.join(__dirname, "./input.txt")))
    .split("\n")
    .filter((line) => !!line);

  const { directions, lookups } = parse(fileContents);

  const totalStepsByPath = getStepsStartingWithA(lookups).map((step) =>
    getNumberOfSteps(step, directions, lookups)
  );

  console.log("The answer is:", lcm(totalStepsByPath));
};

main();
