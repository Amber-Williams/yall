import chalk from "chalk";
import { exec } from "child_process";
import inquirer from "inquirer";
import autocompletePrompt from "inquirer-autocomplete-prompt";

import choices from "./choices.js";

const log = console.log;
const logError = (message) => {
  console.error(chalk.red(message));
};

inquirer.registerPrompt("autocomplete", autocompletePrompt);

const runScript = (answers) => {
  let command = choices[answers._1][answers._2];
  const isUrl = command.match("https");

  if (isUrl) {
    command = `open -na "Google Chrome" --args --new-window "${command}"`;
  }

  exec(command, (error, stdout, stderr) => {
    if (error) {
      logError(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      logError(`stderr: ${stderr}`);
      return;
    }

    log(chalk.green("yeehaw"));

    if (stdout) {
      log(`stdout: ${stdout}`);
    }
  });
};

inquirer
  .prompt([
    {
      type: "autocomplete",
      name: "_1",
      message: "Where to?",
      source: (_, input) => {
        input = input || "";

        return Promise.resolve(
          Object.keys(choices).filter((project) =>
            project.toLowerCase().startsWith(input.toLowerCase())
          )
        );
      },
    },
    {
      type: "autocomplete",
      name: "_2",
      message: "And then?",
      source: (answersSoFar, input) => {
        input = input || "";
        const places = Object.keys(choices[answersSoFar["_1"]]);

        return Promise.resolve(
          places.filter((type) =>
            type.toLowerCase().startsWith(input.toLowerCase())
          )
        );
      },
    },
  ])
  .then((answers) => {
    runScript(answers);
  });
