import readline from "readline";
import fs from "fs/promises";
import path from "path";
import { findNodeProjects, getFolderVisualPath } from "../shared/utils.js";
import chalk from "chalk";

const askUserConfirmation = (rootPath, folderPath, verbose) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      chalk.yellow(
        `Delete node_modules in ${getFolderVisualPath(
          rootPath,
          folderPath,
          verbose
        )}? (y/n): `
      ),
      (answer) => {
        rl.close();
        resolve(answer.toLowerCase() === "y");
      }
    );
  });
};

const deleteNodeModulesInFolder = async (rootPath, folderPath, verbose) => {
  const nodeModulesPath = path.join(folderPath, "node_modules");
  try {
    const stat = await fs.stat(nodeModulesPath);
    if (stat.isDirectory()) {
      if (verbose) {
        console.log(
          chalk.cyan(
            `Deleting node_modules in ${getFolderVisualPath(
              rootPath,
              folderPath,
              verbose
            )}...`
          )
        );
      }
      await fs.rm(nodeModulesPath, { recursive: true, force: true });
      console.log(
        chalk.green(
          `Deleted node_modules in ${getFolderVisualPath(
            rootPath,
            folderPath,
            verbose
          )}`
        )
      );
    } else {
      console.log(
        chalk.yellow(
          `node_modules does not exist in ${getFolderVisualPath(
            rootPath,
            folderPath,
            verbose
          )}`
        )
      );
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      console.log(
        chalk.yellow(
          `node_modules does not exist in ${getFolderVisualPath(
            rootPath,
            folderPath,
            verbose
          )}`
        )
      );
    } else {
      console.error(
        chalk.red(
          `Error deleting node_modules in ${getFolderVisualPath(
            rootPath,
            folderPath,
            verbose
          )}`
        ),
        err
      );
    }
  }
};

export const deleteCommand = async (
  dir = ".",
  confirm = true,
  verbose = false
) => {
  const rootPath = path.resolve(dir);
  const nodeProjectsFolders = [];
  await findNodeProjects(rootPath, nodeProjectsFolders); // Collect all folders with package.json

  if (nodeProjectsFolders.length === 0) {
    console.log("No folders with package.json found.");
    return;
  }

  console.log(
    `Found ${nodeProjectsFolders.length} folder(s) with package.json:`
  );

  for (const folder of nodeProjectsFolders) {
    const shouldDelete = confirm
      ? await askUserConfirmation(rootPath, folder, verbose)
      : true;

    if (shouldDelete) {
      await deleteNodeModulesInFolder(rootPath, folder, verbose);
    } else {
      console.log(`Skipping ${getFolderVisualPath(rootPath, folder, verbose)}`);
    }
  }

  console.log("====DELETION COMPLETED====");
};
