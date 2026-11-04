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
| `help` | the list above |
| `history` | commands you typed |
| `clear` | wipe the screen |
| `sudo` / `exit` | jokes |

Keyboard: `Tab` completes, `↑`/`↓` walk history, `Ctrl+C` cancels the line,
`Ctrl+L` clears, `Ctrl+U` clears the line.

## Editing

Everything textual lives in `assets/content.js`:

- `name`, `role`, `tagline` — shown in the boot message
- `fs` — the virtual file system. Directories are nested `dirs`, files are
  `{ content: \`...\` }`. Add a directory and it appears in `ls`, `tree`
  and `cd` automatically. Names starting with `.` are hidden unless `ls -a`.

To add a project: drop another `project-4.md` into `fs.dirs.projects.files`.

## Editing it yourself

Everything you want to change lives in **one file**: `assets/content.js`.

### From the GitHub website (easiest, no git needed)

1. Open https://github.com/conedone-sys/portfolio/blob/main/assets/content.js
2. Click the pencil icon.
3. Edit the text between the backticks. Keep the backticks, the commas
   and the `'file-name': { content: ... }` shape intact.
4. "Commit changes" → to `main`.
5. Wait ~1 minute: the `publish` workflow copies `main` into `gh-pages`
   and GitHub Pages rebuilds automatically.

### From this machine

Edit `D:\portfolio-main\assets\content.js`, then:

```bash
cd D:\portfolio-main
git add -A
git commit -m "content: update about"
git push
```

### Rules of thumb

- Files starting with `.` are hidden from `ls` unless you use `ls -a`.
- Add a project = add another `'project-2.md': { content: `...` }` block.
- Delete a line/file = delete the whole block, including its trailing comma.
- Break something? `git revert` or ask me — every change is in history.

## Deploying

Pages serves the `gh-pages` branch, and you never push it by hand:
`.github/workflows/publish.yml` force-mirrors `main` → `gh-pages` on every
push to `main`.

**Only ever edit `main`.** If the workflow ever fails, the manual fallback is:

```bash
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
