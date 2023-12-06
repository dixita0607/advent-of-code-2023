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

  const bestRaces = [];

  fileContents[0]
    .split("Time:")[1]
    .trim()
    .split(" ")
    .forEach((time) => {
      if (!!time) bestRaces.push({ time: Number(time.trim()) });
    });
  fileContents[1]
    .split("Distance:")[1]
    .trim()
    .split(" ")
    .filter((distances) => !!distances)
    .forEach((distance, index) => {
      if (!!distance) bestRaces[index].distance = Number(distance.trim());
    });

  const answer = bestRaces.reduce((multiplied, race) => {
    let betterRaces = 0;
    for (let d of getPossibleDistances(race.time)) {
      if (d > race.distance) {
        betterRaces = betterRaces + 1;
      }
    }
    return multiplied * betterRaces;
  }, 1);

  console.log("The answer is:", answer);
};

main();
