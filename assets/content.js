/* ===============================================================
   content.js  —  EDIT THIS FILE ONLY.
   Everything the terminal shows (name, files, projects) lives here.
   Placeholders are marked with [SQUARE BRACKETS].
   =============================================================== */

window.PORTFOLIO = {

  /* ---------- prompt identity ---------- */

  handle: 'adept',              // prompt name:  adept@portfolio
  host:   'portfolio',          // prompt host

  /* ---------- who you are ---------- */

  name:    'adept',
  role:    'OSINT student',
  tagline: 'studying OSINT and pentest, i like cats and computers',

  /* ---------- the virtual file system ----------
     dirs  : { name: { dirs:{}, files:{} } }
     files : { name: { content: `text` } }

     A file is one backtick template literal. Indentation and line
     breaks inside it are printed exactly as written.
     -------------------------------------------------- */

  fs: {

    dirs: {

      about: {
        dirs: {},
        files: {
          'about.txt': {
            content: `NAME    : adept
ROLE    : OSINT student
STATUS  : studying

ABOUT
-----
Studying OSINT and pentest. I like cats and computers.

[Add two or three sentences here if you want: what exactly you are
learning, which tools you use, what kind of work you are after.]

CONTACT
-------
email : oyinoka@proton.me
`
          },

          'skills.txt': {
            content: `[SKILL 1]      [level: advanced]
[SKILL 2]      [level: intermediate]
[SKILL 3]      [level: intermediate]
[SKILL 4]      [level: beginner]
[SKILL 5]      [level: beginner]
[SKILL 6]      [level: beginner]

currently learning: [SOMETHING NEW]
`
          }
        }
      },

      projects: {
        dirs: {},
        files: {
          'project-1.md': {
            content: `# [PROJECT 1]

[One or two lines about what this project does and why it exists.]

stack : [tech, tech, tech]
year  : [2026]
repo  : [https://github.com/conedone-sys/...]
live  : [https://example.com]
`
          }
        }
      },

      contact: {
        dirs: {},
        files: {
          'email.txt': {
            content: `oyinoka@proton.me
`
          },
          'links.txt': {
            content: `github    https://github.com/conedone-sys
`
          }
        }
      }
    },

    files: {

      'README.md': {
        content: `# portfolio

This is not a website. It is a text console that happens to run
in your browser.

  ls                 list files
  cat <file>         read a file
  cd <dir>           enter a directory
  tree               show everything
  neofetch           system info
  theme green        switch the phosphor colour
  help               all commands

Everything you see is a placeholder. Edit assets/content.js and
it changes here.
`
      },

      'resume.txt': {
        content: `adept - OSINT student
oyinoka@proton.me | https://github.com/conedone-sys

EXPERIENCE
  [2024 - now]  [Company] - [Position]
                [one line about what you did]

  [2022 - 2024] [Company] - [Position]
                [one line about what you did]

EDUCATION
  [2018 - 2022] [University], [Degree]

SKILLS
  [skill 1], [skill 2], [skill 3], [skill 4]
`
      },

      '.profile': {
        content: `# read by the shell on login
export NAME="adept"
export ROLE="OSINT student"
export EMAIL="oyinoka@proton.me"
export EDITOR=vi
`
      }
    }
  }
};
