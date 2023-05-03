#!/usr/bin/env node
import fs from "fs";
import { evaluate } from "mathjs";
import path from "path";

import { program } from "commander";

import logger from "./logger.js";
import * as utils from "./utils.js";

const { __dirname } = utils.fileDirName(import.meta);
const packageJsonFilePath = path.join(__dirname, "package.json");
const { description, version } = JSON.parse(
  fs.readFileSync(packageJsonFilePath)
);

program
  .version(version)
  .description(description)
  .option("-e, --edit", "Edit your choices")
  .option(
    "-m, --math [expression]",
    `Math mode:
      --math 12,000 + 4,000   // 12400
      --math 12_000 + 4_000  // 12400
      --math 12 / (2.3 + 0.7)   // 4
      --math 12.7 cm to inch    // 5 inch
      --math sin(45 deg) ^ 2    // 0.5
      --math 9 / 3 + 2i         // 3 + 2i
      --math det([-1, 2; 3, 1]) // -7
  `
  )
  .action(async (cmd) => {
    if (cmd.edit) {
      logger.warning("Opening choices file...");
      try {
        await utils.openFileInEditor(utils.choicesFilePath);
      } catch (error) {
        logger.error(`An error occurred: ${error}`);
      }
    } else if (cmd.math) {
      let mathResult;

      try {
        let mathString = cmd.math + program.args.join(" ");
        mathString = mathString.replaceAll(",", "").replaceAll("_", "");
        mathResult = evaluate(mathString);
        logger.info(`${mathResult}`);
      } catch {
        logger.error("Unable evaluate the provided equation");
      }
    } else {
      utils.askChoices();
    }
  });

program.parse(process.argv);
