#!/usr/bin/env node
import { exec } from "child_process";
import fs from "fs";
import path from "path";

import chalk from "chalk";
import { program } from "commander";
import inquirer from "inquirer";
import autocompletePrompt from "inquirer-autocomplete-prompt";

import fileDirName from "./utils.js";

const { __dirname } = fileDirName(import.meta);
const packageJsonFilePath = path.join(__dirname, "package.json");
const { description, version } = JSON.parse(
  fs.readFileSync(packageJsonFilePath)
);
const choicesFilePath = path.join(__dirname, "choices.json");
let choices = JSON.parse(fs.readFileSync(choicesFilePath));

const log = console.log;
const logError = (message) => {
  console.error(chalk.red(message));
};

inquirer.registerPrompt("autocomplete", autocompletePrompt);

program
  .version(version)
  .description(description)
  .option("-e, --edit", "Edit your choices")
  .action(async (cmd) => {
    if (cmd.edit) {
      log(chalk.yellow("Opening choices file..."));
      try {
        await openFileInEditor(choicesFilePath);
      } catch (error) {
        logError(chalk.red("An error occurred:", error));
      }
    } else {
      askChoices();
    }
  });

program.parse(process.argv);

function openFileInEditor(filePath) {
  return new Promise((resolve, reject) => {
    let command;
    if (process.platform === "darwin") {
      command = `open -a "Visual Studio Code" ${filePath}`;
    } else {
      reject(new Error(`Unsupported platform: ${process.platform}`));
      return;
    }
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function askChoices() {
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
          if (typeof choices[answersSoFar["_1"]] === "edit") {
          }

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
}

function runScript(answers) {
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
}
