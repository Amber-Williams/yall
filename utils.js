import { exec } from "child_process";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import inquirer from "inquirer";
import autocompletePrompt from "inquirer-autocomplete-prompt";

import logger from "./logger.js";

inquirer.registerPrompt("autocomplete", autocompletePrompt);

const { __dirname } = fileDirName(import.meta);
export const choicesFilePath = path.join(__dirname, "choices.json");
let choices = JSON.parse(fs.readFileSync(choicesFilePath));

export function fileDirName(meta) {
  const __filename = fileURLToPath(meta.url);

  const __dirname = dirname(__filename);

  return { __dirname, __filename };
}

export function openFileInEditor(filePath) {
  return new Promise((resolve, reject) => {
    let command;
    if (process.platform === "darwin") {
      command = `open -a "Visual Studio Code" ${filePath}`;
    } else {
      reject(new Error(`Unsupported platform: ${process.platform}`));
      return;
    }
    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

export function askChoices() {
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

export function runScript(answers) {
  let command = choices[answers._1][answers._2];
  const isUrl = command.match("https");

  if (isUrl) {
    command = `open -na "Google Chrome" --args --new-window "${command}"`;
  }

  const childProcess = exec(command, (error, stdout, stderr) => {
    if (error) {
      logger.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      logger.error(`stderr: ${stderr}`);
      return;
    }

    logger.branded("yeehaw");

    if (stdout) {
      logger.info(`stdout: ${stdout}`);
    }
  });

  childProcess.stdout.on("data", function (chunk) {
    logger.info(`${chunk}`);
  });
}
