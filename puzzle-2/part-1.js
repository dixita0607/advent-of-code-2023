const fs = require("fs");
const path = require("path");
const readline = require("readline");

const totalCubes = {
  red: 12,
  green: 13,
  blue: 14,
};

const getCubesFromSet = (set) =>
  set.split(", ").reduce(
    (cubes, s) => {
      const [number, color] = s.split(" ");
      switch (color) {
        case "red":
          cubes.red = cubes.red + Number(number);
          break;
        case "green":
          cubes.green = cubes.green + Number(number);
          break;
        case "blue":
          cubes.blue = cubes.blue + Number(number);
          break;
        default:
          break;
      }
      return cubes;
    },
    { red: 0, green: 0, blue: 0 }
  );

const prepareGameInformation = (game) => {
  const [gameInfo, sets] = game.split(": ");
  return {
    id: Number(gameInfo.split(" ")[1]),
    sets: sets.split("; ").map(getCubesFromSet),
  };
};

const main = () => {
  const readableStream = fs.createReadStream(
    path.join(__dirname, "./input.txt")
  );
  const rl = readline.createInterface({ input: readableStream });

  let totalOfIds = 0;

  rl.on("line", (game) => {
    const { id, sets } = prepareGameInformation(game);

    const totalValidSetsInGame = sets.reduce((validSets, set) => {
      if (
        set.red <= totalCubes.red &&
        set.green <= totalCubes.green &&
        set.blue <= totalCubes.blue
      ) {
        return validSets + 1;
      }
      return validSets;
    }, 0);

    if (totalValidSetsInGame === sets.length) {
      totalOfIds = totalOfIds + id;
    }
  });

  rl.on("close", () => {
    console.log("The answer is:", totalOfIds);
  });
};

main();
