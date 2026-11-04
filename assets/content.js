/* ===============================================================
   content.js  —  EDIT THIS FILE ONLY.
   Everything the terminal shows (name, links, files, projects)
   lives here. Placeholders are marked with [SQUARE BRACKETS].
   =============================================================== */

window.PORTFOLIO = {

  /* ---------- who you are ---------- */

  handle: 'guest',              // prompt name:  guest@portfolio
  host:   'portfolio',          // prompt host

  name:     '[YOUR NAME]',
  role:     '[YOUR ROLE]',
  tagline:  '[ONE LINE ABOUT YOU]',
  location: '[CITY, COUNTRY]',

  email: 'you@example.com',

  links: {
    github:   'https://github.com/conedone-sys',
    telegram: 'https://t.me/[YOUR_HANDLE]',
    linkedin: 'https://www.linkedin.com/in/[YOUR_HANDLE]'
  },

  skills: [
    '[SKILL 1]', '[SKILL 2]', '[SKILL 3]',
    '[SKILL 4]', '[SKILL 5]', '[SKILL 6]'
  ],

  /* ---------- the virtual file system ----------
     dirs  : { name: { dirs:{}, files:{} } }
     files : { name: { content: `text` } }
     -------------------------------------------------- */

  fs: {

    dirs: {

      about: {
        dirs: {},
        files: {
          'about.txt': {
            content: `NAME    : [YOUR NAME]
ROLE    : [YOUR ROLE]
BASE    : [CITY, COUNTRY]
STATUS  : [open to work / employed / studying]

ABOUT
-----
[Write three or four sentences about yourself here. What you do,
what you are learning, what kind of problems you like to solve.]

[Second paragraph. Keep it short - nobody reads long bios on a
console.]

CONTACT
-------
email    : you@example.com
telegram : @[YOUR_HANDLE]
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
          },
          'project-2.md': {
            content: `# [PROJECT 2]

[One or two lines about what this project does and why it exists.]

stack : [tech, tech, tech]
year  : [2025]
repo  : [https://github.com/conedone-sys/...]
`
          },
          'project-3.md': {
            content: `# [PROJECT 3]

[One or two lines about what this project does and why it exists.]

stack : [tech, tech, tech]
year  : [2024]
repo  : [https://github.com/conedone-sys/...]
`
          }
        }
      },

      contact: {
        dirs: {},
        files: {
          'email.txt': {
            content: `you@example.com
`
          },
          'links.txt': {
            content: `github    https://github.com/conedone-sys
telegram  https://t.me/[YOUR_HANDLE]
linkedin  https://www.linkedin.com/in/[YOUR_HANDLE]
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
        content: `[YOUR NAME] - [YOUR ROLE]
[email] | [telegram] | [github]

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
export NAME="[YOUR NAME]"
export ROLE="[YOUR ROLE]"
export EDITOR=vi
`
      }
    }
  }
};
