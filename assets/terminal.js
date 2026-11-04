/* ===============================================================
   terminal.js — the console.
   Content lives in content.js. Do not put personal data here.
   =============================================================== */

(function () {
  'use strict';

  var CFG = window.PORTFOLIO || {};
  var FS = CFG.fs || { dirs: {}, files: {} };
  var THEMES = ['dos', 'green', 'amber', 'white'];

  var screenEl = document.getElementById('screen');
  var outputEl = document.getElementById('output');
  var promptEl = document.getElementById('prompt');
  var cmdWrap  = document.getElementById('cmdwrap');
  var caretEl  = document.getElementById('caret');
  var kbd      = document.getElementById('kbd');

  var startedAt = Date.now();

  var cwd = [];              // path segments below home
  var history = [];
  var histIdx = -1;
  var draft = '';
  var busy = true;           // true while the boot sequence prints
  var bootIdx = 0;
  var bootTimer = null;
  var theme = document.documentElement.dataset.theme || 'dos';

  /* ============================================================
     output helpers
     ============================================================ */

  function makeLine(cls) {
    var d = document.createElement('div');
    d.className = 'line' + (cls ? ' ' + cls : '');
    return d;
  }

  function append(node) {
    outputEl.appendChild(node);
    screenEl.scrollTop = screenEl.scrollHeight;
  }

  function print(text, cls) {
    var d = makeLine(cls);
    d.textContent = text;
    append(d);
    return d;
  }

  function printLines(text, cls) {
    String(text).replace(/\s+$/, '').split('\n').forEach(function (l) {
      print(l, cls);
    });
  }

  function span(parent, text, cls) {
    var s = document.createElement('span');
    if (cls) s.className = cls;
    s.textContent = text;
    parent.appendChild(s);
    return s;
  }

  function link(parent, text, href) {
    var a = document.createElement('a');
    a.textContent = text;
    a.href = href;
    if (href.indexOf('mailto:') !== 0) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    parent.appendChild(a);
    return a;
  }

  /* ============================================================
     path handling
     ============================================================ */

  function rootNode() {
    return { dirs: FS.dirs || {}, files: FS.files || {} };
  }

  function currentDir() {
    var node = rootNode();
    for (var i = 0; i < cwd.length; i++) {
      node = (node.dirs || {})[cwd[i]];
      if (!node) return null;
    }
    return node;
  }

  /* returns { type:'dir'|'file', node, path } or null */
  function resolvePath(p) {
    var segs;
    if (p === '' || p === '~' || p === '/' || p === './') segs = [];
    else if (p === '..') segs = cwd.concat(['..']);
    else if (p.indexOf('~/') === 0) segs = p.slice(2).split('/');
    else if (p.charAt(0) === '/') segs = p.split('/');
    else segs = cwd.concat(p.split('/'));

    var out = [];
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (!s || s === '.') continue;
      if (s === '..') { out.pop(); continue; }
      out.push(s);
    }

    var node = rootNode();
    for (var j = 0; j < out.length; j++) {
      var name = out[j];
      var last = j === out.length - 1;
      if (last) {
        if (node.dirs && node.dirs[name]) return { type: 'dir', node: node.dirs[name], path: out };
        if (node.files && node.files[name]) return { type: 'file', node: node.files[name], path: out };
        return null;
      }
      if (!node.dirs || !node.dirs[name]) return null;
      node = node.dirs[name];
    }
    return { type: 'dir', node: node, path: out };
  }

  function entriesOf(node, showAll) {
    var list = [];
    Object.keys(node.dirs || {}).forEach(function (n) {
      list.push({ name: n, dir: true });
    });
    Object.keys(node.files || {}).forEach(function (n) {
      list.push({ name: n, dir: false, file: node.files[n] });
    });
    return list
      .filter(function (e) { return showAll || e.name.charAt(0) !== '.'; })
      .sort(function (a, b) {
        if (a.dir !== b.dir) return a.dir ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
  }

  function humanSize(file) {
    var n = (file && file.content) ? file.content.length : 0;
    if (n < 1024) return n + 'B';
    return (n / 1024).toFixed(1) + 'K';
  }

  /* ============================================================
     commands
     ============================================================ */

  var COMMANDS = {};

  function def(name, desc, run) {
    COMMANDS[name] = { desc: desc, run: run };
  }

  def('help', 'show this list', function () {
    print('available commands:', 'dim');
    Object.keys(COMMANDS).sort().forEach(function (n) {
      var d = makeLine();
      span(d, '  ' + (n + ' ').padEnd(12), 'bright');
      span(d, COMMANDS[n].desc, 'dim');
      append(d);
    });
    print('');
    print("tips: 'ls -a' shows dotfiles, 'tab' completes, arrows recall history", 'dim');
  });

  def('ls', 'list directory contents  (-a all, -l long)', function (args) {
    var flags = args.filter(function (a) { return a.charAt(0) === '-'; }).join('');
    var targets = args.filter(function (a) { return a.charAt(0) !== '-'; });
    var showAll = flags.indexOf('a') !== -1;
    var long = flags.indexOf('l') !== -1;

    var names = targets.length ? targets : [null];
    names.forEach(function (target) {
      var node;
      if (target === null) {
        node = currentDir();
      } else {
        var r = resolvePath(target);
        if (!r) { print('ls: ' + target + ': No such file or directory', 'err'); return; }
        if (r.type === 'file') { print(target); return; }
        node = r.node;
      }
      if (!node) { print('ls: cannot access directory', 'err'); return; }
      var list = entriesOf(node, showAll);
      if (!list.length) return;
      if (long) printLong(list); else printGrid(list);
    });
  });

  def('ll', 'alias for ls -l', function () {
    COMMANDS.ls.run(['-l']);
  });

  def('dir', 'DOS-style listing', function () {
    var node = currentDir();
    var list = entriesOf(node, true);
    print(' Volume in drive C is PORTFOLIO', 'bright');
    print(' Volume Serial Number is 1A2B-3C4D', 'dim');
    print('');
    print(' Directory of C:\\' + cwd.join('\\').toUpperCase(), 'bright');
    print('');
    if (cwd.length) { dosRow('.', '<DIR>'); dosRow('..', '<DIR>'); }
    list.forEach(function (e) {
      dosRow(e.name, e.dir ? '<DIR>' : humanSizeDOS(e.file));
    });
    var files = list.filter(function (e) { return !e.dir; }).length;
    var dirs = list.length - files;
    print('');
    print('  ' + String(files).padStart(3) + ' File(s)              0 bytes', 'dim');
    print('  ' + String(dirs).padStart(3) + ' Dir(s)   4 GB free', 'dim');
  });

  function dosRow(name, size) {
    var d = makeLine();
    span(d, name.toUpperCase().padEnd(13), 'file');
    span(d, String(size).padStart(10), 'dim');
    span(d, '  ' + dosDate(), 'dim');
    append(d);
  }

  function dosDate() {
    var d = new Date();
    var p = function (n) { return String(n).padStart(2, '0'); };
    return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() +
           '  ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  function humanSizeDOS(file) {
    var n = (file && file.content) ? file.content.length : 0;
    return n.toLocaleString('en-US');
  }

  function printGrid(list) {
    var row = makeLine('entries');
    list.forEach(function (e) {
      var s = document.createElement('span');
      s.className = 'entry ' + (e.dir ? 'dir' : 'file');
      s.textContent = e.name + (e.dir ? '/' : '');
      row.appendChild(s);
    });
    append(row);
  }

  function printLong(list) {
    list.forEach(function (e) {
      var d = makeLine();
      span(d, e.dir ? 'drwxr-xr-x  ' : '-rw-r--r--  ', 'dim');
      span(d, ((e.dir ? '-' : humanSize(e.file)) + '').padStart(6) + '  ', 'dim');
      span(d, 'guest  ', 'dim');
      span(d, e.name + (e.dir ? '/' : ''), e.dir ? 'dir' : 'file');
      append(d);
    });
  }

  def('cat', 'print a file', function (args) {
    if (!args.length) { print('cat: missing file operand', 'err'); return; }
    args.forEach(function (a) {
      var r = resolvePath(a);
      if (!r || r.type !== 'file') { print('cat: ' + a + ': No such file or directory', 'err'); return; }
      printLines(r.node.content || '');
    });
  });

  def('cd', 'change directory', function (args) {
    var target = args[0] || '~';
    var r = resolvePath(target);
    if (!r) { print('cd: ' + target + ': No such file or directory', 'err'); return; }
    if (r.type !== 'dir') { print('cd: ' + target + ': Not a directory', 'err'); return; }
    cwd = r.path;
    renderPrompt();
  });

  def('pwd', 'print working directory', function () {
    print('/home/' + (CFG.handle || 'guest') + (cwd.length ? '/' + cwd.join('/') : ''));
  });

  def('whoami', 'print your name', function () {
    print(CFG.handle || 'guest');
  });

  def('date', 'current date and time', function () {
    var d = new Date();
    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var p = function (n) { return String(n).padStart(2, '0'); };
    var tz = '';
    try { tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').split('/').pop().replace(/_/g, ' '); } catch (e) {}
    print(days[d.getDay()] + ' ' + months[d.getMonth()] + ' ' + String(d.getDate()).padStart(2, ' ') +
          ' ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) +
          (tz ? ' ' + tz : '') + ' ' + d.getFullYear());
  });

  def('uname', 'system name  (-a all)', function (args) {
    if (args.indexOf('-a') !== -1) {
      print('FreeBSD ' + (CFG.host || 'portfolio') + ' 14.0-RELEASE FreeBSD 14.0-RELEASE #0: ' +
            'browser amd64');
    } else {
      print('FreeBSD');
    }
  });

  def('uptime', 'how long the console has been up', function () {
    print(' ' + new Date().toTimeString().slice(0, 8) + '  up ' + uptimeText() +
          ', 1 user, load averages: 0.00 0.00 0.00');
  });

  function uptimeText() {
    var s = Math.floor((Date.now() - startedAt) / 1000);
    var d = Math.floor(s / 86400);
    var h = Math.floor((s % 86400) / 3600);
    var m = Math.floor((s % 3600) / 60);
    if (d) return d + ' days, ' + h + ' hours';
    if (h) return h + ' hours, ' + m + ' mins';
    return Math.max(m, 1) + ' mins';
  }

  def('tree', 'show the whole file tree', function () {
    print('.', 'dir');
    walk(currentDir(), '');
  });

  function walk(node, prefix) {
    var dirs = Object.keys(node.dirs || {});
    var files = Object.keys(node.files || {});
    var all = dirs.map(function (n) { return { n: n, dir: true }; })
                  .concat(files.map(function (n) { return { n: n, dir: false }; }));
    all.forEach(function (e, i) {
      var last = i === all.length - 1;
      print(prefix + (last ? '└── ' : '├── ') + e.n + (e.dir ? '/' : ''), e.dir ? 'dir' : '');
      if (e.dir) walk(node.dirs[e.n], prefix + (last ? '    ' : '│   '));
    });
  }

  def('neofetch', 'system information', function () {
    var id = (CFG.handle || 'guest') + '@' + (CFG.host || 'portfolio');
    var art = [
      '  ┌────────────────┐',
      '  │  >_            │',
      '  │                │',
      '  │                │',
      '  └────────────────┘'
    ];
    var info = [
      ['', id],
      ['', new Array(id.length + 1).join('-')],
      ['os', 'FreeBSD 14.0-RELEASE'],
      ['host', CFG.host || 'portfolio'],
      ['shell', 'sh'],
      ['term', 'vga 80x25'],
      ['theme', theme],
      ['res', window.innerWidth + 'x' + window.innerHeight],
      ['uptime', uptimeText()]
    ];
    var rows = Math.max(art.length, info.length);
    for (var i = 0; i < rows; i++) {
      var d = makeLine();
      span(d, (art[i] || '').padEnd(22), 'dim');
      var item = info[i];
      if (item) {
        span(d, item[0].padEnd(8), 'accent');
        span(d, item[1], item[0] ? '' : 'bright');
      }
      append(d);
    }
  });

  def('theme', 'phosphor colour: dos | green | amber | white', function (args) {
    if (!args.length) {
      print('current theme: ' + theme, 'bright');
      print('available: ' + THEMES.join('  '), 'dim');
      return;
    }
    var t = args[0].toLowerCase();
    if (THEMES.indexOf(t) === -1) { print('theme: no such theme: ' + t, 'err'); return; }
    applyTheme(t);
    print('theme set to ' + t, 'ok');
  });

  function applyTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('pf-theme', t); } catch (e) {}
  }

  def('links', 'how to reach me', function () {
    var d0 = makeLine();
    span(d0, 'email'.padEnd(10), 'accent');
    link(d0, CFG.email || 'you@example.com', 'mailto:' + (CFG.email || 'you@example.com'));
    append(d0);

    if (CFG.location) {
      var d1 = makeLine();
      span(d1, 'base'.padEnd(10), 'accent');
      span(d1, CFG.location);
      append(d1);
    }

    Object.keys(CFG.links || {}).forEach(function (k) {
      var d = makeLine();
      span(d, k.padEnd(10), 'accent');
      link(d, CFG.links[k], CFG.links[k]);
      append(d);
    });
  });

  def('skills', 'list skills', function () {
    (CFG.skills || []).forEach(function (s) { print('  ' + s); });
  });

  def('history', 'command history', function () {
    history.forEach(function (h, i) {
      print(String(i + 1).padStart(3) + '  ' + h);
    });
  });

  def('echo', 'print text', function (args) {
    print(args.join(' '));
  });

  def('sudo', 'run a command as superuser', function () {
    print((CFG.handle || 'guest') + ' is not in the sudoers file.  This incident has been reported.', 'err');
  });

  def('clear', 'clear the screen', function () {
    outputEl.textContent = '';
  });

  def('exit', 'log out', function () {
    print('logout');
    print('');
    print('Connection to ' + (CFG.host || 'portfolio') + ' closed.', 'dim');
    setTimeout(function () { boot(); }, 700);
  });

  /* ============================================================
     prompt / input
     ============================================================ */

  function promptNodes(parent) {
    span(parent, CFG.handle || 'guest', 'p-user');
    span(parent, '@', 'p-at');
    span(parent, CFG.host || 'portfolio', 'p-host');
    span(parent, ':', 'p-at');
    span(parent, '~' + (cwd.length ? '/' + cwd.join('/') : ''), 'p-path');
    span(parent, '$ ', 'p-sym');
  }

  function renderPrompt() {
    promptEl.textContent = '';
    promptNodes(promptEl);
  }

  function renderInput() {
    var v = kbd.value;
    var pos = (kbd.selectionStart === null || kbd.selectionStart === undefined) ? v.length : kbd.selectionStart;
    cmdWrap.textContent = '';
    if (pos > 0) cmdWrap.appendChild(document.createTextNode(v.slice(0, pos)));
    cmdWrap.appendChild(caretEl);
    if (pos < v.length) cmdWrap.appendChild(document.createTextNode(v.slice(pos)));

    caretEl.style.animation = 'none';
    void caretEl.offsetWidth;
    caretEl.style.animation = '';
  }

  function execute(raw) {
    var text = raw.trim();

    var d = makeLine();
    promptNodes(d);
    span(d, text);
    append(d);

    if (!text) return;

    history.push(text);
    histIdx = history.length;

    var parts = text.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);
    var cmd = COMMANDS[name];

    if (!cmd) {
      print(name + ': command not found', 'err');
      print("type 'help' for a list of commands", 'dim');
      return;
    }

    try {
      cmd.run(args);
    } catch (err) {
      print(String(err && err.message ? err.message : err), 'err');
    }
  }

  function submit() {
    var raw = kbd.value;
    kbd.value = '';
    renderInput();
    execute(raw);
    screenEl.scrollTop = screenEl.scrollHeight;
  }

  function navHistory(dir) {
    if (!history.length) return;
    if (histIdx === history.length) draft = kbd.value;
    histIdx = Math.max(0, Math.min(history.length, histIdx + dir));
    kbd.value = (histIdx === history.length) ? draft : history[histIdx];
    kbd.setSelectionRange(kbd.value.length, kbd.value.length);
    renderInput();
  }

  function complete() {
    var v = kbd.value;
    var m = v.match(/^(.*\s)?([^\s]*)$/);
    var head = m[1] || '';
    var frag = m[2] || '';
    var pool;

    if (!head) {
      pool = Object.keys(COMMANDS);
    } else {
      var node = currentDir();
      pool = Object.keys(node.dirs || {}).concat(Object.keys(node.files || {}));
    }

    var hits = pool.filter(function (n) {
      return n.indexOf(frag) === 0 && n !== frag;
    }).sort();

    if (hits.length === 1) {
      kbd.value = head + hits[0] + (head ? '' : ' ');
      kbd.setSelectionRange(kbd.value.length, kbd.value.length);
      renderInput();
    } else if (hits.length > 1) {
      print(hits.join('   '), 'dim');
      print('');
    }
  }

  function cancel() {
    var d = makeLine();
    promptNodes(d);
    span(d, kbd.value + '^C', 'dim');
    append(d);
    kbd.value = '';
    renderInput();
  }

  /* ============================================================
     keyboard
     ============================================================ */

  kbd.addEventListener('input', renderInput);

  kbd.addEventListener('keydown', function (e) {
    if (busy) {
      if (!e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        skipBoot();
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      navHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      cancel();
    } else if (e.key === 'u' && e.ctrlKey) {
      e.preventDefault();
      kbd.value = '';
      renderInput();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      outputEl.textContent = '';
    }
  });

  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a')) return;
    kbd.focus({ preventScroll: true });
  });

  document.addEventListener('keydown', function (e) {
    if (document.activeElement !== kbd && !busy) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      kbd.focus({ preventScroll: true });
    }
  });

  /* ============================================================
     boot
     ============================================================ */

  var BOOT = [
    'SeaBIOS (version 1.16.0-1)',
    'Booting from Hard Disk...',
    '',
    'FreeBSD/amd64 EFI loader, Revision 1.1',
    'Loading kernel...',
    '[ OK ] mounted /portfolio on /',
    '[ OK ] loaded profile for ' + (CFG.handle || 'guest'),
    '[ OK ] console ready - 80x25'
  ];

  function bootLine(text) {
    if (text.indexOf('[ OK ]') === 0) {
      var d = makeLine();
      span(d, '[ OK ]', 'ok');
      span(d, text.slice(6), 'dim');
      append(d);
    } else if (text === '') {
      print('');
    } else {
      print(text);
    }
  }

  function boot() {
    busy = true;
    bootIdx = 0;
    outputEl.textContent = '';
    screenEl.scrollTop = 0;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    (function step() {
      if (bootIdx >= BOOT.length) { welcome(); return; }
      bootLine(BOOT[bootIdx++]);
      bootTimer = setTimeout(step, reduced ? 0 : 65 + Math.random() * 55);
    })();
  }

  function skipBoot() {
    if (!busy) return;
    clearTimeout(bootTimer);
    while (bootIdx < BOOT.length) bootLine(BOOT[bootIdx++]);
    welcome();
  }

  function welcome() {
    if (!busy) return;
    busy = false;
    print('');
    print('Welcome to FreeBSD 14.0-RELEASE (amd64)', 'bright');
    print('');
    print('  ' + (CFG.name || '[YOUR NAME]') + ' - ' + (CFG.role || '[YOUR ROLE]'), 'bright');
    if (CFG.tagline) print('  ' + CFG.tagline, 'dim');
    print('');
    print("type 'help' for commands, 'ls' to look around", 'dim');
    print('');
    renderPrompt();
    kbd.focus({ preventScroll: true });
  }

  /* ============================================================
     start
     ============================================================ */

  document.title = (CFG.name && CFG.name.charAt(0) !== '[' ? CFG.name : 'portfolio') + ' - console';
  applyTheme(theme);
  renderPrompt();
  renderInput();
  boot();
})();
