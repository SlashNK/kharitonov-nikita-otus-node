import fs from "fs/promises";
import path from "path";
export const presentFilesAsTree = async (rootPath, depth, currentDepth = 0) => {
    try {
      const stats = await fs.stat(rootPath);
      const name = path.basename(rootPath);
      if (!stats.isDirectory() || currentDepth >= depth) return { name };
      const dirents = await fs.readdir(rootPath, { withFileTypes: true });
      const items = [];
      for (const dirent of dirents) {
        items.push(
          await presentFilesAsTree(
            path.join(rootPath, dirent.name),
            depth,
            currentDepth + 1
          )
        );
      }
      return { name, items };
    } catch (err) {
      console.error(err);
    }
  };
  
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