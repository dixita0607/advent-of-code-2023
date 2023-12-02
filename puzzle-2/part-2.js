const fs = require("fs");
const path = require("path");
const readline = require("readline");

const prepareGameInformation = (game) => {
  const sets = game.split(": ")[1].split("; ");
  return sets.reduce(
    (rgbs, set) => {
      const cubes = set.split(", ");
      cubes.forEach((cube) => {
        const [number, color] = cube.split(" ");
        switch (color) {
          case "red":
            rgbs.red = Math.max(rgbs.red, number);
            break;
          case "green":
            rgbs.green = Math.max(rgbs.green, number);
            break;
          case "blue":
            rgbs.blue = Math.max(rgbs.blue, number);
            break;
          default:
            console.error("Invalid color", color);
            break;
        }
      });
      return rgbs;
    },
    { red: 1, green: 1, blue: 1 }
  );
};

const main = () => {
  const readableStream = fs.createReadStream(
    path.join(__dirname, "./input.txt")
  );
  const rl = readline.createInterface({ input: readableStream });

  let totalOfPowers = 0;

  rl.on("line", (game) => {
    const { red, green, blue } = prepareGameInformation(game);
    totalOfPowers = totalOfPowers + red * green * blue;
  });

  rl.on("close", () => {
    console.log("The answer is:", totalOfPowers);
  });
};

main();
