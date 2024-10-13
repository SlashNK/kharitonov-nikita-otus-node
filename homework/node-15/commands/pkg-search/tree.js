import path from "path";
import { argv } from "process";
import { presentFilesAsTree, printTree } from "./utils.js";

const args = argv.slice(2);
const dirPath = args[0];
const depthFlags = ["-d", "--depth"];
const depthIndex = args.findIndex((arg) => depthFlags.includes(arg));
const depth =
  depthIndex !== -1 && args[depthIndex + 1]
    ? Number(args[depthIndex + 1])
    : Infinity;

if (!dirPath) {
  console.error("Path was not provided");
  process.exit(0);
}

presentFilesAsTree(path.resolve(dirPath), depth).then((res) => {
  if (res) {
    console.log(printTree(res));
  } else {
    console.error("Could not represent files as tree");
  }
});
