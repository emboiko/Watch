# watch.js

> A tiny file-watcher for Python & Node (à la nodemon).
> Made using chokidar & powered by node.js

![](https://i.imgur.com/ivGwxvX.png)

## Usage

`npm link` 

Then:

`watch [filename] [mode]`

Where `[filename]` is an entrypoint and `[mode]` is 
either `strict` or by default, `normal`.

In normal mode, the entire current directory is monitored for changes. Use `strict` to monitor only `[filename]`.