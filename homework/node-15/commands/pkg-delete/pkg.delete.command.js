import { deleteCommand } from "./utils.js";

export const pkgDeleteCommand = (program) => {
  program
    .command("pkg-delete [dir]")
    .description(
      "Delete node_modules in all subdirectories containing package.json in the specified directory (excluding nested node_modules)"
    )
    .option(
      "-c, --confirm",
      "Ask for confirmation before deleting node_modules in each folder"
    )
    .option("-v, --verbose", "Show full paths of node_modules to be deleted")
    .action(async (dir, options) => {
      const confirm = options.confirm || false;
      const verbose = options.verbose || false;
      await deleteCommand(dir, confirm, verbose);
    });
};
