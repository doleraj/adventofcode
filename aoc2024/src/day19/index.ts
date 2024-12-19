import run from "aocrunner";
import { memoize } from "../utils/index.js";

const parseInput = (rawInput: string) => {
  const parts = rawInput.split("\n\n");
  const available = parts[0].split(", ");
  const requested = parts[1].split("\n");
  return { available, requested };
}

const findPossibleMakeups = memoize((pattern: string, available: string[]): number  => {
  // console.log(`Pattern left: ${pattern}`)

  let matchingPatterns = 0;
  for (const nextTowel of available) {
    if (pattern === nextTowel) {
      matchingPatterns++;
    }

    if (pattern.startsWith(nextTowel)) {
      const nextMakeups = findPossibleMakeups(pattern.replace(nextTowel, ""), available);
      // console.log(`number of next: ${nextMakeups}`)
      matchingPatterns += nextMakeups;
    }
  }

  return matchingPatterns;

}, (pattern, available) => JSON.stringify([pattern, available]));

const part1 = (rawInput: string) => {
  const { available, requested } = parseInput(rawInput);

  return requested.reduce((possibleCount, pattern) => {
    // console.log(`*** Next pattern ${pattern} ***`);
    const possibleMakeups = findPossibleMakeups(pattern, available);
    return possibleCount + (possibleMakeups > 0 ? 1 : 0);
  }, 0);
};

const part2 = (rawInput: string) => {
  const { available, requested } = parseInput(rawInput);

  return requested.reduce((possibleCount, pattern) => {
    // console.log(`*** Next pattern ${pattern} ***`);
    const possibleMakeups = findPossibleMakeups(pattern, available);
    return possibleCount + possibleMakeups;
  }, 0);
};

run({
  part1: {
    tests: [
      {
        input: `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 6,
      },
      {
        input: `
uug, wwg, uuu, grburwrb, uubrw, bw, wwbb, bugg, wb, uwub, ubb, ubruug, bgr, gbw, ruw, brw, ubu, bwgb, bwbbgg, rbu, rbww, uwwgubg, urggw, urgg, brubwurr, wrrbw, wggbbr, rbbrwg, uubb, rbuguu, rwugwr, ubugw, buwuuuu, uuru, wbbrb, gbg, ug, wwr, grbwgw, ugu, brwwu, www, bgwguuub, gur, ugbgubrg, ururgu, ruru, uuug, urw, uwg, buwuguwr, ugrw, rugrrr, wwgr, gbbug, wrbb, gwrgw, bgw, wbuur, wurbrr, rg, bbubgur, bwb, uwwggg, rugwwg, rggwu, wugwbggg, rwrw, rrgrw, urwg, rgw, urg, gbuu, gb, uwbwbr, ruu, bugrwbu, bwuu, wug, uwrugrw, uuww, br, ubwub, grbwu, brruur, wuubr, bbr, wrrubu, rwuugbg, grbwbg, guu, brg, wgwub, gwr, wgu, ggbrbb, bwub, wgg, wbu, wwb, bwrgu, uwgr, grgw, uurgbg, wrwbbg, ubub, bb, ruuw, uwrbugu, gwrb, bwr, rguwuw, rrbr, rubbgr, wrggu, gbwrbb, uugguug, gbbb, rwugg, wwbubr, rrurgbb, bwrwugr, ugg, brbuubb, bwbwrug, uwr, wuggwu, wuwww, bwbgrwbw, bubur, ugrb, grub, grgggb, uwru, wgr, gwwrg, wubu, bgu, bgrg, wuw, guwu, rbuwb, uuwgr, bggrurg, wrurbb, rgrgrbg, wbwr, uuwwub, ggwr, bbwg, rbg, wur, urgbg, wbr, uwwwrug, rurw, wwbgwub, urugwbw, g, uubg, ur, bwur, uurwruub, uw, uguuur, rub, wgb, wrrwuu, uwug, rww, wrrwuw, wbw, brr, bwrugg, ubgbbrr, gwg, uggbwb, uugbb, uguwubuw, wguwug, bwg, ggb, wgbur, urr, bbuwg, burur, grrb, gubru, ubrrugr, ubg, rbwgu, uwgbw, wgubw, gwgrrw, rrr, wbwu, ru, guwgg, rgr, brurg, rr, gw, wurbwgw, rrw, ubbr, wgub, wrrwu, gwguwrbw, uurb, rrg, bbgwu, uwwb, uggugw, rubbrgur, gwu, wrgwwg, gubbg, wggw, uuwr, ggru, wuu, bbu, bruwu, rgbrrwwr, wuurgbgg, ubugwgg, ubgr, rguwu, ruug, bwruubg, grgwrw, bgrw, uwrwg, gbbg, guuuu, bgwr, wwwuw, rgrw, rwr, wrurgr, rw, wwu, wbbwwrb, rgbwr, bgbwg, wr, wgugr, grw, gru, wurubug, wgbu, uuuwuug, rbgw, wuwur, bbb, ugwr, ubuwub, rbwb, grwgrbg, bg, bwww, guub, ugw, uub, ugbw, rwub, bggwuuu, bgwwg, uru, uggbrw, bggwg, gubgwubu, bguggu, uwuuub, wwwb, ugb, rbb, uwwg, bbw, bbruwr, rur, buw, wbbr, ubrgugrb, grurg, ggugr, gugwr, ubuwu, rggrg, wbrb, bwrr, wbg, ww, gwub, grgubu, brubu, gbwg, brb, rurug, buwu, gbbbwb, bbgbw, rug, uwrb, gggw, ubrgbu, bru, gww, bur, gbggrrwr, uuwuu, bgbgw, wgbr, grr, gwgwrbr, gbb, gbr, bbbugr, uuw, wrg, gub, gg, rubgggg, rugg, urur, rwbu, bwu, bwbuw, rgbgb, bwgr, rgwuw, wbruw, ubr, wrb, rbrbb, bu, uwu, gbwwrr, buuguru, uggrw, wbuurur, wgrw, wrw, wgbggrru, uubburwb, bgbr, rbr, gug, wrr, uuubwgr, buu, uu, wububwg, ugwruu, rru, wgrrbgg, gguw, ruub, rgu, ggw, rrwu, rwggr, rwwbwu, w, uuguw, wwgbu, brggw, rbwgru, guw, wub, gwuggur, grrw, wg, ubbguu, wgggb, uwb, uwwu, wrub, uwwgw, rubwbrr, wgbrg, bgb, bbwb, brgb, rwu, uur, bbruurrw, u, gbu, urb, wuwbggg, rwwrbr, gwb, grgrburw, bwrg, wbb, wuurw, bugbuug, uggrb, gubbgbb, bww, bbbw, gbwwr, wruw, rb, gguww, ugww, wgw, rgrwwg, gwbwr, brrw, bbrubu, rgb, rbwu, rrb, gwugug, rbgb, bgwg, gu, wwugguw, rgg, wbugrr, ubw, rbrru, grb, wrurrw, ggg, wbwg, rruu, ugr, bgg, ub, ggu, bbbr, rbw, bug, gggwbu, bbuu, urrb, gruww, b, uww, brbuw, urbubg, gugwg, bub, grg

rwrurbburwbwwwwbrubbbwbwugwrbrubwuwubrbwbguuugguwrubgbggw`,
        expected: 1,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `
r, wr, b, g, bwu, rb, gb, br

brwrr
bggr
gbbr
rrbgbr
ubwu
bwurrg
brgr
bbrgwb`,
        expected: 16,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
