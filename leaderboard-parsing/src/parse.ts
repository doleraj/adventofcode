import fs from 'fs';
import {Chart, ChartConfiguration, ChartDataset, ChartItem, ChartType, DefaultDataPoint} from "chart.js/auto";
import chartDataLabels, {Context as LabelOptionContext} from 'chartjs-plugin-datalabels';
import { createCanvas } from "canvas";
import 'chartjs-adapter-date-fns';
import autocolors from 'chartjs-plugin-autocolors';
import 'dotenv/config';
import fetch from 'node-fetch';

Chart.register(
  autocolors,
  chartDataLabels,
  {
    id: "BackgroundColor",
    beforeDraw: (chart) => {
      const { ctx } = chart;
      ctx.save();
      ctx.fillStyle = `#0f0f23`;
      ctx.fillRect(0, 0, chart.canvas.width, chart.canvas.height);
      ctx.restore();
    }
  }
);
Chart.defaults.color = "#cccccc";
Chart.defaults.datasets.line.borderWidth = 2;
Chart.defaults.scales.timeseries.ticks.color = "#cccccc";
Chart.defaults.scales.timeseries.time.displayFormats.day = 'MMM d, h a, ';
Chart.defaults.scales.timeseries.time.minUnit = 'hour';
Chart.defaults.scales.timeseries.ticks.autoSkipPadding = 12;
Chart.defaults.scales.linear.beginAtZero = true;

interface Member {
  name: string;
  local_score: number
  last_star_ts: number;
  id: number;
  global_score: number;
  stars: number;
  completion_day_level: { [key: string]: { [key: string]: { star_index: number; get_star_ts: number } } };
}
interface StarAndTime { starNumber: number, time: number };

fs.existsSync('cache') || fs.mkdirSync('cache');
fs.existsSync('images') || fs.mkdirSync('images');

const fetchLeaderboard = async () => {
  if (fs.existsSync('cache/leaderboard.json') && fs.existsSync('cache/fetchdetails')) {
    const lastFetchSplits = fs.readFileSync('cache/fetchdetails', 'utf-8').split(",");
    const lastFetchTime = Number.parseInt(lastFetchSplits[0]);
    const year = lastFetchSplits[1];
    const leaderboardId = lastFetchSplits[2];

    if (year === process.env.YEAR && leaderboardId == process.env.LEADERBOARD_ID && Date.now() - lastFetchTime < 15 * 60 * 1000) {
      console.log("Reusing cached leaderboard.");
      return;
    }
  }
  fs.writeFileSync('cache/fetchdetails', `${Date.now().toString()},${process.env.YEAR},${process.env.LEADERBOARD_ID}`);

  const response = await fetch(`https://adventofcode.com/${process.env.YEAR}/leaderboard/private/view/${process.env.LEADERBOARD_ID}.json`, {
    headers: {
      cookie: `session=${process.env.AOC_SESSION_KEY}`
  }});
  const json = await response.json();
  fs.writeFileSync('cache/leaderboard.json', JSON.stringify(json));
};

function renderAndWriteChart<TType extends ChartType = ChartType, TData = DefaultDataPoint<TType>, TLabel = unknown>
  (filename: string, config: ChartConfiguration<TType, TData, TLabel>) {
    const chartCanvas = createCanvas(2048, 1024);
    const chartCtx = chartCanvas.getContext("2d");
    const chart = new Chart(chartCtx as unknown as ChartItem, config);
    chartCanvas.toBuffer((error, buffer) => {
      chart.destroy();
      if (error) {
        throw error;
      }

      fs.writeFile(`images\\${filename}`, buffer, (error) => {
        if (error) { console.log(error); }
      });

    }, "image/png");
}

const parseLeaderboardAndRenderCharts = () => {
  const leaderboardData = fs.readFileSync('cache/leaderboard.json', 'utf-8');
  const leaderboard = JSON.parse(leaderboardData);
  const members: Member[] = Object.values(leaderboard.members);

  const starsByMember: Record<number, number> = {};
  for (const member of members) {
      starsByMember[member.id] = member.stars;
  }
  const totalNumberOfStars = Object.values(starsByMember).reduce((prev, curr) => prev + curr, 0);
  const numberOfPeopleWithStars = Object.values(starsByMember).filter((value) => value > 0).length;
  const numberOfPeopleWith50Stars = Object.values(starsByMember).filter((value) => value === 50).length;
  console.log(`Total Stars: ${totalNumberOfStars}`);
  console.log(`People with at Least One Star: ${numberOfPeopleWithStars}`);
  console.log(`People with at Least 10 Stars: ${Object.values(starsByMember).filter((value) => value >= 10).length}`);
  console.log(`People with at Least 25 Stars: ${Object.values(starsByMember).filter((value) => value >= 25).length}`);
  console.log(`People with All 50 Stars: ${numberOfPeopleWith50Stars}`);
  console.log(`Percentage of Participants @ 50 Stars: ${(numberOfPeopleWith50Stars / numberOfPeopleWithStars) * 100}%`);
  console.log(`Mean Average Stars: ${totalNumberOfStars / numberOfPeopleWithStars}`);

  const starTimesByMember: Record<number, number[]> = {};
  const starTimesByMemberWithPosition: Record<number, StarAndTime[]> = {};

  for (const member of members) {
      const starTimes: number[] = [];
      const starTimesWithPosition: StarAndTime[] = [];

      for (const [completionDay, completionDayLevel] of Object.entries(member.completion_day_level)) {
          for (const [dayStarNumber, star] of Object.entries(completionDayLevel)) {
            const starNumber = dayStarNumber === "2" ? 2* Number.parseInt(completionDay) : (2 * Number.parseInt(completionDay)) - 1;
            starTimes.push(star.get_star_ts);
            starTimesWithPosition.push({ starNumber: starNumber, time: star.get_star_ts });
          }
      }

      starTimesByMember[member.id] = starTimes.sort();
      starTimesByMemberWithPosition[member.id] = starTimesWithPosition;
  }

  console.log(`*** Winner's Circle ***`);
  const winnersCircle = Object.entries(starTimesByMember).map(memberStarTimes => {
    if (memberStarTimes[1].length === 50) {
      const fiftyStarMember = members.find(m => m.id === Number.parseInt(memberStarTimes[0]))!!;
      return { member: fiftyStarMember, times: memberStarTimes[1] };
    }
    return null;
  }).filter(value => value !== null) as { member: Member; times: number[] }[];
  winnersCircle.sort((a, b) => a.member.last_star_ts - b.member.last_star_ts);
  winnersCircle.forEach(winner => {
    console.log(`${winner.member.name} - ${new Date(winner.member.last_star_ts * 1000)}`);
  });

  const minDate = new Date();
  minDate.setUTCFullYear(2024, 11, 1);
  minDate.setUTCHours(5, 0, 0);
  const maxDateTS = Math.max(...members.map((member) => Math.max(...starTimesByMember[member.id])));

  const labels = [minDate.toISOString()];
  while (minDate.getTime() < maxDateTS * 1000) {
    minDate.setHours(minDate.getHours() + 1);
    labels.push(minDate.toISOString());
  }

  let chartDate = new Date();
  chartDate.setUTCFullYear(2025, 11, 1);
  chartDate.setUTCHours(5, 0, 0);
  let index = 1;
  console.log("**********");
    while (chartDate.getTime() < maxDateTS * 1000) {
        renderAndWriteChart(`perMemberBurnUpChart_${index++}.png`, {
            type: 'line',
            data: {
                labels,
                datasets: members.filter(member => starTimesByMember[member.id].length !== 0).map((member) => {
                    const dataset:ChartDataset<'line', {
                        x: string;
                        y: number;
                    }[]> = {
                        label: member.name,
                        data: starTimesByMember[member.id]
                            .filter((time) => new Date(time * 1000) <= chartDate)
                            .map((time, index) => {
                                return {x: new Date(time * 1000).toISOString(), y: index + 1};
                            }),
                        datalabels: {
                            align: 'right',
                            color: (context: LabelOptionContext) => {
                                return context.dataset.backgroundColor!!.toString();
                            },
                            rotation: 15,
                            formatter: (value: any, context: LabelOptionContext) => {
                                if (context.dataIndex === context.dataset.data.length - 1) {
                                    return context.dataset.label;
                                } else {
                                    return "";
                                }
                            },
                        },
                    };
                    return dataset;
                }),
            },
            options: {
                layout: {
                    padding: {
                        right: 100,
                        top: 100,
                    },
                },
                scales: {
                    x: {
                        type: 'timeseries',
                        ticks: {
                            autoSkip: true,
                        }
                    },
                    y: {
                        max: 50,
                        min: 0
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                },
            }
        });

    const membersBeforeDate = Object.entries(starTimesByMember).filter(entry => entry[1].filter(t => new Date(t * 1000) <= chartDate).length > 0).length;
    const starsBeforeDate = Object.values(starTimesByMember).flat().filter((time) => new Date(time * 1000) <= chartDate).reduce((acc, v) => acc + 1, 0);
    console.log(chartDate.toISOString(), starsBeforeDate / membersBeforeDate);

    chartDate.setDate(chartDate.getDate() + 1);
  }

  renderAndWriteChart('perMemberBurnUpChart.png', {
    type: 'line',
    data: {
      labels,
      datasets: members.filter(member => starTimesByMember[member.id].length !== 0).map((member) => {
        return {
          label: member.name,
          data: starTimesByMember[member.id].map((time, index) => { return { x: new Date(time * 1000).toISOString(), y: index + 1 }; }),
          datalabels: {
            align: 'right',
            color: (context: LabelOptionContext) => {
              return context.dataset.backgroundColor!!.toString();
            },
            rotation: 15,
            formatter: (value: any, context: LabelOptionContext) => {
              if (context.dataIndex === context.dataset.data.length - 1) {
                return context.dataset.label;
              } else {
                return "";
              }
            },
          },
        };
      }),
    },
    options: {
      layout: {
        padding: {
          right: 100,
          top: 100,
        },
      },
      scales: {
        x: {
          type: 'timeseries',
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    }
  });

  renderAndWriteChart('perMemberBurnUpChartInStarOrder.png', {
    type: 'line',
    data: {
      labels,
      datasets: members.filter(member => starTimesByMemberWithPosition[member.id].length !== 0).map((member) => {
        return {
          label: member.name,
          data: starTimesByMemberWithPosition[member.id].map((starNumberAndTime) => { return { x: new Date(starNumberAndTime.time * 1000).toISOString(), y: starNumberAndTime.starNumber }; }),
          datalabels: {
            align: 'right',
            color: (context: LabelOptionContext) => {
              return context.dataset.backgroundColor!!.toString();
            },
            rotation: 15,
            formatter: (value: any, context: LabelOptionContext) => {
              if (context.dataIndex === context.dataset.data.length - 1) {
                return context.dataset.label;
              } else {
                return "";
              }
            },
          },
        };
      }),
    },
    options: {
      layout: {
        padding: {
          right: 100,
          top: 100,
        },
      },
      scales: {
        x: {
          type: 'timeseries',
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    }
  });

  renderAndWriteChart('totalBurnUpChart.png', {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: "Total Stars",
        data: Object.values(starTimesByMember).flat().sort().map((time, index) => { return { x: new Date(time * 1000).toISOString(), y: index + 1 }; }),
        backgroundColor: "#ffff66",
        borderColor: "#ffff66",
        datalabels: {
          display: false,
        },
      }],
    },
    options: {
      scales: {
        x: {
          type: 'timeseries',
        }
      }
    }
  });

  members.filter(member => starTimesByMember[member.id].length !== 0).map((member) => {
    renderAndWriteChart(`${member.name.replace(/ /g, '_')}StarsInOrder.png`, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: "Total Stars",
          data: starTimesByMemberWithPosition[member.id].map((starNumberAndTime) => { return { x: new Date(starNumberAndTime.time * 1000).toISOString(), y: starNumberAndTime.starNumber }; }),
          backgroundColor: "#ffff66",
          borderColor: "#ffff66",
          datalabels: {
            display: false,
          },
        }],
      },
      options: {
        scales: {
          x: {
            type: 'timeseries',
          }
        }
      }
    });
  });
};

const doStuff = async () => {
  await fetchLeaderboard();
  parseLeaderboardAndRenderCharts();
};
await doStuff();
