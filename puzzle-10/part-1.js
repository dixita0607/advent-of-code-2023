const fs = require("fs").promises;
const path = require("path");

const readFile = async (fileName) => {
  try {
    const data = await fs.readFile(fileName);
    return data.toString();
  } catch (e) {
    throw new Error("Could not read file");
  }
};

const pipes = Object.assign(
  {
    START: "S",
    END: ".",
  },
  Object.create(null)
);

const dir = Object.assign(
  {
    N: "N",
    E: "E",
    W: "W",
    S: "S",
  },
  Object.create(null)
);

const oppositeDir = Object.assign(
  {
    N: "S",
    E: "W",
    W: "E",
    S: "N",
  },
  Object.create(null)
);

const allowedDirForPipe = Object.assign(
  {
    "|": [dir.N, dir.S],
    "-": [dir.E, dir.W],
    L: [dir.N, dir.E],
    J: [dir.W, dir.N],
    7: [dir.W, dir.S],
    F: [dir.S, dir.E],
  },
  Object.create(null)
);

const isValidPosition = (pos, area) => {
  const areaBounds = [area.length, area[0].length];
  if (!Array.isArray(pos)) return false;
  const [i, j] = pos;
  const [lines, pipesPerLine] = areaBounds;
  if (typeof i !== "number" || i < 0 || i > lines) return false;
  if (typeof j !== "number" || j < 0 || j > pipesPerLine) return false;
  if (area[i][j] === pipes.START || area[i][j] === pipes.END) return false;
  return true;
};

const getStartingPoint = (lines) => {
  for (const lineIndex in lines) {
    const line = lines[lineIndex];
    for (const pipeIndex in line) {
      if (lines[lineIndex][pipeIndex] === pipes.START)
        return [Number(lineIndex), Number(pipeIndex)];
    }
  }
};

const getStartingDirection = (point, area) => {
  const directions = [];
  const [i, j] = point;
  // Simplify this by checking pipe only
  if (
    isValidPosition([i, j - 1], area) &&
    allowedDirForPipe[area[i][j - 1]].includes(dir.E)
  )
    directions.push(dir.W);
  if (
    isValidPosition([i - 1, j], area) &&
    allowedDirForPipe[area[i - 1][j]].includes(dir.S)
  )
    directions.push(dir.N);
  if (
    isValidPosition([i, j + 1], area) &&
    allowedDirForPipe[area[i][j + 1]].includes(dir.W)
  )
    directions.push(dir.E);
  if (
    isValidPosition([i + 1, j], area) &&
    allowedDirForPipe[area[i + 1][j]].includes(dir.N)
  )
    directions.push(dir.S);
  return directions;
};

const getNextPos = (currentPos, direction) => {
  const [i, j] = currentPos;
  switch (direction) {
    case dir.N:
      return [i - 1, j];
    case dir.E:
      return [i, j + 1];
    case dir.S:
      return [i + 1, j];
    case dir.W:
      return [i, j - 1];
    default:
      throw new Error("Invalid direction");
  }
};

const getNextDirection = (fromDir, pipe) => {
  switch (pipe) {
    case "|": {
      return fromDir === dir.N ? dir.S : dir.N;
    }
    case "-": {
      return fromDir === dir.W ? dir.E : dir.W;
    }
    case "L":
      return fromDir === dir.N ? dir.E : dir.N;
    case "J":
      return fromDir === dir.N ? dir.W : dir.N;
    case "7":
      return fromDir === dir.W ? dir.S : dir.W;
    case "F":
      return fromDir === dir.S ? dir.E : dir.S;
    case "S":
      return "STOP";
    default:
      throw new Error("Invalid pipe");
  }
};

const getPathDistance = (startPos, startDir, area) => {
  let distance = 0;
  let pos = [...startPos];
  let dir = startDir;
  let pipe = area[pos[0]][pos[1]];
  while ((Array.isArray(pos) && pipe !== pipes.START) || distance === 0) {
    pos = getNextPos(pos, dir);
    pipe = area[pos[0]][pos[1]];
    dir = getNextDirection(oppositeDir[dir], pipe);
    distance++;
  }
  return distance / 2;
};

const main = async () => {
  const area = (await readFile(path.join(__dirname, "./input.txt")))
    .split("\n")
    .filter((line) => !!line)
    .map((line) => line.split(""));

  const startingPoint = getStartingPoint(area);
  const startingDirections = getStartingDirection(startingPoint, area);

  console.log(
    "The answer is:",
    Math.max(
      ...startingDirections.map((direction) =>
        getPathDistance(startingPoint, direction, area)
      )
    )
  );
};

main();
