#!/usr/bin/env node
import figlet from "figlet";
import { Command } from "commander";
import chalk from "chalk";
import { attractionsCommand } from "./commands/attractionCommands.js";
import { statisticsCommand } from "./commands/statisticsCommands.js";

const program = new Command();
const log = console.log;

//handle all unhandled exceptions
process.on("unhandledRejection", ()=> {
    log(chalk.red(" Encountered an error, try again later"))
    process.exit(1)
})

program.version("0.0.1", "-v, --version").description(chalk.bgCyan("CLI utility to easily browse flights, hotels and attractions in every country/city"))

log(figlet.textSync("Travel  Explorer"));
program.addCommand(attractionsCommand);
program.addCommand(statisticsCommand);
program.parse(process.argv);