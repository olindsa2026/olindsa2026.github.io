/*
 * Interactive P vs NP demos built around the Partition problem.
 *
 * Usage:
 *   <div class="partition-race" data-n="12"></div>
 *   <div class="partition-bruteforce" data-n="20"></div>
 *   <script src="/assets/js/pvsnp-partition.js"></script>
 *
 * partition-race: students try to SOLVE a Partition instance by clicking
 *   numbers to move them between two bins (timed), then VERIFY a classmate's
 *   proposed answer, which takes n additions and one comparison.
 *
 * partition-bruteforce: the browser checks every one of the 2^n possible
 *   splits (Gray-code order, so each step is O(1)) on random weights in
 *   1..100, stopping as soon as it finds an equal split.  If none exists it
 *   must check all of them.  "+1 item" doubles the worst-case work.  The
 *   measured rate is used to project run times for larger n.
 */
(function () {
  'use strict';

  var COLOR_A = '#1f77b4';
  var COLOR_B = '#e67e00';
  var OK = '#2e7d32';
  var BAD = '#c62828';

  function html(tag, attrs, parent, text) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  function btn(parent, label, primary) {
    return html('button', { type: 'button', class: 'btn btn--small ' + (primary ? 'btn--primary' : 'btn--inverse'),
                            style: 'margin:2px 4px 2px 0' }, parent, label);
  }

  function randInt(lo, hi) { return lo + Math.floor(Math.random() * (hi - lo + 1)); }

  function fmtInt(x) { return Math.round(x).toLocaleString('en-US'); }

  function fmtDuration(sec) {
    if (sec < 1e-3) return (sec * 1e6).toFixed(1) + ' µs';
    if (sec < 1) return (sec * 1e3).toFixed(1) + ' ms';
    if (sec < 60) return sec.toFixed(1) + ' seconds';
    if (sec < 3600) return (sec / 60).toFixed(1) + ' minutes';
    if (sec < 86400) return (sec / 3600).toFixed(1) + ' hours';
    var years = sec / (365.25 * 86400);
    if (years < 1) return (sec / 86400).toFixed(1) + ' days';
    if (years < 1000) return years.toFixed(1) + ' years';
    var universe = 13.8e9;
    if (years < universe) return fmtInt(years) + ' years';
    return (years / universe).toExponential(1).replace('e+', ' × 10^') + ' × the age of the universe';
  }

  /* Like fmtDuration, but takes log10(seconds) so astronomically large times don't overflow. */
  function fmtDurationLog(log10sec) {
    if (log10sec < 15) return fmtDuration(Math.pow(10, log10sec));
    var universeLog = Math.log10(13.8e9 * 365.25 * 86400);
    return '≈ 10^' + Math.round(log10sec - universeLog) + ' × the age of the universe';
  }

  function fmtBigCount(x) { // a count that may exceed 2^53, given as a Number
    return x < 1e15 ? fmtInt(x) : '≈ ' + x.toExponential(2).replace('e+', ' × 10^');
  }

  function fmtClock(ms) {
    var s = Math.floor(ms / 1000);
    return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2);
  }

  /* Returns a boolean array (true = bin A) giving an equal split, or null. */
  function solvePartition(w) {
    var total = w.reduce(function (a, b) { return a + b; }, 0);
    if (total % 2) return null;
    var half = total / 2;
    // via[s] = index of the item that first made sum s reachable
    var via = new Int32Array(half + 1).fill(-1);
    var reach = new Uint8Array(half + 1);
    reach[0] = 1;
    for (var i = 0; i < w.length; i++) {
      for (var s = half; s >= w[i]; s--) {
        if (!reach[s] && reach[s - w[i]]) { reach[s] = 1; via[s] = i; }
      }
    }
    if (!reach[half]) return null;
    var inA = w.map(function () { return false; });
    for (var t = half; t > 0; t -= w[via[t]]) inA[via[t]] = true;
    return inA;
  }

  /* ------------------------------------------------------------------ */
  /* Solve vs. verify race                                                */
  /* ------------------------------------------------------------------ */

  function initRace(root) {
    var n = parseInt(root.getAttribute('data-n'), 10) || 12;
    var weights, inA, solution, startTime, timerId, moves, solved;

    root.style.maxWidth = '680px';
    root.style.margin = '1em 0';

    html('h4', { style: 'margin:0.5em 0 0.25em' }, root, 'Part 1: Find an equal split');
    html('p', { style: 'font-size:0.85em;margin:0 0 0.5em' }, root,
      'Click a number to move it to the other bin. The clock starts on your first click and stops when both bins have the same total.');

    var bins = html('div', { style: 'display:flex;gap:10px;flex-wrap:wrap' }, root);
    function makeBin(label, color) {
      var box = html('div', { style: 'flex:1 1 260px;border:2px solid ' + color + ';border-radius:6px;padding:6px;min-height:90px;background:#fff' }, bins);
      var head = html('div', { style: 'font-weight:600;color:' + color + ';font-size:0.9em;margin-bottom:4px' }, box);
      var chips = html('div', { style: 'display:flex;flex-wrap:wrap;gap:6px' }, box);
      return { head: head, chips: chips, label: label };
    }
    var binA = makeBin('Bin A', COLOR_A);
    var binB = makeBin('Bin B', COLOR_B);

    var status = html('div', { style: 'font-size:0.9em;min-height:1.6em;margin:6px 0', 'aria-live': 'polite' }, root);
    var controls = html('div', {}, root);
    var newBtn = btn(controls, 'New puzzle', true);
    var giveUpBtn = btn(controls, 'Give up (show a solution)');

    html('h4', { style: 'margin:1.2em 0 0.25em' }, root, 'Part 2: Check a classmate\'s answer');
    html('p', { style: 'font-size:0.85em;margin:0 0 0.5em' }, root,
      'A classmate claims to have solved this same puzzle. Is their answer right? Checking it does not require any search.');
    var vControls = html('div', {}, root);
    var proposeBtn = btn(vControls, 'Get a proposed answer', true);
    var verifyBtn = btn(vControls, 'Verify it');
    var vOut = html('div', { style: 'font-family:monospace;font-size:0.85em;margin-top:6px;white-space:pre-wrap;min-height:1.5em' }, root);
    var vVerdict = html('div', { style: 'font-weight:600;min-height:1.5em;margin-top:4px', 'aria-live': 'polite' }, root);

    var proposal = null, verifying = null;

    function sums() {
      var a = 0, b = 0;
      weights.forEach(function (x, i) { if (inA[i]) a += x; else b += x; });
      return [a, b];
    }

    function render() {
      binA.chips.innerHTML = '';
      binB.chips.innerHTML = '';
      weights.forEach(function (x, i) {
        var color = inA[i] ? COLOR_A : COLOR_B;
        var chip = html('button', { type: 'button',
          style: 'min-width:2.6em;padding:4px 8px;border-radius:14px;border:none;cursor:pointer;font-weight:600;font-size:0.9em;color:#fff;background:' + color,
          'aria-label': 'Move ' + x + ' to ' + (inA[i] ? 'bin B' : 'bin A') }, inA[i] ? binA.chips : binB.chips, String(x));
        chip.addEventListener('click', function () { move(i); });
      });
      var s = sums();
      binA.head.textContent = 'Bin A — total ' + s[0];
      binB.head.textContent = 'Bin B — total ' + s[1];
    }

    function updateStatus() {
      var s = sums();
      if (solved) return;
      var t = startTime ? fmtClock(Date.now() - startTime) : '0:00';
      status.style.color = '';
      status.textContent = '⏱ ' + t + '   ·   moves: ' + moves + '   ·   difference: ' + Math.abs(s[0] - s[1]);
    }

    function move(i) {
      if (solved) return;
      if (!startTime) {
        startTime = Date.now();
        timerId = setInterval(updateStatus, 250);
      }
      inA[i] = !inA[i];
      moves++;
      render();
      var s = sums();
      if (s[0] === s[1]) {
        solved = true;
        clearInterval(timerId);
        status.style.color = OK;
        status.textContent = '✓ Solved in ' + fmtClock(Date.now() - startTime) + ' after ' + moves +
          ' moves. Checking that it is correct only took two sums and a comparison.';
      } else {
        updateStatus();
      }
    }

    function newPuzzle() {
      do {
        weights = [];
        for (var i = 0; i < n; i++) weights.push(randInt(3, 60));
        solution = solvePartition(weights);
      } while (!solution);
      inA = weights.map(function () { return true; });
      startTime = null; moves = 0; solved = false;
      clearInterval(timerId);
      proposal = null;
      cancelVerify();
      vOut.textContent = '';
      vVerdict.textContent = '';
      render();
      updateStatus();
    }

    function giveUp() {
      if (solved) return;
      clearInterval(timerId);
      inA = solution.slice();
      solved = true;
      render();
      status.style.color = '';
      status.textContent = 'Here is one equal split. Once you see it, it is easy to confirm, but finding it was the hard part.';
    }

    function propose() {
      cancelVerify();
      var p = solution.slice();
      if (Math.random() < 0.5) {
        // Swap one A item with one B item of different weight, so the answer is wrong.
        var as = [], bs = [];
        p.forEach(function (x, i) { (x ? as : bs).push(i); });
        var tries = 0, i, j;
        do { i = as[randInt(0, as.length - 1)]; j = bs[randInt(0, bs.length - 1)]; tries++; }
        while (weights[i] === weights[j] && tries < 100);
        p[i] = false; p[j] = true;
      }
      proposal = p;
      var a = [], b = [];
      weights.forEach(function (x, i) { (p[i] ? a : b).push(x); });
      vOut.textContent = 'Bin A: ' + a.join(', ') + '\nBin B: ' + b.join(', ');
      vVerdict.textContent = '';
    }

    function cancelVerify() { if (verifying) { clearTimeout(verifying); verifying = null; } }

    function verify() {
      if (!proposal) propose();
      cancelVerify();
      var a = [], b = [];
      weights.forEach(function (x, i) { (proposal[i] ? a : b).push(x); });
      var steps = a.length + b.length, k = 0, sa = 0, sb = 0, ops = 0;
      vVerdict.textContent = '';
      function lineFor(list, upto, total, name) {
        return name + ': ' + list.slice(0, upto).join(' + ') + (upto ? ' = ' + total : '');
      }
      function step() {
        if (k < a.length) { sa += a[k]; } else { sb += b[k - a.length]; }
        k++; ops++;
        vOut.textContent = lineFor(a, Math.min(k, a.length), sa, 'Bin A') + '\n' +
                           lineFor(b, Math.max(0, k - a.length), sb, 'Bin B');
        if (k < steps) { verifying = setTimeout(step, 120); return; }
        verifying = null;
        var ok = sa === sb;
        vVerdict.style.color = ok ? OK : BAD;
        vVerdict.textContent = (ok ? '✓ Valid: ' + sa + ' = ' + sb : '✗ Invalid: ' + sa + ' ≠ ' + sb) +
          '. Verifying took ' + ops + ' additions and 1 comparison. That is O(n), which is polynomial.';
      }
      step();
    }

    newBtn.addEventListener('click', newPuzzle);
    giveUpBtn.addEventListener('click', giveUp);
    proposeBtn.addEventListener('click', propose);
    verifyBtn.addEventListener('click', verify);
    newPuzzle();
  }

  /* ------------------------------------------------------------------ */
  /* Brute force                                                          */
  /* ------------------------------------------------------------------ */

  var TWO32 = 4294967296;

  function ctz(i) { // trailing zeros of a positive integer up to 2^53
    var lo = i % TWO32;
    if (lo !== 0) { lo = lo | 0; return 31 - Math.clz32(lo & -lo); }
    var hi = Math.floor(i / TWO32) | 0;
    return 32 + 31 - Math.clz32(hi & -hi);
  }

  function initBrute(root) {
    var MIN_N = 4, MAX_N = 40;
    var n = Math.min(MAX_N, Math.max(MIN_N, parseInt(root.getAttribute('data-n'), 10) || 20));
    var weights = [], running = false, rafId = null;
    var rate = null; // measured checks per second
    var i, total, diff, inA, checked, elapsed, found;

    root.style.maxWidth = '680px';
    root.style.margin = '1em 0';

    // Larger weights make equal splits rarer.  Partition is hardest when
    // log2(max weight) is about n; with small weights equal splits are everywhere.
    var maxOpts = [[100, '100'], [1e4, '10,000'], [1e6, '1 million'], [1e9, '1 billion'], [1e12, '1 trillion']];
    var maxW = parseFloat(root.getAttribute('data-max')) || 100;
    function newWeight() { return randInt(1, maxW); }
    function regenerate() { weights = []; for (var k = 0; k < n; k++) weights.push(newWeight()); }
    regenerate();

    var maxRow = html('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:4px' }, root);
    html('span', { style: 'font-size:0.85em;margin-right:4px' }, maxRow, 'Weights from 1 up to:');
    var maxBtns = maxOpts.map(function (o) {
      var b = btn(maxRow, o[1], o[0] === maxW);
      b.addEventListener('click', function () {
        maxW = o[0];
        maxBtns.forEach(function (x, j) { x.className = 'btn btn--small ' + (maxOpts[j][0] === maxW ? 'btn--primary' : 'btn--inverse'); });
        regenerate(); reset();
      });
      return b;
    });
    var controls = html('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:4px' }, root);
    var minusBtn = btn(controls, '− 1 item');
    var nLabel = html('span', { style: 'font-weight:600;min-width:6.5em;text-align:center' }, controls);
    var plusBtn = btn(controls, '+ 1 item');
    var runBtn = btn(controls, 'Run brute force', true);

    var grid = html('div', { style: 'display:flex;flex-wrap:wrap;gap:3px;margin:10px 0 4px', 'aria-hidden': 'true' }, root);
    html('div', { style: 'font-size:0.75em;opacity:0.75;margin-bottom:6px' }, root,
      'Each square is one item. Blue = bin A, orange = bin B. The pattern shows the split being checked right now.');
    var barWrap = html('div', { style: 'height:10px;background:#e0e0e0;border-radius:5px;overflow:hidden' }, root);
    var bar = html('div', { style: 'height:100%;width:0;background:' + COLOR_A }, barWrap);
    var status = html('div', { style: 'font-size:0.9em;margin:6px 0;min-height:3em', 'aria-live': 'polite' }, root);

    var details = html('details', { style: 'font-size:0.8em;margin:4px 0' }, root);
    html('summary', {}, details, 'Show the item weights');
    var weightList = html('div', { style: 'font-family:monospace;word-break:break-all' }, details);

    html('div', { style: 'font-weight:600;font-size:0.9em;margin-top:10px' }, root, 'How long would checking every split take?');
    var proj = html('table', { style: 'font-size:0.85em;margin-top:4px' }, root);

    var cells = [];
    function buildGrid() {
      grid.innerHTML = '';
      cells = weights.map(function () {
        return html('div', { style: 'width:14px;height:14px;border-radius:2px;background:' + COLOR_B }, grid);
      });
    }

    function paintGrid() {
      for (var j = 0; j < cells.length; j++) cells[j].style.background = inA[j] ? COLOR_A : COLOR_B;
    }

    // Always use an even total, so "no equal split" is never answerable by a parity check.
    function fixParity() {
      var t = weights.reduce(function (a, b) { return a + b; }, 0), last = weights.length - 1;
      if (t % 2) weights[last] += weights[last] < maxW ? 1 : -1;
    }

    function reset() {
      stop();
      fixParity();
      total = Math.pow(2, n);
      inA = weights.map(function () { return false; });
      diff = -weights.reduce(function (a, b) { return a + b; }, 0); // sum(A) - sum(B)
      i = 0; checked = 0; elapsed = 0; found = false;
      nLabel.textContent = 'n = ' + n + ' items';
      minusBtn.disabled = n <= MIN_N;
      plusBtn.disabled = n >= MAX_N;
      runBtn.textContent = 'Run brute force';
      weightList.textContent = weights.join(', ');
      buildGrid();
      paintGrid();
      bar.style.width = '0';
      status.style.color = '';
      status.textContent = 'There are 2^' + n + ' = ' + fmtInt(total) +
        ' ways to split ' + n + ' items into two bins. Press "Run brute force" to check them all.';
      renderProjection();
    }

    function renderProjection() {
      var r = rate || 1e8;
      proj.innerHTML = '';
      var head = html('tr', {}, proj);
      html('th', { style: 'text-align:left;padding-right:1.5em' }, head, 'n');
      html('th', { style: 'text-align:left;padding-right:1.5em' }, head, 'splits (2^n)');
      html('th', { style: 'text-align:left' }, head, rate ? 'time at your browser\'s ' + fmtInt(r) + ' checks/sec'
                                                           : 'time at 100,000,000 checks/sec (run once to measure yours)');
      var ns = [n, n + 10, 60, 80, 100].filter(function (x, idx, arr) { return arr.indexOf(x) === idx && x >= n; });
      ns.forEach(function (m) {
        var tr = html('tr', {}, proj);
        html('td', { style: 'padding-right:1.5em' + (m === n ? ';font-weight:600' : '') }, tr, String(m));
        html('td', { style: 'padding-right:1.5em' }, tr, m <= 50 ? fmtInt(Math.pow(2, m)) : '≈ ' + Math.pow(2, m).toExponential(2).replace('e+', ' × 10^'));
        html('td', {}, tr, fmtDuration(Math.pow(2, m) / r));
      });
    }

    function frame() {
      var t0 = performance.now();
      var budget = 30, chunk = 1 << 16;
      while (performance.now() - t0 < budget) {
        var end = Math.min(total, i + chunk);
        while (i < end) {
          if (i > 0) {
            var j = ctz(i);
            if (inA[j]) { inA[j] = false; diff -= 2 * weights[j]; }
            else { inA[j] = true; diff += 2 * weights[j]; }
          }
          i++;
          if (diff === 0) { found = true; break; }
        }
        if (found || i >= total) break;
      }
      var dt = performance.now() - t0;
      elapsed += dt;
      checked = i;
      if (elapsed > 200) rate = checked / (elapsed / 1000);
      paintGrid();
      bar.style.width = (100 * checked / total) + '%';
      var msg = 'Checked ' + fmtInt(checked) + ' of ' + fmtInt(total) + ' splits in ' + fmtDuration(elapsed / 1000) +
        (rate ? ' (' + fmtInt(rate) + ' per second)' : '') + '.';
      if (found) {
        status.style.color = OK;
        var sa = 0, sb = 0;
        weights.forEach(function (x, j) { if (inA[j]) sa += x; else sb += x; });
        status.textContent = msg + ' Found an equal split (' + sa + ' = ' + sb + ', shown above). ' +
          'We got lucky. If no equal split existed, brute force would have had to check all ' + fmtInt(total) + '.';
        finish();
      } else if (checked >= total) {
        status.style.color = BAD;
        status.textContent = msg + ' No equal split exists, and the brute-force search had to check all 2^' + n + ' splits to be sure.';
        finish();
      } else {
        status.textContent = msg;
        rafId = requestAnimationFrame(frame);
      }
    }

    function finish() {
      running = false;
      rafId = null;
      runBtn.textContent = 'Run again with new numbers';
      renderProjection();
    }

    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (running) {
        running = false;
        runBtn.textContent = 'Resume';
        renderProjection();
      }
    }

    runBtn.addEventListener('click', function () {
      if (running) { stop(); return; }
      if (found || (checked >= total && total > 0)) { regenerate(); reset(); }
      running = true;
      runBtn.textContent = 'Pause';
      status.style.color = '';
      rafId = requestAnimationFrame(frame);
    });
    plusBtn.addEventListener('click', function () {
      if (n >= MAX_N) return;
      n++; weights.push(newWeight()); reset();
    });
    minusBtn.addEventListener('click', function () {
      if (n <= MIN_N) return;
      n--; weights.pop(); reset();
    });

    reset();
  }

  /* ------------------------------------------------------------------ */
  /* Graph 3-coloring puzzle                                              */
  /* ------------------------------------------------------------------ */

  var NODE_COLORS = [null, '#d62728', '#2ca02c', '#1f77b4'];
  var NODE_LETTERS = ['', 'R', 'G', 'B'];
  var CONFLICT = '#e67e00';
  var SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function segmentsCross(a, b, c, d) {
    function orient(p, q, r) { return (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x); }
    if (a === c || a === d || b === c || b === d) return false; // shared endpoint
    var o1 = orient(a, b, c), o2 = orient(a, b, d), o3 = orient(c, d, a), o4 = orient(c, d, b);
    return (o1 > 0) !== (o2 > 0) && (o3 > 0) !== (o4 > 0);
  }

  /* Builds a readable planar-looking graph on a jittered grid, adding short
   * non-crossing edges.
   *   free = false: every node gets a hidden color and edges only join
   *                 different hidden colors, so a 3-coloring always exists.
   *   free = true:  edges are added in random order until the average degree
   *                 reaches about 3.5.  Around that density roughly half of
   *                 these graphs have no valid 3-coloring at all. */
  function makeGraph(n, W, H, R, free) {
    var cols = Math.ceil(Math.sqrt(n * W / H)), rows = Math.ceil(n / cols);
    var cw = W / cols, ch = H / rows, nodes = [], cellsUsed = [];
    for (var c = 0; c < rows * cols; c++) cellsUsed.push(c);
    cellsUsed.sort(function () { return Math.random() - 0.5; });
    // Balanced hidden colors give more edges between differently colored nodes.
    var hidden = [];
    for (var h = 0; h < n; h++) hidden.push(1 + (h % 3));
    hidden.sort(function () { return Math.random() - 0.5; });
    for (var i = 0; i < n; i++) {
      var cell = cellsUsed[i], r = Math.floor(cell / cols), cc = cell % cols;
      nodes.push({ x: (cc + 0.5) * cw + (Math.random() - 0.5) * cw * 0.5,
                   y: (r + 0.5) * ch + (Math.random() - 0.5) * ch * 0.5,
                   hidden: hidden[i], color: 0 });
    }
    var cand = [];
    for (i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
      var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
      cand.push({ a: i, b: j, len: Math.sqrt(dx * dx + dy * dy) });
    }
    if (free) cand.sort(function () { return Math.random() - 0.5; });
    else cand.sort(function (p, q) { return p.len - q.len; });
    var maxLen = 2.8 * Math.max(cw, ch), edges = [], maxEdges = Math.round(FREE_DEGREE * n / 2);
    cand.forEach(function (e) {
      if (e.len > maxLen) return;
      if (free ? edges.length >= maxEdges : nodes[e.a].hidden === nodes[e.b].hidden) return;
      for (var k = 0; k < edges.length; k++) {
        if (segmentsCross(nodes[e.a], nodes[e.b], nodes[edges[k].a], nodes[edges[k].b])) return;
      }
      // keep edges from passing too close to a third node
      for (k = 0; k < n; k++) {
        if (k === e.a || k === e.b) continue;
        var A = nodes[e.a], B = nodes[e.b], P = nodes[k];
        var t = ((P.x - A.x) * (B.x - A.x) + (P.y - A.y) * (B.y - A.y)) / (e.len * e.len);
        if (t <= 0 || t >= 1) continue;
        var px = A.x + t * (B.x - A.x) - P.x, py = A.y + t * (B.y - A.y) - P.y;
        if (px * px + py * py < (R + 6) * (R + 6)) return;
      }
      edges.push(e);
    });
    var adj = nodes.map(function () { return []; });
    edges.forEach(function (e) { adj[e.a].push(e.b); adj[e.b].push(e.a); });
    return { nodes: nodes, edges: edges, adj: adj };
  }

  var FREE_DEGREE = 3.5;

  /* Smart exact solver (most-constrained node first, then backtrack).
   * Returns an array of colors 1..3, or null if no 3-coloring exists. */
  function solveColoring(g) {
    var n = g.nodes.length, adj = g.adj, col = [];
    for (var i = 0; i < n; i++) col.push(0);
    function rec(left) {
      if (!left) return true;
      var best = -1, bs = -1, bd = -1;
      for (var v = 0; v < n; v++) {
        if (col[v]) continue;
        var seen = [false, false, false, false], s = 0;
        adj[v].forEach(function (u) { if (col[u] && !seen[col[u]]) { seen[col[u]] = true; s++; } });
        if (s > bs || (s === bs && adj[v].length > bd)) { best = v; bs = s; bd = adj[v].length; }
      }
      for (var c = 1; c <= 3; c++) {
        if (adj[best].some(function (u) { return col[u] === c; })) continue;
        col[best] = c;
        if (rec(left - 1)) return true;
      }
      col[best] = 0;
      return false;
    }
    return rec(n) ? col : null;
  }

  function initColoring(root) {
    var sizes = [12, 20, 30, 40];
    var n = parseInt(root.getAttribute('data-nodes'), 10) || 20;
    var free = root.getAttribute('data-mode') === 'maybe';
    var W = 600, H, g, startTime, timerId, solved;
    var running = false, rafId = null, bt = null, rate = null;

    root.style.maxWidth = '640px';
    root.style.margin = '1em 0';

    html('p', { style: 'font-size:0.85em;margin:0 0 0.5em' }, root,
      'Click a circle to cycle its color: red → green → blue → blank. Color every circle so that no line connects two circles of the same color. Conflicting lines are drawn thick and orange.');

    function toggleRow(label, opts, isOn, onPick) {
      var row = html('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-bottom:4px' }, root);
      html('span', { style: 'font-size:0.85em;margin-right:4px' }, row, label);
      var btns = opts.map(function (o) {
        var b = btn(row, o[1], isOn(o[0]));
        b.addEventListener('click', function () {
          onPick(o[0]);
          btns.forEach(function (x, k) { x.className = 'btn btn--small ' + (isOn(opts[k][0]) ? 'btn--primary' : 'btn--inverse'); });
          newGraph();
        });
        return b;
      });
    }
    toggleRow('Size:', sizes.map(function (s) { return [s, s + ' nodes']; }),
      function (v) { return v === n; }, function (v) { n = v; });
    toggleRow('Graphs:', [[false, 'Always solvable'], [true, 'Might be impossible']],
      function (v) { return v === free; }, function (v) { free = v; });

    var controls = html('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:4px' }, root);
    var newBtn = btn(controls, 'New graph');
    var clearBtn = btn(controls, 'Clear');
    var giveUpBtn = btn(controls, 'Show a solution');
    var runBtn = btn(controls, 'Let the computer try', true);

    var svg = svgEl('svg', { viewBox: '0 0 ' + W + ' 360', width: '100%', role: 'img', 'aria-label': 'Graph coloring puzzle',
                             style: 'max-width:600px;display:block;background:#fff;border-radius:4px;margin-top:8px;user-select:none' }, root);
    var status = html('div', { style: 'font-size:0.9em;min-height:1.5em;margin:6px 0 2px', 'aria-live': 'polite' }, root);
    var solverOut = html('div', { style: 'font-size:0.85em;min-height:1.5em', 'aria-live': 'polite' }, root);
    var edgeEls = [], nodeEls = [];

    function conflicts() {
      return g.edges.filter(function (e) {
        var ca = g.nodes[e.a].color, cb = g.nodes[e.b].color;
        return ca && ca === cb;
      });
    }

    function paint() {
      var bad = conflicts();
      g.edges.forEach(function (e, k) {
        var isBad = bad.indexOf(e) >= 0;
        edgeEls[k].setAttribute('stroke', isBad ? CONFLICT : '#999');
        edgeEls[k].setAttribute('stroke-width', isBad ? 5 : 2);
      });
      g.nodes.forEach(function (v, k) {
        nodeEls[k].circle.setAttribute('fill', NODE_COLORS[v.color] || '#fff');
        nodeEls[k].label.textContent = NODE_LETTERS[v.color];
      });
      return bad;
    }

    function render() {
      var bad = paint();
      var colored = g.nodes.filter(function (v) { return v.color; }).length;
      if (!solved && colored === g.nodes.length && bad.length === 0) {
        solved = true;
        clearInterval(timerId);
        status.style.color = OK;
        status.textContent = '✓ Valid 3-coloring' + (startTime ? ' found in ' + fmtClock(Date.now() - startTime) : '') +
          '! Checking it meant looking at each of the ' + g.edges.length + ' lines once.';
        return;
      }
      if (solved) return;
      status.style.color = '';
      status.textContent = (startTime ? '⏱ ' + fmtClock(Date.now() - startTime) + '   ·   ' : '') +
        'colored: ' + colored + ' / ' + g.nodes.length + '   ·   conflicts: ' + bad.length +
        '   ·   brute force would try up to 3^' + g.nodes.length + (g.nodes.length > 30 ? ' ' : ' = ') +
        fmtBigCount(Math.pow(3, g.nodes.length)) + ' colorings';
    }

    function cycle(k) {
      if (solved || running) return;
      if (!startTime) { startTime = Date.now(); timerId = setInterval(render, 500); }
      g.nodes[k].color = (g.nodes[k].color + 1) % 4;
      render();
    }

    /* ---- naive backtracking demo: nodes in a fixed order, colors tried 1,2,3 ---- */

    function stopSolver(label) {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      running = false;
      runBtn.textContent = label || 'Let the computer try';
    }

    function solverFrame() {
      var t0 = performance.now(), nn = g.nodes.length, adj = g.adj, col = bt.col, done = false;
      while (!done && performance.now() - t0 < 30) {
        for (var it = 0; it < 20000; it++) {
          var i = bt.i;
          if (i < 0 || i >= nn) { done = true; break; }
          col[i]++;
          if (col[i] > 3) { col[i] = 0; bt.i--; continue; }
          bt.steps++;
          var ok = true, a = adj[i];
          for (var k = 0; k < a.length; k++) if (a[k] < i && col[a[k]] === col[i]) { ok = false; break; }
          if (ok) bt.i++;
        }
      }
      bt.elapsed += performance.now() - t0;
      if (bt.elapsed > 50) rate = bt.steps / (bt.elapsed / 1000);
      g.nodes.forEach(function (v, k) { v.color = col[k]; });
      paint();
      var msg = 'Backtracking search: tried ' + fmtInt(bt.steps) + ' color assignments in ' + fmtDuration(bt.elapsed / 1000) +
        (rate ? ' (' + fmtInt(rate) + ' per second)' : '') + '.';
      if (done) {
        stopSolver('Run again');
        if (bt.i >= nn) {
          solverOut.style.color = OK;
          solverOut.textContent = msg + ' Found a valid 3-coloring.';
          solved = true;
          status.style.color = OK;
          status.textContent = '✓ The computer found a valid 3-coloring.';
        } else {
          solverOut.style.color = BAD;
          solverOut.textContent = msg + ' It exhausted every possibility: this graph has no valid 3-coloring.';
        }
        return;
      }
      solverOut.style.color = '';
      solverOut.textContent = msg + ' Still searching…';
      rafId = requestAnimationFrame(solverFrame);
    }

    runBtn.addEventListener('click', function () {
      if (running) { stopSolver('Resume'); return; }
      if (!bt || bt.i < 0 || bt.i >= g.nodes.length) {
        bt = { col: g.nodes.map(function () { return 0; }), i: 0, steps: 0, elapsed: 0 };
      }
      clearInterval(timerId); startTime = null; solved = false;
      running = true;
      runBtn.textContent = 'Pause';
      rafId = requestAnimationFrame(solverFrame);
    });

    function newGraph() {
      stopSolver();
      bt = null;
      clearInterval(timerId);
      startTime = null; solved = false;
      H = n > 20 ? 480 : 360;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      var R = n > 25 ? 12 : n > 14 ? 14 : 17;
      if (free) {
        g = makeGraph(n, W, H, R, true);
      } else {
        // Keep the candidate with the fewest low-degree nodes (degree <= 2 nodes are easy to color last).
        var best = null, bestScore = Infinity;
        for (var t = 0; t < 25; t++) {
          var cand = makeGraph(n, W, H, R, false);
          var score = cand.adj.filter(function (a) { return a.length <= 2; }).length * 10 - cand.edges.length;
          if (score < bestScore) { best = cand; bestScore = score; }
        }
        g = best;
      }
      g.solution = solveColoring(g);
      svg.innerHTML = '';
      edgeEls = g.edges.map(function (e) {
        return svgEl('line', { x1: g.nodes[e.a].x, y1: g.nodes[e.a].y, x2: g.nodes[e.b].x, y2: g.nodes[e.b].y,
                               stroke: '#999', 'stroke-width': 2, 'stroke-linecap': 'round' }, svg);
      });
      nodeEls = g.nodes.map(function (v, k) {
        var grp = svgEl('g', { tabindex: 0, role: 'button', 'aria-label': 'Node ' + (k + 1), style: 'cursor:pointer;outline:none' }, svg);
        var circle = svgEl('circle', { cx: v.x, cy: v.y, r: R, stroke: '#333', 'stroke-width': 2, fill: '#fff' }, grp);
        var label = svgEl('text', { x: v.x, y: v.y + 5, 'text-anchor': 'middle', 'font-size': R > 12 ? 14 : 12, 'font-weight': 700,
                                    fill: '#fff', 'pointer-events': 'none' }, grp);
        grp.addEventListener('click', function () { cycle(k); });
        grp.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); cycle(k); }
        });
        return { circle: circle, label: label };
      });
      solverOut.style.color = '';
      solverOut.textContent = free ? 'This graph might not have any valid 3-coloring. Can you tell?' : '';
      render();
    }

    clearBtn.addEventListener('click', function () {
      stopSolver(); bt = null;
      clearInterval(timerId); startTime = null; solved = false;
      g.nodes.forEach(function (v) { v.color = 0; });
      solverOut.textContent = '';
      render();
    });
    newBtn.addEventListener('click', newGraph);
    giveUpBtn.addEventListener('click', function () {
      stopSolver(); bt = null;
      clearInterval(timerId); startTime = null; solved = false;
      if (!g.solution) {
        g.nodes.forEach(function (v) { v.color = 0; });
        render();
        solverOut.style.color = BAD;
        solverOut.textContent = 'There is no solution: this graph has no valid 3-coloring. (A smarter backtracking solver proved it.)';
        return;
      }
      g.nodes.forEach(function (v, k) { v.color = g.solution[k]; });
      solverOut.textContent = '';
      render();
    });

    newGraph();
  }

  /* ------------------------------------------------------------------ */
  /* Multiplying is easy, factoring is hard                               */
  /* ------------------------------------------------------------------ */

  function isPrime(x) {
    if (x < 2) return false;
    if (x % 2 === 0) return x === 2;
    for (var d = 3; d * d <= x; d += 2) if (x % d === 0) return false;
    return true;
  }

  function randomPrime(digits) { // digits <= 15 so everything stays exact as a Number
    var lo = Math.pow(10, digits - 1), hi = Math.pow(10, digits) - 1, p;
    do { p = randInt(lo, hi); if (p % 2 === 0) p += 1; } while (p > hi || !isPrime(p));
    return p;
  }

  function fmtBig(x) { return x.toLocaleString('en-US'); } // works for Number and BigInt

  function initFactoring(root) {
    var digitOpts = [3, 5, 7, 8, 9, 10, 11, 12]; // digits per prime; N is a BigInt
    var pd = parseInt(root.getAttribute('data-digits'), 10) || 7;
    var limit;
    var p, q, N, running = false, rafId = null, d, checked, elapsed, rate = null, frames = 0;

    root.style.maxWidth = '680px';
    root.style.margin = '1em 0';

    var controls = html('div', { style: 'display:flex;flex-wrap:wrap;align-items:center;gap:4px' }, root);
    html('span', { style: 'font-size:0.85em;margin-right:4px' }, controls, 'Size of each secret prime:');
    var digitBtns = digitOpts.map(function (k) {
      var b = btn(controls, k + ' digits', k === pd);
      b.addEventListener('click', function () { pd = k; digitBtns.forEach(function (x, j) {
        x.className = 'btn btn--small ' + (digitOpts[j] === pd ? 'btn--primary' : 'btn--inverse'); }); newNumbers(); });
      return b;
    });

    html('h4', { style: 'margin:1em 0 0.25em' }, root, 'The easy direction: multiply');
    var mulRow = html('div', { style: 'font-family:monospace;font-size:1em' }, root);
    var mulBtn = btn(root, 'Multiply them', true);
    var mulOut = html('div', { style: 'font-size:0.85em;min-height:1.4em;margin-top:4px' }, root);

    html('h4', { style: 'margin:1em 0 0.25em' }, root, 'The hard direction: factor');
    var factorRow = html('div', { style: 'font-family:monospace;font-size:1em;margin-bottom:6px' }, root);
    var guessRow = html('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;align-items:center' }, root);
    var guessIn = html('input', { type: 'text', inputmode: 'numeric', placeholder: 'Guess a factor',
                                  style: 'width:12em;padding:4px 6px;font-size:0.9em' }, guessRow);
    var guessBtn = btn(guessRow, 'Check my guess');
    var guessOut = html('div', { style: 'font-size:0.85em;min-height:1.4em;margin-top:4px', 'aria-live': 'polite' }, root);
    var runBtn = btn(root, 'Let the computer try (trial division)', true);
    var runOut = html('div', { style: 'font-size:0.85em;min-height:2.8em;margin-top:4px', 'aria-live': 'polite' }, root);

    html('div', { style: 'font-weight:600;font-size:0.9em;margin-top:10px' }, root, 'How long would trial division take on bigger numbers?');
    var proj = html('table', { style: 'font-size:0.85em;margin-top:4px' }, root);

    function newNumbers() {
      stop();
      p = randomPrime(pd);
      do { q = randomPrime(pd); } while (q === p);
      N = BigInt(p) * BigInt(q);
      limit = BigInt(Math.ceil(Math.sqrt(Number(N)))) + 2n;
      mulRow.textContent = fmtInt(p) + ' × ' + fmtInt(q) + ' = ?';
      mulOut.textContent = '';
      factorRow.textContent = fmtBig(N) + ' = ? × ?';
      guessIn.value = '';
      guessOut.textContent = '';
      d = 3n; checked = 0; elapsed = 0;
      runBtn.textContent = 'Let the computer try (trial division)';
      runOut.style.color = '';
      runOut.textContent = 'Trial division tries 2, 3, 5, 7, 9, … up to √N ≈ ' + fmtBig(limit - 2n) + '.';
      renderProjection();
    }

    function renderProjection() {
      var r = rate || 1e8;
      proj.innerHTML = '';
      var head = html('tr', {}, proj);
      html('th', { style: 'text-align:left;padding-right:1.5em' }, head, 'digits in N');
      html('th', { style: 'text-align:left' }, head, rate ? 'time at your browser\'s ' + fmtInt(r) + ' divisions/sec'
                                                          : 'time at 100,000,000 divisions/sec (run once to measure yours)');
      var digitsN = N.toString().length;
      [[digitsN, 'this puzzle'], [30, ''], [100, ''], [617, 'size of an RSA-2048 key']].forEach(function (row) {
        var tr = html('tr', {}, proj);
        html('td', { style: 'padding-right:1.5em' + (row[1] === 'this puzzle' ? ';font-weight:600' : '') }, tr,
             row[0] + (row[1] ? ' (' + row[1] + ')' : ''));
        // about sqrt(10^digits) / 2 odd divisors to try
        html('td', {}, tr, fmtDurationLog(row[0] / 2 - Math.log10(2) - Math.log10(r)));
      });
      var note = html('tr', {}, proj);
      html('td', { colspan: 2, style: 'font-size:0.9em;opacity:0.75;padding-top:4px' }, note,
        'Cleverer factoring algorithms are far faster than trial division, but no known algorithm runs in polynomial time on a regular computer, and RSA-2048 has never been factored.');
    }

    mulBtn.addEventListener('click', function () {
      mulOut.style.color = OK;
      mulOut.textContent = fmtInt(p) + ' × ' + fmtInt(q) + ' = ' + fmtBig(N) +
        '. Instant: schoolbook multiplication takes O(digits²) steps.';
    });

    guessBtn.addEventListener('click', function () {
      var gs = guessIn.value.replace(/[,\s]/g, '');
      var gv = /^\d+$/.test(gs) ? BigInt(gs) : 0n;
      if (gv < 2n || gv >= N) {
        guessOut.style.color = BAD; guessOut.textContent = 'Enter a whole number between 2 and ' + fmtBig(N - 1n) + '.'; return;
      }
      if (N % gv === 0n) {
        guessOut.style.color = OK;
        guessOut.textContent = '✓ ' + fmtBig(N) + ' = ' + fmtBig(gv) + ' × ' + fmtBig(N / gv) + '. Verifying took one division.';
      } else {
        guessOut.style.color = BAD;
        guessOut.textContent = '✗ ' + fmtBig(gv) + ' does not divide ' + fmtBig(N) + ' (remainder ' + fmtBig(N % gv) + '). Verifying took one division.';
      }
    });

    function frame() {
      var t0 = performance.now(), done = false;
      if (checked === 0) { checked = 1; if (N % 2n === 0n) { d = 2n; done = true; } }
      while (!done && performance.now() - t0 < 30) {
        var end = d + 2n * 16384n;
        if (end > limit) end = limit;
        for (; d < end; d += 2n) { checked++; if (N % d === 0n) { done = true; break; } }
        if (d >= limit) break;
      }
      elapsed += performance.now() - t0;
      if (elapsed > 5) rate = checked / (elapsed / 1000);
      if (++frames % 30 === 0) renderProjection();
      var msg = 'Tried ' + fmtInt(checked) + ' divisors in ' + fmtDuration(elapsed / 1000) +
        (rate ? ' (' + fmtInt(rate) + ' per second)' : '') + '.';
      if (done) {
        runOut.style.color = OK;
        runOut.textContent = msg + ' Found it: ' + fmtBig(N) + ' = ' + fmtBig(d) + ' × ' + fmtBig(N / d) + '.';
        finish();
      } else {
        var left = Number(limit - d) / 2 / (rate || 1e7);
        runOut.textContent = msg + ' Currently trying ' + fmtBig(d) + ' (worst case about ' + fmtDuration(Math.max(left, 0)) + ' to go).';
        rafId = requestAnimationFrame(frame);
      }
    }

    function finish() { running = false; rafId = null; runBtn.textContent = 'Let the computer try (trial division)'; renderProjection(); }
    function stop() {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
      if (running) { running = false; runBtn.textContent = 'Resume'; renderProjection(); }
    }

    runBtn.addEventListener('click', function () {
      if (running) { stop(); return; }
      if (runOut.style.color) { d = 3n; checked = 0; elapsed = 0; runOut.style.color = ''; }
      running = true;
      runBtn.textContent = 'Pause';
      rafId = requestAnimationFrame(frame);
    });

    newNumbers();
  }

  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('.partition-race'), initRace);
    Array.prototype.forEach.call(document.querySelectorAll('.partition-bruteforce'), initBrute);
    Array.prototype.forEach.call(document.querySelectorAll('.graph-coloring'), initColoring);
    Array.prototype.forEach.call(document.querySelectorAll('.factoring-race'), initFactoring);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
