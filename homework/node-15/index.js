#!/usr/bin/env node
import { Command } from "commander";
import { linkCommandsToProgram } from "./commands/index.js";

const program = new Command();

program
  .name('pkg-cli')
  .description('CLI to search package.json, install and uninstall packages')
  .version('2.0.0');

linkCommandsToProgram(program);

program.parse(process.argv);
