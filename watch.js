#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const debounce = require("lodash.debounce");
const chokidar = require("chokidar");
const prog = require("caporal");
const chalk = require("chalk");

prog
  .version("1.0.1")
  .description("File watcher for Python & Node (à la nodemon)")
  .help("Global Options currently implented are --help & --version.")
  .argument("[filename]", "Name of a file to execute, defaults to ./index.js")
  .argument(
    "[mode]", "Use 'strict' to monitor changes only for [filename].\n"
  + "Defaults to 'normal', which monitors the directory w/ [filename] as an entrypoint."
  )
  .action(async ({ filename, mode }) => {
    const name = filename || "index.js";

    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not find ${name}`);
    }

    let proc;
    const start = debounce(() => {
      if (proc) {
        console.log(chalk.green(`>> Terminating Process ${proc.pid}`))
        proc.kill();
      }

      if (path.extname(name) === ".js") {
        proc = spawn("node", [name], { stdio: "inherit" });
      } else if (path.extname(name) === ".py") {
        proc = spawn("python", [name], { stdio: "inherit" });
      }

      console.log(chalk.green(`>> Starting: ${name} @${proc.pid}`));
    }, 100);

    let target = ".";
    if (mode === "strict") target = filename;

    chokidar
      .watch(target)
      .on("add", start)
      .on("change", (path) => {
        console.log(chalk.green(`>> Detected Changes in ${path}`));
        start()
      })
      .on("unlink", (path) => {
        console.log(chalk.green(`>> ${path} Unlinked...`));
        start()
      })
      .on("addDir", (path) => {
        start()
      })
      .on("unlinkDir", (path) => {
        console.log(chalk.green(`>> ${path} Unlinked...`));
        start()
      });
  });

prog.parse(process.argv);
