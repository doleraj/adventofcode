import run from "aocrunner";
import "../utils/index.js";
import {lcmArray} from "../utils/index.js";

type TempModule = { name: string, type: "B" | "FF" | "C"; destinations: string[] };
type Module = { name: string; type: "B" | "FF" | "C" | "?"; destinations: Module[]; memory: Record<string, string> };
type Pulse = { type: "L" | "H", sender: Module, destination: Module };
type Counts = { low: number, high: number };

const parseInput = (rawInput: string): { broadcaster: Module, modules: Record<string, Module>} => {
  let tempBroadcaster: TempModule;
  const tempModules: TempModule[] = [];
  const modules: Record<string, Module> = {};

  // First pass to parse.
  for (const line of rawInput.split("\n")) {
    const matches = line.match(/(?:(broadcaster)|([%&]\w+)) -> ([\w, ]+)/)!!;
    const destinations = matches[3].split(", ");
    if (matches[1]) {
      tempBroadcaster = { name: "broadcaster", type: "B", destinations };
    } else {
      const type = matches[2][0] === "%" ? "FF" : "C";
      const name = matches[2].slice(1);
      tempModules.push({ name, type, destinations });
      modules[name] = { name, type, destinations: [], memory: {} };
      if (type === "FF") {
        modules[name].memory["state"] = "Off";
      }
    }
  }

  // Fill in the actual destinations.
  while (tempModules.length > 0) {
    const tempModule = tempModules.pop()!!;
    const module = modules[tempModule.name];
    for (const dest of tempModule.destinations) {
      let destModule = modules[dest];
      if (!destModule) {
        // Make up a fake module
        destModule = { name: dest, type: "?", destinations: [], memory: {} };
        modules[dest] = destModule;
      }

      module.destinations.push(destModule);
      if (destModule.type === "C") {
        destModule.memory[module.name] = "L";
      }
    }
  }
  const broadcaster: Module = { name: tempBroadcaster!!.name, type: "B", destinations: [], memory: {} };
  for (const dest of tempBroadcaster!!.destinations) {
    broadcaster.destinations.push(modules[dest]);
  }

  return { broadcaster, modules };
}

const sendPulse = (type: "H" | "L", src: Module, pulsesToSend: Pulse[], counts: Counts) => {
  for (const nextDest of src.destinations) {
    if (type === "L") {
      counts.low++
    } else {
      counts.high++;
    }

    // console.log(`${src.name} -${type === "H" ? "high" : "low"} -> ${nextDest.name}`);
    // console.log(`Counts now: ${JSON.stringify(counts)} `)
    pulsesToSend.push({ sender: src, type: type, destination: nextDest });
  }
}

const part1 = (rawInput: string) => {
  const { broadcaster, modules } = parseInput(rawInput);
  const counts = { low: 0, high: 0 };

  // console.log(modules);

  let presses = 0;
  while (presses++ < 1000) {
    const pulsesToSend: Pulse[] = [{sender: broadcaster, type: "L", destination: broadcaster}];
    // console.log("button -low-> broadcaster");
    counts.low++; // One initial low from the button
    while (pulsesToSend.length > 0) {
      const pulse = pulsesToSend.splice(0, 1)[0];
      const receiver = pulse.destination;

      if (receiver.type === "B") {

        sendPulse("L", receiver, pulsesToSend, counts);
      } else if (receiver.type === "FF") {

        if (pulse.type === "L") {
          // console.log(receiver.memory);
          if (receiver.memory["state"] === "On") {
            receiver.memory["state"] = "Off";
            sendPulse("L", receiver, pulsesToSend, counts);
          } else if (receiver.memory["state"] === "Off") {
            receiver.memory["state"] = "On";
            sendPulse("H", receiver, pulsesToSend, counts);
          }
        }
      } else if (receiver.type === "C") {

        receiver.memory[pulse.sender.name] = pulse.type;
        const typeIfAllSame = Object.values(receiver.memory).groupBy(x => x);
        // console.log(receiver.memory);
        if (typeIfAllSame["H"] && typeIfAllSame["H"].length === Object.keys(receiver.memory).length) {
          sendPulse("L", receiver, pulsesToSend, counts);
        } else {
          sendPulse("H", receiver, pulsesToSend, counts);
        }
      }

      // console.log(pulsesToSend.length);
    }
  }

  return counts.low * counts.high;
};

const sendPart2Pulse = (type: "H" | "L", src: Module, pulsesToSend: Pulse[], nodesWeCareAboutGoingHigh: Record<string, number>, presses: number): boolean => {
  let rxGotLow = false;
  for (const nextDest of src.destinations) {
    if (nodesWeCareAboutGoingHigh[nextDest.name] !== undefined) {
      if (nodesWeCareAboutGoingHigh[nextDest.name] === 0 && type === "L") {
        nodesWeCareAboutGoingHigh[nextDest.name] = presses;
      }
    }

    // console.log(`${src.name} -${type === "H" ? "high" : "low"} -> ${nextDest.name}`);
    // console.log(`Counts now: ${JSON.stringify(counts)} `)
    pulsesToSend.push({ sender: src, type: type, destination: nextDest });
  }
  return rxGotLow;
}

const part2 = (rawInput: string) => {
  const { broadcaster, modules } = parseInput(rawInput);
  const counts = { low: 0, high: 0 };

  // Filtering the list doesn't seem to matter.
 //  const rxModule = modules["rx"];
 //  const modulesThatMatter: Record<string, Module> = {};
 //  const modulesLeftToCheck = [rxModule];
 //  while (modulesLeftToCheck.length > 0) {
 //    const module = modulesLeftToCheck.pop()!!;
 //
 //    modulesThatMatter[module.name] = module;
 //    const newModules = Object.values(modules).filter(m => m.destinations.findIndex(d => d.name === module.name) !== -1);
 //    modulesLeftToCheck.push(...newModules.filter(m => !modulesThatMatter[m.name]));
 //  }
 //  console.log(Object.values(modules).length);
 //  console.log(Object.values(modulesThatMatter).length);
 // return -1;

  let presses = 0;
  const nodesWeCareAboutGoingHigh = { kd: 0, zf: 0, vg: 0, gs: 0 };
  while (Object.values(nodesWeCareAboutGoingHigh).includes(0)) {
    presses++;
    const pulsesToSend: Pulse[] = [{sender: broadcaster, type: "L", destination: broadcaster}];
    // console.log("button -low-> broadcaster");
    counts.low++; // One initial low from the button
    while (pulsesToSend.length > 0) {
      const pulse = pulsesToSend.splice(0, 1)[0];
      const receiver = pulse.destination;

      if (receiver.type === "B") {

        sendPart2Pulse("L", receiver, pulsesToSend, nodesWeCareAboutGoingHigh, presses);
      } else if (receiver.type === "FF") {

        if (pulse.type === "L") {
          // console.log(receiver.memory);
          if (receiver.memory["state"] === "On") {
            receiver.memory["state"] = "Off";
             sendPart2Pulse("L", receiver, pulsesToSend, nodesWeCareAboutGoingHigh, presses);
          } else if (receiver.memory["state"] === "Off") {
            receiver.memory["state"] = "On";
             sendPart2Pulse("H", receiver, pulsesToSend, nodesWeCareAboutGoingHigh, presses);
          }
        }
      } else if (receiver.type === "C") {

        receiver.memory[pulse.sender.name] = pulse.type;
        const typeIfAllSame = Object.values(receiver.memory).groupBy(x => x);
        // console.log(receiver.memory);
        if (typeIfAllSame["H"] && typeIfAllSame["H"].length === Object.keys(receiver.memory).length) {
          sendPart2Pulse("L", receiver, pulsesToSend, nodesWeCareAboutGoingHigh, presses);
        } else {
           sendPart2Pulse("H", receiver, pulsesToSend, nodesWeCareAboutGoingHigh, presses);
        }
      }

      // console.log(pulsesToSend.length);
    }
  }
  console.log(nodesWeCareAboutGoingHigh);
  return lcmArray(Object.values(nodesWeCareAboutGoingHigh));
};

run({
  part1: {
    tests: [
      {
        input: `
broadcaster -> a, b, c
%a -> b
%b -> c
%c -> inv
&inv -> a`,
        expected: 32000000,
      },
      {
        input: `
broadcaster -> a
%a -> inv, con
&inv -> b
%b -> con
&con -> output`,
        expected: 11687500,
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
