#!/usr/bin/env node
import fs from "fs";
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
  .action(async (cmd) => {
    if (cmd.edit) {
      logger.warning("Opening choices file...");
      try {
        await utils.openFileInEditor(utils.choicesFilePath);
      } catch (error) {
        logger.error(`An error occurred: ${error}`);
      }
    } else {
      utils.askChoices();
    }
  });

program.parse(process.argv);
