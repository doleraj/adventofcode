import run from "aocrunner";
import { Queue } from "../utils/data-structures.js";

const parseInput = (rawInput: string) => rawInput;

enum Type {
  DIR,
  FILE
}

enum State {
  NORMAL,
  LS
}

class File {
  children: File[];
  name: string;
  parent?: File;
  size: number;
  type: Type;

  constructor(name: string, type: Type, parent?: File, size: number = 0) {
    this.name = name;
    this.size = size;
    this.type = type;
    this.parent = parent;
    this.children = [];
  }

  getSize(): number {
    if (this.type === Type.FILE) {
      return this.size;
    } else {
      if (this.size > 0) {
        return this.size;
      }

      const size = this.children.reduce((accum, child) => {
        return accum + child.getSize();
      }, 0);
      this.size = size;
      return size;
    }
  }
}

const printFile = (file: File, depth: number) => {
  const indent = new Array(depth).fill(" ").join("");
  if (file.type === Type.DIR) {
    console.log(`${indent}- ${file.name} (dir, size=${file.getSize()})`);
    file.children.forEach(child => {
      printFile(child, depth + 1);
    })
  } else {
    console.log(`${indent}- ${file.name} (file, size=${file.getSize()})`);
  }
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = new Queue(input.split("\n"));
  let state = State.NORMAL;

  const root = new File("/", Type.DIR);
  const dirs = [root];
  let currentFile: File = root;

  let lineIndex = 0;
  while (lines.hasNext()) {
    const line = lines.next()
    // console.log(line);

    if (state === State.LS && line.startsWith("$")) {
      state = State.NORMAL;
    }

    if (state === State.NORMAL) {
      if (line.startsWith("$ cd")) {
        if (line.includes("/")) {
          currentFile = root;
        } else if (line.includes("..") && currentFile.parent) {
          currentFile = currentFile.parent;
        } else {
          const dirName = line.substring(4).trim();
          const nextFile = currentFile.children.find(file => file.name == dirName);
          if (!nextFile) {
            throw new Error(`Couldn't find directory ${dirName} in ${currentFile.name}!`);
          }
          currentFile = nextFile;
        }
        lineIndex++;
      } else if (line.startsWith("$ ls")) {
        state = State.LS;
      }
    } else if (state === State.LS) {
      if (line.startsWith("dir")) {
        const name = line.substring(4);
        const dir = new File(name, Type.DIR, currentFile);
        dirs.push(dir);
        currentFile.children.push(dir);
      } else {
        const match = line.match(/(\d+) (\w+(?:\.[a-z]{3})?)/);
        if (!match) {
          throw new Error(`Regex parsing is bad!`);
        }
        const name = match[2];
        const size = Number(match[1]);
        currentFile.children.push(new File(name, Type.FILE, currentFile, size));
      }
    }
  }

  // printFile(root, 0);
  return dirs.filter(dir => dir.getSize() <= 100000).reduce((accum, dir) => accum + dir.getSize(), 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const lines = new Queue(input.split("\n"));
  let state = State.NORMAL;

  const root = new File("/", Type.DIR);
  const dirs = [root];
  let currentFile: File = root;

  let lineIndex = 0;
  while (lines.hasNext()) {
    const line = lines.next()
    // console.log(line);

    if (state === State.LS && line.startsWith("$")) {
      state = State.NORMAL;
    }

    if (state === State.NORMAL) {
      if (line.startsWith("$ cd")) {
        if (line.includes("/")) {
          currentFile = root;
        } else if (line.includes("..") && currentFile.parent) {
          currentFile = currentFile.parent;
        } else {
          const dirName = line.substring(4).trim();
          const nextFile = currentFile.children.find(file => file.name == dirName);
          if (!nextFile) {
            throw new Error(`Couldn't find directory ${dirName} in ${currentFile.name}!`);
          }
          currentFile = nextFile;
        }
        lineIndex++;
      } else if (line.startsWith("$ ls")) {
        state = State.LS;
      }
    } else if (state === State.LS) {
      if (line.startsWith("dir")) {
        const name = line.substring(4);
        const dir = new File(name, Type.DIR, currentFile);
        dirs.push(dir);
        currentFile.children.push(dir);
      } else {
        const match = line.match(/(\d+) (\w+(?:\.[a-z]{3})?)/);
        if (!match) {
          throw new Error(`Regex parsing is bad!`);
        }
        const name = match[2];
        const size = Number(match[1]);
        currentFile.children.push(new File(name, Type.FILE, currentFile, size));
      }
    }
  }

  const currentUnused = 70000000 - root.getSize();
  const spaceToDelete = 30000000 - currentUnused;
  const smallestSufficientDir = dirs.filter(dir => dir.getSize() >= spaceToDelete).sort((a, b) => a.getSize() - b.getSize())[0];
  return smallestSufficientDir.getSize();
};

run({
  part1: {
    tests: [
      {
        input: `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k
`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
