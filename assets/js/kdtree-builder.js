/*
 * Interactive k-d tree builder.
 *
 * Usage:
 *   <div class="kdtree-builder" data-points='{"x1":[1,5],"x2":[-1,2]}'
 *        data-range="-5,10"></div>
 *   <script src="/assets/js/kdtree-builder.js"></script>
 *
 * Students move the mouse over a region to preview a splitting line, then
 * click (or drag and release) to commit it. Points with a value less than the
 * split go to the left ("yes") child; points greater than or equal go to the
 * right ("no") child. A button renders the resulting decision tree.
 */
(function () {
  'use strict';

  var SVGNS = 'http://www.w3.org/2000/svg';
  var SNAP = 0.5;
  var DIM_COLORS = ['#d62728', '#1f77b4'];
  var WARN_COLOR = '#e67e00';

  function svg(tag, attrs, parent) {
    var e = document.createElementNS(SVGNS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function html(tag, attrs, parent, text) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }

  function subscript(name) {
    var subs = '₀₁₂₃₄₅₆₇₈₉';
    return name.replace(/\d/g, function (d) { return subs[+d]; });
  }

  // Write "x12" as x with a real SVG subscript (unicode subscripts render tiny).
  function setSubLabel(textEl, name, size) {
    var m = /^(\D*)(\d*)$/.exec(name);
    textEl.appendChild(document.createTextNode(m[1]));
    if (m[2]) {
      var t = svg('tspan', { 'font-size': Math.round(size * 0.75), dy: Math.round(size * 0.3) }, textEl);
      t.textContent = m[2];
    }
  }

  function fmt(v) {
    var s = (Math.round(v * 100) / 100).toString();
    return s.replace('-', '−');
  }

  // The partition a median split produces: points < median go left.
  function medianPartition(pts, dim) {
    var vals = pts.map(function (p) { return p.x[dim]; }).sort(function (a, b) { return a - b; });
    var n = vals.length, mid = Math.floor(n / 2);
    var median = n % 2 ? vals[mid] : (vals[mid - 1] + vals[mid]) / 2;
    return pts.filter(function (p) { return p.x[dim] < median; }).length;
  }

  function mount(root) {
    var raw = JSON.parse(root.getAttribute('data-points'));
    var range = (root.getAttribute('data-range') || '-5,10').split(',').map(Number);
    var LO = range[0], HI = range[1];

    var points = Object.keys(raw).map(function (name) {
      return { name: name, label: subscript(name), x: raw[name] };
    });

    // ---- Tree state -------------------------------------------------------
    var nextId = 0;
    function makeLeaf(pts, lo, hi, depth) {
      return { id: nextId++, pts: pts, lo: lo, hi: hi, depth: depth,
               dim: null, value: null, left: null, right: null, isMedian: true };
    }
    var tree, history;
    function reset() {
      nextId = 0;
      tree = makeLeaf(points.slice(), [LO, LO], [HI, HI], 0);
      history = [];
    }
    reset();

    function leaves(node, out) {
      out = out || [];
      if (!node.left) out.push(node);
      else { leaves(node.left, out); leaves(node.right, out); }
      return out;
    }
    function leafAt(x) {
      var n = tree;
      while (n.left) n = x[n.dim] < n.value ? n.left : n.right;
      return n;
    }

    // ---- UI scaffold ------------------------------------------------------
    root.innerHTML = '';
    root.style.maxWidth = '640px';

    var controls = html('div', { style: 'display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0' }, root);
    var undoBtn = html('button', { type: 'button', class: 'btn btn--small btn--inverse' }, controls, 'Undo');
    var resetBtn = html('button', { type: 'button', class: 'btn btn--small btn--inverse' }, controls, 'Reset');
    var rotateBtn = html('button', { type: 'button', class: 'btn btn--small btn--inverse' }, controls, 'Rotate line (R)');
    var modeLabel = html('label', { style: 'font-size:0.8em;display:flex;align-items:center;gap:4px;margin-left:4px' }, controls);
    var modeBox = html('input', { type: 'checkbox' }, modeLabel);
    modeLabel.appendChild(document.createTextNode('Choose split axis myself'));

    var status = html('div', { style: 'font-size:0.85em;min-height:2.6em;margin:4px 0', 'aria-live': 'polite' }, root);

    var S = 600, M = 46, W = S - 2 * M;
    var plot = svg('svg', { viewBox: '0 0 ' + S + ' ' + S, width: '100%',
                            style: 'max-width:600px;display:block;background:#fff;touch-action:none;cursor:crosshair;outline:none;user-select:none;border-radius:4px' }, root);
    plot.setAttribute('tabindex', '0');
    plot.setAttribute('aria-label', 'k-d tree construction plot');

    var treeBtn = html('button', { type: 'button', class: 'btn btn--small btn--primary', style: 'margin-top:10px' }, root, 'Show decision tree');
    var treeWrap = html('div', { style: 'display:none;margin-top:8px;overflow-x:auto;background:#fff;border-radius:4px' }, root);

    function sx(v) { return M + (v - LO) / (HI - LO) * W; }
    function sy(v) { return M + (HI - v) / (HI - LO) * W; }
    function toData(evt) {
      var r = plot.getBoundingClientRect();
      var px = (evt.clientX - r.left) / r.width * S;
      var py = (evt.clientY - r.top) / r.height * S;
      return [LO + (px - M) / W * (HI - LO), HI - (py - M) / W * (HI - LO)];
    }

    // Region fills sit below the grid so the grid stays visible.
    var regionLayer = svg('g', {}, plot);
    // Static background: grid, axes, ticks.
    var bg = svg('g', {}, plot);
    for (var t = LO; t <= HI; t++) {
      var major = t === 0;
      svg('line', { x1: sx(t), x2: sx(t), y1: sy(LO), y2: sy(HI), stroke: major ? '#999' : '#eee', 'stroke-width': major ? 1.2 : 1 }, bg);
      svg('line', { y1: sy(t), y2: sy(t), x1: sx(LO), x2: sx(HI), stroke: major ? '#999' : '#eee', 'stroke-width': major ? 1.2 : 1 }, bg);
      svg('text', { x: sx(t), y: sy(LO) + 16, 'text-anchor': 'middle', 'font-size': 11, fill: '#555' }, bg).textContent = fmt(t);
      svg('text', { x: sx(LO) - 6, y: sy(t) + 4, 'text-anchor': 'end', 'font-size': 11, fill: '#555' }, bg).textContent = fmt(t);
    }
    svg('text', { x: S / 2, y: S - 8, 'text-anchor': 'middle', 'font-size': 13, fill: DIM_COLORS[0] }, bg).textContent = 'dimension 0';
    var yl = svg('text', { x: 14, y: S / 2, 'text-anchor': 'middle', 'font-size': 13, fill: DIM_COLORS[1],
                           transform: 'rotate(-90 14 ' + S / 2 + ')' }, bg);
    yl.textContent = 'dimension 1';

    var splitLayer = svg('g', {}, plot);
    var pointLayer = svg('g', {}, plot);
    var previewLayer = svg('g', { 'pointer-events': 'none' }, plot);
    svg('rect', { x: M, y: M, width: W, height: W, fill: 'none', stroke: '#666' }, plot);

    // ---- Interaction state -----------------------------------------------
    var hoverLeaf = null;     // leaf under the pointer (or being dragged in)
    var dragLeaf = null;      // leaf locked while dragging
    var preview = null;       // {leaf, dim, value}
    var highlight = null;     // node highlighted from the tree view
    var manualDim = 0;
    var message = null;       // transient feedback after a split

    function splitDim(leaf) {
      return modeBox.checked ? manualDim : leaf.depth % 2;
    }

    function computePreview(leaf, x) {
      if (!leaf || leaf.pts.length < 2) return null;
      var dim = splitDim(leaf);
      var v = Math.round(x[dim] / SNAP) * SNAP;
      v = Math.max(leaf.lo[dim] + SNAP, Math.min(leaf.hi[dim] - SNAP, v));
      return { leaf: leaf, dim: dim, value: v };
    }

    function inPlot(x) { return x[0] >= LO && x[0] <= HI && x[1] >= LO && x[1] <= HI; }

    function onMove(evt) {
      var x = toData(evt);
      if (dragLeaf) {
        preview = computePreview(dragLeaf, x);
      } else if (inPlot(x)) {
        hoverLeaf = leafAt(x);
        preview = computePreview(hoverLeaf, x);
      } else {
        hoverLeaf = null; preview = null;
      }
      render();
    }

    plot.addEventListener('pointermove', onMove);
    plot.addEventListener('pointerdown', function (evt) {
      var x = toData(evt);
      if (!inPlot(x)) return;
      var leaf = leafAt(x);
      if (leaf.pts.length < 2) {
        message = { text: 'That region only has one point, so it is a leaf. Pick a region with two or more points.', warn: false };
        render();
        return;
      }
      dragLeaf = leaf; hoverLeaf = leaf;
      try { plot.setPointerCapture(evt.pointerId); } catch (e) { /* inactive pointer */ }
      preview = computePreview(leaf, x);
      evt.preventDefault();
      render();
    });
    plot.addEventListener('pointerup', function (evt) {
      if (!dragLeaf) return;
      try { if (plot.hasPointerCapture(evt.pointerId)) plot.releasePointerCapture(evt.pointerId); } catch (e) { /* ignore */ }
      var p = preview;
      dragLeaf = null;
      if (p) commit(p);
      onMove(evt);
    });
    plot.addEventListener('pointercancel', function () { dragLeaf = null; preview = null; render(); });
    plot.addEventListener('pointerleave', function () {
      if (dragLeaf) return;
      hoverLeaf = null; preview = null; render();
    });

    function commit(p) {
      var leaf = p.leaf, dim = p.dim, v = p.value;
      var L = leaf.pts.filter(function (q) { return q.x[dim] < v; });
      var R = leaf.pts.filter(function (q) { return q.x[dim] >= v; });
      if (!L.length || !R.length) {
        message = { text: 'That line leaves one side empty. A split has to put at least one point on each side.', warn: true };
        return;
      }
      var hiL = leaf.hi.slice(); hiL[dim] = v;
      var loR = leaf.lo.slice(); loR[dim] = v;
      leaf.dim = dim;
      leaf.value = v;
      leaf.isMedian = L.length === medianPartition(leaf.pts, dim) && dim === leaf.depth % 2;
      leaf.left = makeLeaf(L, leaf.lo.slice(), hiL, leaf.depth + 1);
      leaf.right = makeLeaf(R, loR, leaf.hi.slice(), leaf.depth + 1);
      history.push(leaf);

      if (leaf.isMedian) {
        message = { text: '✓ Median split on dimension ' + dim + ' at ' + fmt(v) + ': ' + L.length + ' point(s) go left (<), ' + R.length + ' go right (≥).', warn: false };
      } else if (dim !== leaf.depth % 2) {
        message = { text: 'Split recorded, but the k-d tree rule would split this region (depth ' + leaf.depth + ') on dimension ' + (leaf.depth % 2) + '.', warn: true };
      } else {
        message = { text: 'Split recorded, but it is not at the median: ' + L.length + ' left / ' + R.length + ' right. A median split would put ' +
                    medianPartition(leaf.pts, dim) + ' on the left. (Undo to try again.)', warn: true };
      }
    }

    undoBtn.addEventListener('click', function () {
      var n = history.pop();
      if (n) { n.left = n.right = null; n.dim = n.value = null; n.isMedian = true; }
      message = null; highlight = null;
      render();
    });
    resetBtn.addEventListener('click', function () { reset(); message = null; highlight = null; render(); });
    function rotate() { manualDim = 1 - manualDim; if (!modeBox.checked) modeBox.checked = true; render(); }
    rotateBtn.addEventListener('click', rotate);
    modeBox.addEventListener('change', render);
    root.addEventListener('keydown', function (e) {
      if (e.key === 'r' || e.key === 'R') { rotate(); e.preventDefault(); }
    });
    // Make the R shortcut work while the pointer is over the plot.
    plot.addEventListener('pointerenter', function () { plot.focus({ preventScroll: true }); });

    var treeVisible = false;
    treeBtn.addEventListener('click', function () {
      treeVisible = !treeVisible;
      treeBtn.textContent = treeVisible ? 'Hide decision tree' : 'Show decision tree';
      treeWrap.style.display = treeVisible ? 'block' : 'none';
      render();
    });

    // ---- Rendering --------------------------------------------------------
    function clear(g) { while (g.firstChild) g.removeChild(g.firstChild); }

    function regionRect(n, attrs, parent) {
      var r = svg('rect', { x: sx(n.lo[0]), y: sy(n.hi[1]), width: sx(n.hi[0]) - sx(n.lo[0]),
                            height: sy(n.lo[1]) - sy(n.hi[1]) }, parent);
      for (var k in attrs) r.setAttribute(k, attrs[k]);
      return r;
    }

    function splitSegment(n) {
      if (n.dim === 0) return [sx(n.value), sy(n.lo[1]), sx(n.value), sy(n.hi[1])];
      return [sx(n.lo[0]), sy(n.value), sx(n.hi[0]), sy(n.value)];
    }

    function badge(parent, x, y, text, color) {
      var g = svg('g', {}, parent);
      var w = text.length * 6.6 + 10;
      svg('rect', { x: x - w / 2, y: y - 10, width: w, height: 18, rx: 4, fill: '#fff', stroke: color, 'stroke-width': 1, opacity: 0.95 }, g);
      svg('text', { x: x, y: y + 3, 'text-anchor': 'middle', 'font-size': 11, fill: color, 'font-weight': 600 }, g).textContent = text;
    }

    function render() {
      renderPlot();
      if (treeVisible) renderTree();
    }

    function renderPlot() {
      clear(regionLayer); clear(splitLayer); clear(pointLayer); clear(previewLayer);

      var ls = leaves(tree);
      var active = dragLeaf || hoverLeaf;
      ls.forEach(function (n) {
        var fill = n.pts.length === 1 ? '#eaf7ea' : (n === active ? '#fff7d6' : '#ffffff');
        regionRect(n, { fill: fill, opacity: 0.9 }, regionLayer);
      });
      if (highlight) {
        regionRect(highlight, { fill: '#ffd54f', opacity: 0.35, stroke: '#c79a00', 'stroke-width': 3 }, regionLayer);
      }

      (function walk(n) {
        if (!n.left) return;
        var s = splitSegment(n);
        var color = n.isMedian ? DIM_COLORS[n.dim] : WARN_COLOR;
        var attrs = { x1: s[0], y1: s[1], x2: s[2], y2: s[3], stroke: color, 'stroke-width': Math.max(1.5, 3.5 - n.depth * 0.6) };
        if (!n.isMedian) attrs['stroke-dasharray'] = '7 4';
        svg('line', attrs, splitLayer);
        walk(n.left); walk(n.right);
      })(tree);

      points.forEach(function (p) {
        var cx = sx(p.x[0]), cy = sy(p.x[1]);
        svg('circle', { cx: cx, cy: cy, r: 6, fill: '#1a3a8a', stroke: '#fff', 'stroke-width': 1.5 }, pointLayer);
        var lt = svg('text', { x: cx + 8, y: cy - 7, 'font-size': 13, fill: '#1a1a1a', 'font-weight': 600,
                      stroke: '#fff', 'stroke-width': 3, 'paint-order': 'stroke' }, pointLayer);
        setSubLabel(lt, p.name, 13);
      });

      if (preview) {
        var p = preview, n = p.leaf;
        var fake = { dim: p.dim, value: p.value, lo: n.lo, hi: n.hi };
        var s = splitSegment(fake);
        var color = DIM_COLORS[p.dim];
        svg('line', { x1: s[0], y1: s[1], x2: s[2], y2: s[3], stroke: color, 'stroke-width': 2.5, 'stroke-dasharray': '6 4' }, previewLayer);
        var nl = n.pts.filter(function (q) { return q.x[p.dim] < p.value; }).length;
        var nr = n.pts.length - nl;
        var midOther = (Math.max(n.lo[1 - p.dim], LO) + Math.min(n.hi[1 - p.dim], HI)) / 2;
        var lbl = 'dim ' + p.dim + ' = ' + fmt(p.value);
        if (p.dim === 0) {
          badge(previewLayer, sx(p.value), sy(n.hi[1]) + 14, lbl, color);
          badge(previewLayer, sx(p.value) - 34, sy(midOther), '< : ' + nl, color);
          badge(previewLayer, sx(p.value) + 34, sy(midOther), '≥ : ' + nr, color);
        } else {
          badge(previewLayer, sx(n.lo[0]) + 52, sy(p.value) - 14, lbl, color);
          badge(previewLayer, sx(midOther), sy(p.value) + 18, '< : ' + nl, color);
          badge(previewLayer, sx(midOther), sy(p.value) - 18, '≥ : ' + nr, color);
        }
      }

      // Status line
      var remaining = ls.filter(function (n) { return n.pts.length > 1; }).length;
      status.innerHTML = '';
      if (message) {
        html('div', { style: 'color:' + (message.warn ? '#a35400' : '#1e6b1e') + ';font-weight:600' }, status, message.text);
      }
      var info = remaining === 0
        ? 'Tree complete: every region holds exactly one point. Click "Show decision tree" to see the logic of your splits.'
        : remaining + ' region(s) still have more than one point. Hover over a region to preview a split, then click (or drag and release) to make it.' +
          (modeBox.checked ? ' Current axis: dimension ' + manualDim + '.' : ' The split axis alternates with depth.');
      html('div', { style: 'color:#444' }, status, info);
      undoBtn.disabled = history.length === 0;
      rotateBtn.style.display = modeBox.checked ? '' : 'none';
    }

    // ---- Decision tree ----------------------------------------------------
    function renderTree() {
      treeWrap.innerHTML = '';
      var SLOT = 84, LEVEL = 78, PAD = 24;
      var ls = leaves(tree);
      var maxDepth = 0;
      var pos = {};
      var slot = 0;
      (function layout(n) {
        maxDepth = Math.max(maxDepth, n.depth);
        if (!n.left) { pos[n.id] = PAD + slot * SLOT + SLOT / 2; slot++; return; }
        layout(n.left); layout(n.right);
        pos[n.id] = (pos[n.left.id] + pos[n.right.id]) / 2;
      })(tree);

      var widest = Math.max.apply(null, ls.map(function (n) { return n.pts.length; }));
      var width = Math.max(ls.length * SLOT + 2 * PAD, widest * 30 + 2 * PAD, 260);
      var height = (maxDepth + 1) * LEVEL + PAD;
      // Scale down to fit narrow columns, but never scale up past natural size.
      var t = svg('svg', { viewBox: '0 0 ' + width + ' ' + height, width: '100%',
                           style: 'display:block;margin:0 auto;font-family:inherit;max-width:' + width + 'px' }, treeWrap);
      // Center lone root if the canvas was widened.
      var shift = (width - (ls.length * SLOT + 2 * PAD)) / 2;
      function X(n) { return pos[n.id] + shift; }
      function Y(n) { return PAD + n.depth * LEVEL + 14; }

      var edges = svg('g', {}, t), nodes = svg('g', {}, t);

      (function draw(n) {
        var g = svg('g', { style: 'cursor:pointer' }, nodes);
        var isHL = highlight === n || (!highlight && (dragLeaf || hoverLeaf) === n);
        var x = X(n), y = Y(n);
        if (n.left) {
          [[n.left, 'yes (<)'], [n.right, 'no (≥)']].forEach(function (pair) {
            var c = pair[0];
            svg('line', { x1: x, y1: y + 14, x2: X(c), y2: Y(c) - 16, stroke: '#888', 'stroke-width': 1.5 }, edges);
            var mx = (x + X(c)) / 2, my = (y + 14 + Y(c) - 16) / 2;
            svg('text', { x: mx + (c === n.left ? -6 : 6), y: my, 'text-anchor': c === n.left ? 'end' : 'start',
                          'font-size': 11, fill: '#666' }, edges).textContent = pair[1];
          });
          var label = 'dim ' + n.dim + ' < ' + fmt(n.value) + ' ?';
          var w = label.length * 7.2 + 14;
          var color = n.isMedian ? DIM_COLORS[n.dim] : WARN_COLOR;
          svg('rect', { x: x - w / 2, y: y - 14, width: w, height: 28, rx: 6,
                        fill: isHL ? '#fff3c4' : '#fff', stroke: color, 'stroke-width': isHL ? 3 : 2,
                        'stroke-dasharray': n.isMedian ? '' : '6 3' }, g);
          svg('text', { x: x, y: y + 5, 'text-anchor': 'middle', 'font-size': 13, fill: color, 'font-weight': 600 }, g).textContent = label;
          draw(n.left); draw(n.right);
        } else {
          var done = n.pts.length === 1;
          var names = n.pts.map(function (p) { return p.label; }).join(', ');
          var top = done ? n.pts[0].label : '{' + names + '}';
          var sub = done ? '(' + fmt(n.pts[0].x[0]) + ', ' + fmt(n.pts[0].x[1]) + ')' : 'not split yet';
          var lw = Math.max(top.length, sub.length) * 6.8 + 14;
          svg('rect', { x: x - lw / 2, y: y - 16, width: lw, height: 34, rx: 4,
                        fill: isHL ? '#fff3c4' : (done ? '#eaf7ea' : '#f4f4f4'),
                        stroke: done ? '#3a8a3a' : '#999', 'stroke-width': isHL ? 3 : 1.5,
                        'stroke-dasharray': done ? '' : '4 3' }, g);
          var tt = svg('text', { x: x, y: y - 1, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 600, fill: '#1a1a1a' }, g);
          if (done) setSubLabel(tt, n.pts[0].name, 13); else tt.textContent = top;
          svg('text', { x: x, y: y + 13, 'text-anchor': 'middle', 'font-size': 10.5, fill: '#555' }, g).textContent = sub;
        }
        // Only redraw the plot here; rebuilding the tree under the pointer would churn.
        g.addEventListener('pointerenter', function () { highlight = n; renderPlot(); });
        g.addEventListener('pointerleave', function () { if (highlight === n) { highlight = null; renderPlot(); } });
      })(tree);

      html('div', { style: 'font-size:0.75em;color:#666;padding:0 8px 6px' }, treeWrap,
           'Hover over a node to highlight its region in the plot. Left branches are taken when the test is true.');
    }

    render();
  }

  function init() {
    var els = document.querySelectorAll('.kdtree-builder');
    for (var i = 0; i < els.length; i++) mount(els[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
