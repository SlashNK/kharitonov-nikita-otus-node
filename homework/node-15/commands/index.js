import { pkgDeleteCommand } from "./pkg-delete/pkg.delete.command.js";
import { pkgInstallCommand } from "./pkg-install/pkg-install.command.js";
import { pkgSearchCommand } from "./pkg-search/pkg-search.command.js";

export const linkCommandsToProgram = (program) => {
  pkgSearchCommand(program);
  pkgInstallCommand(program);
  pkgDeleteCommand(program);
};
