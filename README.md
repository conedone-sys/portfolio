# portfolio

A portfolio site that boots like a text console — DOS/FreeBSD aesthetics,
CGA/EGA palette, CRT scanlines, no frameworks, no build step.

**Live:** https://conedone-sys.github.io/portfolio/

## What it is

One page, three files of code:

```
index.html          markup + boot shell
assets/content.js   <- EDIT THIS: name, role, links, files, projects
assets/terminal.js  the console: command parser, virtual file system, rendering
assets/style.css    CRT theme, DOS palette, phosphor variants
```

There is no bundler, no npm, no dependencies. Open `index.html` and it runs.

## Commands

| Command | What it does |
|---|---|
| `ls` | list files (`-a` all, `-l` long) |
| `ll` | alias for `ls -l` |
| `dir` | DOS-style listing (`<DIR>`, volume label, 8.3 vibe) |
| `cd <dir>` | move around (`cd ..`, `cd /`, `cd ~`) |
| `cat <file>` | read a file |
| `pwd` / `whoami` / `date` | the usual |
| `tree` | whole file tree |
| `neofetch` | system info card |
| `theme dos\|green\|amber\|white` | switch phosphor colour (remembered) |
| `links` / `skills` | contact card and skill list |
| `help` | the list above |
| `history` | commands you typed |
| `clear` | wipe the screen |
| `sudo` / `exit` | jokes |

Keyboard: `Tab` completes, `↑`/`↓` walk history, `Ctrl+C` cancels the line,
`Ctrl+L` clears, `Ctrl+U` clears the line.

## Editing

Everything textual lives in `assets/content.js`:

- `name`, `role`, `tagline`, `location`, `email`, `links`, `skills`
- `fs` — the virtual file system. Directories are nested `dirs`, files are
  `{ content: \`...\` }`. Add a directory and it appears in `ls`, `tree`
  and `cd` automatically. Names starting with `.` are hidden unless `ls -a`.

To add a project: drop another `project-4.md` into `fs.dirs.projects.files`.

## Deploying

The site is served from the `gh-pages` branch (plain static files, no CI):

```bash
git push origin main
git push origin main:gh-pages
```

## Fonts

`Perfect DOS VGA 437` by Zeh Fernando, loaded from cdnfonts. If the CDN is
unavailable the page falls back to `Px437 IBM VGA8`, `Fixedsys` and finally
the browser's monospace font. To self-host instead, download the `.woff`,
drop it in `assets/`, and replace the `<link>` in `index.html` with a local
`@font-face` rule.

## License

Apache-2.0 — see [LICENSE](LICENSE).
