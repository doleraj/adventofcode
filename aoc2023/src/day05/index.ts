import run from "aocrunner";

interface ParsedRange {
  sourceStart: number;
  sourceEnd: number;
  destStart: number;
}

const parseSection = (lines: string[]) => {
  const sectionMap: ParsedRange[] = [];
  // Get rid of the header line for the section
  lines.shift();
  let mappingLine = lines.shift()!!;
  while (mappingLine !== undefined && mappingLine.length !== 0) {
    const parsedLine = mappingLine.match(/(\d+) (\d+) (\d+)/)!!;
    const destStart =  Number.parseInt(parsedLine[1]);
    const sourceStart = Number.parseInt(parsedLine[2]);
    const rangeLength = Number.parseInt(parsedLine[3]);
    sectionMap.push({
      sourceStart,
      sourceEnd: sourceStart + rangeLength - 1,
      destStart,
    });

    mappingLine = lines.shift()!!;
  }

  return sectionMap;
}

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");
  const seedsLine = lines.shift()!!;
  const seeds = Array.from(seedsLine.matchAll(/(\d+)/g)).map(match => Number.parseInt(match[0]));
  lines.shift();

  // Parse everything out into ranges to keep it all straight
  const seedToSoilMap= parseSection(lines);
  const soilToFertilizerMap= parseSection(lines);
  const fertilizerToWaterMap= parseSection(lines);
  const waterToLightMap= parseSection(lines);
  const lightToTemperatureMap= parseSection(lines);
  const temperatureToHumidityMap= parseSection(lines);
  const humidityToLocationMap= parseSection(lines);

  return {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  }
}

const performMapping = (baseNumber: number, baseToNextMap: ParsedRange[]) => {
  let nextNumber = baseNumber;
  const baseToNextEntry = baseToNextMap.filter(baseToNextEntry => {
    return baseToNextEntry.sourceStart <= baseNumber && baseNumber <= baseToNextEntry.sourceEnd;
  });
  if (baseToNextEntry.length > 0) {
    nextNumber = (baseNumber - baseToNextEntry[0].sourceStart) + baseToNextEntry[0].destStart;
  }
  return nextNumber;
}

const part1 = (rawInput: string) => {
  const {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  } = parseInput(rawInput);

  const locations = seeds.map(seedNumber => {
    // console.log("************************");
    // console.log(seedNumber);
    let soilNumber = performMapping(seedNumber, seedToSoilMap);
    // console.log(soilNumber);
    let fertilizerNumber = performMapping(soilNumber, soilToFertilizerMap);
    // console.log(fertilizerNumber);
    let waterNumber = performMapping(fertilizerNumber, fertilizerToWaterMap);
    // console.log(waterNumber);
    let lightNumber = performMapping(waterNumber, waterToLightMap);
    // console.log(lightNumber);
    let temperatureNumber = performMapping(lightNumber, lightToTemperatureMap);
    // console.log(temperatureNumber);
    let humidityNumber = performMapping(temperatureNumber, temperatureToHumidityMap);
    // console.log(humidityNumber);
    let locationNumber = performMapping(humidityNumber, humidityToLocationMap);
    // console.log(locationNumber);

    return locationNumber;
  });

  return Math.min(...locations);
};

const part2 = (rawInput: string) => {
  const {
    seeds,
    seedToSoilMap,
    soilToFertilizerMap,
    fertilizerToWaterMap,
    waterToLightMap,
    lightToTemperatureMap,
    temperatureToHumidityMap,
    humidityToLocationMap,
  } = parseInput(rawInput);

  let finalLocation = -1;
  while (seeds.length > 2) {
    const seedBase = seeds.shift()!!;
    const seedRange = seeds.shift()!!;

    // console.log([...Array(seeds[i + 1]).keys()]);
    for (let j = 0; j < seedRange; j++) {
      // console.log("************************");
      // console.log(seedNumber);
      let soilNumber = performMapping(seedBase + j, seedToSoilMap);
      // console.log(soilNumber);
      let fertilizerNumber = performMapping(soilNumber, soilToFertilizerMap);
      // console.log(fertilizerNumber);
      let waterNumber = performMapping(fertilizerNumber, fertilizerToWaterMap);
      // console.log(waterNumber);
      let lightNumber = performMapping(waterNumber, waterToLightMap);
      // console.log(lightNumber);
      let temperatureNumber = performMapping(lightNumber, lightToTemperatureMap);
      // console.log(temperatureNumber);
      let humidityNumber = performMapping(temperatureNumber, temperatureToHumidityMap);
      // console.log(humidityNumber);
      let locationNumber = performMapping(humidityNumber, humidityToLocationMap);
      // console.log(locationNumber);

      if (finalLocation === -1 || locationNumber < finalLocation) {
        finalLocation = locationNumber;
      }
    }
  }

  return finalLocation;
};

run({
  part1: {
    tests: [
      {
        input: `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
