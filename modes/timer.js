import path from "path";

import player from "./../lib/player.js";
import logger from "./../logger.js";
import * as utils from "./../utils.js";

const { __dirname } = utils.fileDirName(import.meta);
const bellSoundFile = path.join(__dirname, "/../media/bells.mp3");

export const option = "-t, --timer [time unit] [number of units]";
export const optionDef = `Timer mode
\n
time units available:
  s, sec, secs, second, seconds
  m, min, mins, minute, minutes
  h, hr, hrs, hour, hours
  d, day, days
`;

const soundAlarm = () => {
  player
    .play(bellSoundFile, (err) => {
      if (err) console.log(`Could not play sound: ${err}`);
    })
    .then(() => {
      logger.branded("Time's up!");
    });
};

export const logic = async (unit, num) => {
  if (isNaN(Number(num))) {
    logger.error("Please enter number of mins for timer");
    return;
  }

  let time;
  try {
    switch (unit) {
      case "s":
      case "sec":
      case "secs":
      case "second":
      case "seconds":
        time = num * 1000;
        unit = "seconds";
        break;
      case "m":
      case "min":
      case "mins":
      case "minute":
      case "minutes":
        time = num * 1000 * 60;
        unit = "minutes";
        break;
      case "h":
      case "hr":
      case "hrs":
      case "hour":
      case "hours":
        time = num * 1000 * 60 * 60;
        unit = "hours";
        break;
      case "d":
      case "day":
      case "days":
        time = num * 1000 * 60 * 60 * 24;
        unit = "days";
        break;
      default:
        logger.error("Wrong time unit format was provided");
        break;
    }

    setTimeout(soundAlarm, time);
    logger.branded(`Setting timer for ${num} ${unit}...`);
  } catch {
    logger.error("Unable evaluate the provided equation");
  }
};
