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
studying osint and pentest. i like cats and computers.

my take: osint is not about digging up secrets, it is about noticing
what everyone else left in plain sight. pentest is the same skill
pointed at a server instead of a person. both are mostly reading,
and reading is mostly patience.

no public projects right now - a disk died and took the archive with
it. rebuilding, one lab at a time.

CONTACT
-------
email : oyinoka@proton.me
`
          },

          'skills.txt': {
            content: `OSINT     middle
pentest   middle
C#        junior

currently learning: whatever breaks next
`
          }
        }
      },

      projects: {
        dirs: {},
        files: {
          'lost.txt': {
            content: `all previous projects were lost when a disk died,
so this directory is empty for now.

rebuilding, one lab at a time.

new files will appear here.
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
