import path from "path";
import { printTree } from "./utils.js";
import { findNodeProjects } from "../shared/utils.js";

export const pkgSearchCommand = (program) => {
  program
    .command("pkg-search [dir]")
    .description(
      "Search for all package.json and node_modules in the specified directory and nested folders (excluding node_modules)"
    )
    .action((dir = "./") => {
      const depth = Infinity;
      findNodeProjects(path.resolve(dir)).then((res) => {
        if (res) {
          console.log(printTree(res));
        } else {
          console.error("Could not represent files as tree");
        }
      });
    });
};
