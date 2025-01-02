import run from "aocrunner";

type Wire = { name: string, dependencies: string[], operation: "AND" | "OR" | "XOR" }

const parseInput = (rawInput: string) => {
  const chonks = rawInput.split("\n\n");

  const values: Record<string, bigint> = {};
  chonks[0].split("\n").forEach((line) => {
    const parts = line.split(": ");
    values[parts[0]] = BigInt(parts[1]);
  });

  const wireMap: Record<string, Wire> = {};
  const wires: Wire[] = chonks[1].split("\n").filter(line => line.trim()).map((line) => {
    const parts = line.match(/([a-z\d]+) (AND|OR|XOR) ([a-z\d]+) -> ([a-z\d]+)/)!!;
    const wire = { name: parts[4], dependencies: [parts[1], parts[3]], operation: parts[2] as "AND" | "OR" | "XOR" };
    wireMap[wire.name] = wire;
    return wire;
  });

  return { values, wires, wireMap };
}

function runSimulation(wires: Wire[], values: Record<string, bigint>) {
  while (wires.length > 0) {
    for (let i = 0; i < wires.length; i++) {
      const wire = wires[i];
      const dependency1 = values[wire.dependencies[0]];
      const dependency2 = values[wire.dependencies[1]];
      if (dependency1 !== undefined && dependency2 !== undefined) {
        wires.splice(i, 1);

        if (wire.operation === "AND") {
          values[wire.name] = dependency1 & dependency2;
        } else if (wire.operation === "OR") {
          values[wire.name] = dependency1 | dependency2;
        } else {
          values[wire.name] = dependency1 ^ dependency2;
        }
      }
    }
  }
}

function generateNumberFromBits(values: [string, bigint][]) {
  values.sort((a, b) => b[0].localeCompare(a[0]));

  return values.reduce((acc, v) => {
    acc = acc << 1n;
    return acc | v[1];
  }, 0n);
}

const part1 = (rawInput: string) => {
  const { values, wires } = parseInput(rawInput);

  runSimulation([...wires], values);

  const zValues = Object.entries(values).filter((v) => v[0].startsWith("z"));
  return generateNumberFromBits(zValues).toString();
};

const checkFullAdderForBit = (bitNum: number, expectedZ: bigint, carryWire: Wire, wires: Wire[], values: Record<string, bigint>) => {
  const xName = `x${bitNum.toString().padStart(2, "0")}`;
  const yName = `y${bitNum.toString().padStart(2, "0")}`;
  const zName = `z${bitNum.toString().padStart(2, "0")}`;

  console.log(`**************************`);
  const firstXors = wires.filter(w => w.dependencies.includes(xName) && w.dependencies.includes(yName) && w.operation === "XOR");
  if (firstXors.length !== 1) {
    console.log(`First XOR for bit ${bitNum} is fucky, looking for dependencies ${xName} and ${yName}`);
  }
  const firstXor = firstXors[0];

  const firstAnds = wires.filter(w => w.dependencies.includes(xName) && w.dependencies.includes(yName) && w.operation === "AND");
  if (firstAnds.length !== 1) {
    console.log(`First AND for bit ${bitNum} is fucky, looking for dependencies ${xName} and ${yName}`);

  }
  const firstAnd = firstAnds[0];

  console.log(firstXor)
  console.log(firstAnd);

  const secondXors = wires.filter(w => w.dependencies.includes(firstXor.name) && w.dependencies.includes(carryWire.name) && w.operation === "XOR");
  if (secondXors.length !== 1) {
    console.log(`Second XOR for bit ${bitNum} is fucky, looking for dependencies ${firstXor.name} and ${carryWire.name}`);
  }
  const secondXor = secondXors[0];
  if (secondXor.name !== zName) {
    console.log(`Second XOR does not point to Z for bit ${bitNum}, instead points to ${secondXor.name}!`);
  }
  if (values[secondXor.name] !== expectedZ) {
    console.log(`Value of second XOR for bit ${bitNum} does not match expected, ${expectedZ}!`);
  }

  const secondAnds = wires.filter(w => w.dependencies.includes(firstXor.name) && w.dependencies.includes(carryWire.name) && w.operation === "AND");
  if (secondAnds.length !== 1) {
    console.log(`Second AND for bit ${bitNum} is fucky!`);
  }
  const secondAnd = secondAnds[0];

  console.log(secondXor)
  console.log(secondAnd)

  const ors = wires.filter(w => w.dependencies.includes(firstAnd.name) && w.dependencies.includes(secondAnd.name) && w.operation === "OR");
  if (ors.length !== 1) {
    console.log(`OR for bit ${bitNum} is fucky, looking for dependencies ${firstAnd.name} and ${secondAnd.name}`);
  }
  const or = ors[0];
  if (or.name.startsWith("z")) {
    console.log(`OR for bit ${bitNum} points to ${or.name}, not an AND!`);
  }
  // console.log(or)
  return or;
}

const part2 = (rawInput: string) => {
  const { values, wires, wireMap } = parseInput(rawInput);

  runSimulation([...wires], values);

  const xValues = Object.entries(values).filter(v => v[0].startsWith("x"));
  const x = generateNumberFromBits(xValues);
  const yValues = Object.entries(values).filter(v => v[0].startsWith("y"));
  const y = generateNumberFromBits(yValues);
  const zValues = Object.entries(values).filter(v => v[0].startsWith("z"));
  const actualZ = generateNumberFromBits(zValues);
  const expectedZ = x + y;
  console.log(`x: ${x} y: ${y} expected z: ${expectedZ} actual z: ${actualZ} delta: ${actualZ - expectedZ}`);
  const zBits = expectedZ.toString(2).split("").map((n) => BigInt(parseInt(n, 10))).reverse();

  // console.log(wires.filter(w => w.dependencies.includes("x23") && w.dependencies.includes("y23")));

  let carryWire = wires.find(w => w.name === "spq")!!;
  for (let bit = 1; bit < zBits.length - 1; bit++) {
    carryWire = checkFullAdderForBit(bit, zBits[bit], carryWire, wires, values);
    console.log("cw", carryWire);
  }

  const handInvestigatedWires = [ "vdc", "z12", "nhn", "z21", "khg", "tvb", "z33", "gst" ];
  handInvestigatedWires.sort((a, b) => a.localeCompare(b));
  return handInvestigatedWires.join(",");
};

run({
  part1: {
    tests: [
      {
        input: `
x00: 1
x01: 1
x02: 1
y00: 0
y01: 1
y02: 0

x00 AND y00 -> z00
x01 XOR y01 -> z01
x02 OR y02 -> z02`,
        expected: "4",
      },
      {
        input: `
x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`,
        expected: "2024",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
