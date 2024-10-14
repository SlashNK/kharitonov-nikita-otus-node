import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import { FOLDER_ICON, FILE_ICON } from "../constants.js";
export const findNodeProjects = async (rootPath, projectPaths = []) => {
  try {
    const stats = await fs.stat(rootPath);
    const name = path.basename(rootPath);
    if (!stats.isDirectory()) return null;
    const dirents = await fs.readdir(rootPath, { withFileTypes: true });
    const items = [];
    let containsTarget = false;

    for (const dirent of dirents) {
      const fullPath = path.join(rootPath, dirent.name);
      if (dirent.name === "node_modules") {
        containsTarget = true;
        const displayName = chalk.red(`${FOLDER_ICON} ${dirent.name}`);
        items.push({ name: displayName });
        continue;
      }
      if (dirent.name === "package.json") {
        containsTarget = true;
        const displayName = `${FILE_ICON} ${dirent.name}`;
        items.push({ name: displayName });
        projectPaths.push(rootPath);
        continue;
      }
      if (dirent.isDirectory()) {
        const subtree = await findNodeProjects(fullPath, projectPaths);
        if (subtree) {
          items.push(subtree);
        }
      }
    }
    const folderDisplayName = `${FOLDER_ICON} ${name}`;

    if (containsTarget || items.length > 0) {
      return { name: folderDisplayName, items };
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getFolderVisualPath = (rootPath, folderPath, verbose) => {
  if (verbose) {
    return chalk.bold(`${folderPath}`);
  }
  const path1 = path.resolve(rootPath);
  const path2 = path.resolve(folderPath);
  return chalk.bold(
    path1 === path2
      ? path.basename(folderPath)
      : path.relative(rootPath, folderPath)
  );
};
