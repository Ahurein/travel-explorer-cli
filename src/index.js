#!/usr/bin/env node
import select from "@inquirer/select";
import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";
import { attractionsCommand } from "./commands/attractionCommands.js";

const program = new Command();
const log = console.log;

program
  .version("0.0.1", "-v, --version")
  .description(
    chalk.bgCyan(
      "CLI utility to easily browse hotels and attractions in every country/city"
    )
  )

program.addCommand(attractionsCommand)

if (process.argv.slice(2).length) {
  log(figlet.textSync("Travel  Explorer"));
}

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  log(figlet.textSync("Travel  Explorer"));
  program.outputHelp();
}
