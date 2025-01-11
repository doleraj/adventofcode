import run from "aocrunner";

type Field = { name: string, r1Min: number, r1Max: number, r2Min: number, r2Max: number };

const parseInput = (rawInput: string) => {
  const [fieldChunk, yourTicketChunk, nearbyTicketsChunk] = rawInput.split("\n\n");

  const fieldRegex = /([\w ]+): (\d+)-(\d+) or (\d+)-(\d+)/;
  const fields: Field[] = fieldChunk.split("\n").map((line) => {
    const matches = line.match(fieldRegex)!!;
    return { name: matches[1], r1Min: Number.parseInt(matches[2]), r1Max: Number.parseInt(matches[3]), r2Min: Number.parseInt(matches[4]), r2Max: Number.parseInt(matches[5]) };
  });

  const yourTicket = yourTicketChunk.split("\n")[1].split(",").map(c => Number.parseInt(c));

  const nearbyTickets = nearbyTicketsChunk.split("\n").slice(1).map(line => line.split(",").map(c => Number.parseInt(c)));

  return { fields, yourTicket, nearbyTickets };
}

const isValidTicket = (ticket: number[], fields: Field[]) => {
  for (let value of ticket) {
    const valid = fields.some(field => {
      const inRange1 = value >= field.r1Min && value <= field.r1Max;
      const inRange2 = value >= field.r2Min && value <= field.r2Max;
      return inRange1 || inRange2;
    });

    if (!valid) {
      // console.log(`Ticket ${ticket} is not valid`)
      return value;
    }
  }
  // console.log(`Ticket ${ticket} is valid`)
  return -1;
}

const part1 = (rawInput: string) => {
  const { fields, yourTicket, nearbyTickets } = parseInput(rawInput);

  return nearbyTickets.reduce((acc, ticket) => {
    const invalidValue = isValidTicket(ticket, fields);
    if (invalidValue !== -1) {
      // console.log(`Ticket ${ticket} is not valid`)
      return acc + invalidValue;
    }
    // console.log(`Ticket ${ticket} is valid`)
    return acc;
  }, 0);
};

const part2 = (rawInput: string) => {
  const { fields, yourTicket, nearbyTickets } = parseInput(rawInput);

  const validTickets = nearbyTickets.filter((ticket) => isValidTicket(ticket, fields) === -1);

  const fieldPositionResults = fields.map(field => {
    return validTickets.map(ticket => {
      const positionResults = ticket.map((value, index) => {
        const inRange1 = value >= field.r1Min && value <= field.r1Max;
        const inRange2 = value >= field.r2Min && value <= field.r2Max;
        if (inRange1 || inRange2) {
          return index;
        }
      });
      return { field: field.name, positionResults }
    });
  });

  const validSpotsForField = fieldPositionResults.map((fieldResults) => {
    const results: number[] = [];
    for (let i = 0; i < validTickets.length; i++) {
      const isFieldValidInPosition = fieldResults
        .map(n => n.positionResults[i]).filter(n => n !== undefined).length === validTickets.length;
      if (isFieldValidInPosition) {
        results.push(i);
      }
    }
    return { field: fieldResults[0].field, results };
  });

  let fieldsLeftToFindPositionsFor = validSpotsForField.slice();
  const validFieldPositions: Record<string, number> = {};
  const positionsFound: number[] = [];
  while (fieldsLeftToFindPositionsFor.length > 0) {
    const nextValidFieldIndex = fieldsLeftToFindPositionsFor.findIndex(fieldResult => {
      return fieldResult.results.filter(n => !positionsFound.includes(n)).length === 1;
    });

    const nextField = fieldsLeftToFindPositionsFor.splice(nextValidFieldIndex, 1)[0];
    const foundPosition = nextField.results.find(n => !positionsFound.includes(n))!!;
    validFieldPositions[nextField.field] = foundPosition;
    positionsFound.push(foundPosition);
  }

  return Object.entries(validFieldPositions).reduce((acc, field) => {
    return field[0].startsWith("departure") ? yourTicket[field[1]] * acc : acc;
  }, 1);
};

run({
  part1: {
    tests: [
      {
        input: `
class: 1-3 or 5-7
row: 6-11 or 33-44
seat: 13-40 or 45-50

your ticket:
7,1,14

nearby tickets:
7,3,47
40,4,50
55,2,20
38,6,12`,
        expected: 71,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
class: 0-1 or 4-19
row: 0-5 or 8-19
seat: 0-13 or 16-19

your ticket:
11,12,13

nearby tickets:
3,9,18
15,1,5
5,14,9`,
        expected: 1,
      },
    ],
    // 930240 too low
    // 2056320 too low
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
