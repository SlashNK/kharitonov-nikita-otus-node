import readline from "readline";
import path from "path";
import { exec } from "child_process";
import { findNodeProjects, getFolderVisualPath } from "../shared/utils.js";
import { FILE_ICON, FOLDER_ICON } from "../constants.js";
import chalk from "chalk";

const askUserConfirmation = (rootPath, folderPath, verbose) => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      chalk.yellow(
        `Install dependencies in ${getFolderVisualPath(
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

const installDependenciesInFolder = (rootPath, folderPath, verbose) => {
  return new Promise((resolve, reject) => {
    if (verbose) {
      console.log(
        chalk.cyan(
          `Installing dependencies in ${getFolderVisualPath(
            rootPath,
            folderPath,
            verbose
          )}...`
        )
      );
    }
    exec("npm install", { cwd: folderPath }, (err, stdout, stderr) => {
      if (err) {
        console.error(
          chalk.red(
            `Error installing dependencies in ${getFolderVisualPath(
              rootPath,
              folderPath,
              verbose
            )}:`,
            stderr
          )
        );
        reject(err);
      } else {
        console.log(
          chalk.green(
            `Dependencies installed in ${getFolderVisualPath(
              rootPath,
              folderPath,
              verbose
            )}`
          )
        );
        resolve(stdout);
      }
    });
  });
};

export const installCommand = async (
  dir = ".",
  confirm = true,
  verbose = false
) => {
  const rootPath = path.resolve(dir);
  const nodeProjectsFolders = [];
  await findNodeProjects(rootPath, nodeProjectsFolders);
  if (nodeProjectsFolders.length === 0) {
    console.log("No folders with package.json found.");
    return;
  }
  console.log(
    `Found ${nodeProjectsFolders.length} folder(s) with ${FILE_ICON}package.json:`
  );
  if (verbose) {
    for (const folder of nodeProjectsFolders) {
      console.log(chalk.cyan(`- ${FOLDER_ICON}${folder}`));
    }
  }
  console.log("====INSTALLING====");
  for (const folder of nodeProjectsFolders) {
    console.log(`- ${getFolderVisualPath(rootPath, folder, verbose)}`);
    let shouldInstall = true;
    if (confirm) {
      shouldInstall = await askUserConfirmation(rootPath, folder, verbose);
    }

    if (shouldInstall) {
      try {
        await installDependenciesInFolder(rootPath, folder, verbose);
      } catch (err) {
        console.error(
          `Failed to install dependencies in ${getFolderVisualPath(
            rootPath,
            folder,
            verbose
          )}`
        );
      }
    } else {
      console.log(`Skipping ${getFolderVisualPath(rootPath, folder, verbose)}`);
    }
  }
  console.log("====INSTALLATION COMPLETED====");
};
