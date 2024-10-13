import fs from "fs/promises";
import path from "path";

// Recursively builds the tree structure with only directories containing package.json
export const presentFilesAsTree = async (rootPath, depth, currentDepth = 0) => {
  try {
    const stats = await fs.stat(rootPath);
    const name = path.basename(rootPath);
    if (!stats.isDirectory() || currentDepth >= depth) return null;

    const dirents = await fs.readdir(rootPath, { withFileTypes: true });
    const items = [];

    let containsPackageJson = false;

    for (const dirent of dirents) {
      const fullPath = path.join(rootPath, dirent.name);

      // If it's a directory, recurse
      if (dirent.isDirectory()) {
        const subtree = await presentFilesAsTree(fullPath, depth, currentDepth + 1);
        if (subtree) {
          items.push(subtree);
        }
      }

      // If it's a package.json file, add it
      if (dirent.name === "package.json") {
        containsPackageJson = true;
        items.push({ name: "package.json" });
      }
    }

    // If it contains a package.json or any subfolder does, return this folder in the tree
    if (containsPackageJson || items.length > 0) {
      return { name, items };
    }

    return null; // Exclude directories that don't have any package.json
  } catch (err) {
    console.error(err);
    return null;
  }
};

// Print the tree structure with correct formatting
export const printTree = (tree, lvl = 0) => {
  let res = tree.name;
  const items = tree.items;

  if (Array.isArray(items) && items.length > 0) {
    const isLast = (index) => index === items.length - 1;
    res = items.reduce((acc, item, index) => {
      return `${acc}\n${lvl > 0 ? `│${" ".repeat(lvl)}` : ""}${
        isLast(index) ? "└" : "├"
      }── ${printTree(item, lvl + 1)}`;
    }, res);
  }
  return res;
};
