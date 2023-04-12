import chalk from "chalk";

const errorLog = chalk.red;
const warningLog = chalk.hex("#FFA500");
const brandedLog = chalk.hex("#255dd9");

export default {
  info: (message) => {
    console.log(message);
  },
  warning: (message) => {
    console.log(warningLog(message));
  },
  error: (message) => {
    console.log(errorLog(message));
  },
  branded: (message) => {
    console.log(brandedLog(message));
  },
};
