import fs from 'fs/promises';
import path from 'path';
import { argv } from 'process';

const presentFilesAsTree = async (rootPath, depth, currentDepth = 0) => {
  try {
    const stats = await fs.stat(rootPath);
    const name = path.basename(rootPath);
    if (!stats.isDirectory() || currentDepth >= depth) return { name };
    const dirents = await fs.readdir(rootPath, { withFileTypes: true });
    const items = [];
    for (const dirent of dirents) {
      items.push(await presentFilesAsTree(path.join(rootPath, dirent.name), depth, currentDepth + 1));
    }
    return { name, items };
  } catch (err) {
    console.error(err);
  }
};

const printTree = (tree, lvl = 0) => {
  let res = tree.name;
  const items = tree.items;
  if (Array.isArray(items) && items.length > 0) {
    const isLast = (index) => index === items.length - 1;
    res = items.reduce((acc, item, index) => {
      return `${acc}\n${lvl > 0 ? `│${" ".repeat(lvl)}` : ""}${isLast(index) ? "└" : "├"}── ${printTree(item, lvl + 1)}`;
    }, res);
  }
  return res;
};


const args = argv.slice(2);
const dirPath = args[0];
const depthIndex = args.indexOf('-d');
const depth = depthIndex !== -1 && args[depthIndex + 1] ? Number(args[depthIndex + 1]) : Infinity;
console.log(depth);
if (!dirPath) {
  console.error('Path was not provided');
  process.exit(0);
}
presentFilesAsTree(path.resolve(dirPath), depth).then((res) => {
  if (res) {
    console.log(printTree(res));
  } else {
    console.error('Could not represent files as tree');
  }
});
