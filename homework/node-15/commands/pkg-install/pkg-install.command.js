import { installCommand } from "./utils.js";

export const pkgInstallCommand = (program) => {
  program
    .command("pkg-install [dir]")
    .description(
      "Install deps for all package.json in the specified directory and nested folders (excluding node_modules)"
    )
    .option(
      "-c, --confirm",
      "Ask for confirmation before installing in each folder"
    )
    .option("-v, --verbose", "Show full paths of package.json")
    .action(async (dir, options) => {
      const confirm = options.confirm || false;
      const verbose = options.verbose || false;
      await installCommand(dir, confirm, verbose);
    });
};
