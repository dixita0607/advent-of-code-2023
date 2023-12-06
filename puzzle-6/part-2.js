const fs = require("fs").promises;
const path = require("path");

const readFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName);
    return data.toString();
  } catch (e) {
    console.error(`Got an error trying to read file: ${e.message}`);
  }
};

function* getPossibleDistances(duration) {
  for (let speed = 1; speed <= duration; speed++) {
    yield speed * (duration - speed);
  }
}

const main = async () => {
  const fileContents = (
    await readFile(path.join(__dirname, "./input.txt"))
  ).split("\n");

  const time = Number(
    fileContents[0].split("Time:")[1].trim().split(" ").join("")
  );
  const distance = Number(
    fileContents[1].split("Distance:")[1].trim().split(" ").join("")
  );

  let betterRaces = 0;
  for (let d of getPossibleDistances(time)) {
    if (d > distance) {
      betterRaces = betterRaces + 1;
    }
  }

  console.log("The answer is:", betterRaces);
};

main();
