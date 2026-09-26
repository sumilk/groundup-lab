/* Small SVG kit for lesson figures, computed from the actual mathematics.

   Every figure is a dark card in the house palette so it reads the same in
   light and dark reader themes. Panels map data coordinates to pixels with
   one scale for both axes, so right angles, lengths and areas are faithful.
   Figure scripts in this folder export {name: () => svgString}; build.mjs
   writes them to content/assets and can verify that committed files are fresh. */

export const C = {
  bg: "#08111f", grid: "#173641", axis: "#31445e", ink: "#e8eef7", label: "#a8b7ca",
  muted: "#91a4bb", teal: "#50d2c2", orange: "#ffb86b", purple: "#d586ff",
  blue: "#7aa2f7", pink: "#ff7a90", green: "#8bd17c", dim: "#476073",
};

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const r2 = v => Math.round(v * 100) / 100;

/** A complete figure. `parts` is an array of SVG strings (panels, text, …). */
export function figure({ w = 900, h = 430, id, title, desc, caption }, parts) {
  if (!id || !title || !desc) throw new Error("figure needs id, title and desc for accessibility");
  const cap = caption ? `<text x="${w / 2}" y="${h - 20}" text-anchor="middle" fill="${C.muted}" font-family="system-ui" font-size="16">${esc(caption)}</text>` : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc">
  <title id="${id}-title">${esc(title)}</title>
  <desc id="${id}-desc">${esc(desc)}</desc>
  <rect width="${w}" height="${h}" rx="24" fill="${C.bg}"/>
${parts.flat(Infinity).filter(Boolean).map(p => "  " + p).join("\n")}
  ${cap}
</svg>
`;
}

export function text(x, y, s, { color = C.ink, size = 16, anchor = "start", weight, italic } = {}) {
  return `<text x="${r2(x)}" y="${r2(y)}" fill="${color}" font-family="system-ui" font-size="${size}"${anchor !== "start" ? ` text-anchor="${anchor}"` : ""}${weight ? ` font-weight="${weight}"` : ""}${italic ? ' font-style="italic"' : ""}>${esc(s)}</text>`;
}

/** Map a data box onto a pixel box with equal x/y scale, centred in the box. */
export function panel({ x, y, w, h, xmin, xmax, ymin, ymax, title }) {
  const s = Math.min(w / (xmax - xmin), h / (ymax - ymin));
  const ox = x + (w - s * (xmax - xmin)) / 2, oy = y + (h - s * (ymax - ymin)) / 2;
  const P = ([u, v]) => [ox + (u - xmin) * s, oy + (ymax - v) * s];
  // Clip to the mapped data rectangle, not the requested pixel box, so lines,
  // grids and axes all stop at the same data limits.
  const [cx0, cy0] = P([xmin, ymax]), cw = (xmax - xmin) * s, ch = (ymax - ymin) * s;
  const clipId = `clip-${r2(x)}-${r2(y)}`;
  const pt = p => P(p).map(r2).join(" ");
  const out = [];
  if (title) out.push(text(x + w / 2, y - 14, title, { color: C.label, size: 17, anchor: "middle" }));
  const api = {
    scale: s, P, out, box: {x: cx0, y: cy0, w: cw, h: ch},
    /** Integer lattice lines (optionally the image of the lattice under M). */
    grid(step = 1, { M = [[1, 0], [0, 1]], color = C.grid, width = 1.5, range } = {}) {
      const [a, b, c, d] = [M[0][0], M[1][0], M[0][1], M[1][1]];
      const [lo, hi] = range || [Math.floor(Math.min(xmin, ymin) * 3), Math.ceil(Math.max(xmax, ymax) * 3)];
      const map = (u, v) => [a * u + c * v, b * u + d * v];
      let dpath = "";
      for (let k = Math.ceil(lo / step) * step; k <= hi; k += step) {
        dpath += `M${pt(map(k, lo))}L${pt(map(k, hi))}M${pt(map(lo, k))}L${pt(map(hi, k))}`;
      }
      out.push(`<g clip-path="url(#${clipId})"><path d="${dpath}" stroke="${color}" stroke-width="${width}" fill="none"/></g>`);
      return api;
    },
    axes({ color = C.axis, width = 2 } = {}) {
      // Draw only the axes that pass through the visible data box.
      let d = "";
      if (ymin <= 0 && 0 <= ymax) d += `M${pt([xmin, 0])}L${pt([xmax, 0])}`;
      if (xmin <= 0 && 0 <= xmax) d += `M${pt([0, ymin])}L${pt([0, ymax])}`;
      if (d) out.push(`<path d="${d}" stroke="${color}" stroke-width="${width}"/>`);
      return api;
    },
    line(p, q, { color = C.muted, width = 2, dash } = {}) {
      out.push(`<path d="M${pt(p)}L${pt(q)}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""} fill="none"/>`);
      return api;
    },
    /** A full line through p with direction d, clipped to the panel box. */
    fullLine(p, d, opts = {}) {
      const t = 4 * Math.max(xmax - xmin, ymax - ymin) / Math.hypot(...d);
      out.push(`<g clip-path="url(#${clipId})">`);
      api.line([p[0] - t * d[0], p[1] - t * d[1]], [p[0] + t * d[0], p[1] + t * d[1]], opts);
      out.push("</g>");
      return api;
    },
    arrow(p, q, { color = C.teal, width = 4, label, at = 1, dx = 8, dy = -8, size = 16, head = 13, dash } = {}) {
      const [x0, y0] = P(p), [x1, y1] = P(q), L = Math.hypot(x1 - x0, y1 - y0);
      if (L > 1e-9) {
        const ux = (x1 - x0) / L, uy = (y1 - y0) / L, hl = Math.min(head, L * 0.6);
        const bx = x1 - ux * hl, by = y1 - uy * hl;
        out.push(`<path d="M${r2(x0)} ${r2(y0)}L${r2(bx)} ${r2(by)}" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`);
        out.push(`<path d="M${r2(x1)} ${r2(y1)}L${r2(bx - uy * hl * 0.45)} ${r2(by + ux * hl * 0.45)}L${r2(bx + uy * hl * 0.45)} ${r2(by - ux * hl * 0.45)}Z" fill="${color}"/>`);
      }
      if (label) {
        const lx = x0 + (x1 - x0) * at, ly = y0 + (y1 - y0) * at;
        out.push(text(lx + dx, ly + dy, label, { color, size }));
      }
      return api;
    },
    point(p, { color = C.ink, r = 5, label, dx = 8, dy = -8, size = 16 } = {}) {
      const [px, py] = P(p);
      out.push(`<circle cx="${r2(px)}" cy="${r2(py)}" r="${r}" fill="${color}"/>`);
      if (label) out.push(text(px + dx, py + dy, label, { color, size }));
      return api;
    },
    label(p, s, { color = C.ink, size = 16, dx = 0, dy = 0, anchor = "start", italic } = {}) {
      const [px, py] = P(p);
      out.push(text(px + dx, py + dy, s, { color, size, anchor, italic }));
      return api;
    },
    polygon(points, { fill = C.purple, opacity = 0.3, stroke = fill, width = 2.5, dash } = {}) {
      out.push(`<path d="M${points.map(pt).join("L")}Z" fill="${fill}" fill-opacity="${opacity}" stroke="${stroke}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`);
      return api;
    },
    /** Parametric curve t↦f(t) sampled on [t0,t1]. */
    curve(f, t0, t1, { color = C.orange, width = 3, n = 240, dash, fill = "none", opacity = 1, closed = false } = {}) {
      const pts = [];
      for (let i = 0; i <= n; i++) pts.push(pt(f(t0 + (t1 - t0) * i / n)));
      out.push(`<path d="M${pts.join("L")}${closed ? "Z" : ""}" stroke="${color}" stroke-width="${width}" fill="${fill}"${fill !== "none" ? ` fill-opacity="${opacity}"` : ""}${dash ? ` stroke-dasharray="${dash}"` : ""}/>`);
      return api;
    },
    /** Image of the unit circle of radius r (centred at c) under the 2x2 matrix M. */
    ellipse(M, { r = 1, c = [0, 0], ...opts } = {}) {
      return api.curve(t => [c[0] + r * (M[0][0] * Math.cos(t) + M[0][1] * Math.sin(t)),
        c[1] + r * (M[1][0] * Math.cos(t) + M[1][1] * Math.sin(t))], 0, 2 * Math.PI, { closed: true, ...opts });
    },
    /** Small square marking a right angle at p between directions u and v. */
    rightAngle(p, u, v, { size = 0.22, color = C.muted } = {}) {
      const nu = Math.hypot(...u), nv = Math.hypot(...v);
      const a = [p[0] + size * u[0] / nu, p[1] + size * u[1] / nu], b = [p[0] + size * v[0] / nv, p[1] + size * v[1] / nv];
      const cc = [a[0] + b[0] - p[0], a[1] + b[1] - p[1]];
      out.push(`<path d="M${pt(a)}L${pt(cc)}L${pt(b)}" stroke="${color}" stroke-width="2" fill="none"/>`);
      return api;
    },
    raw(s) { out.push(s); return api; },
    svg() {
      const clip = `<defs><clipPath id="${clipId}"><rect x="${r2(cx0)}" y="${r2(cy0)}" width="${r2(cw)}" height="${r2(ch)}"/></clipPath></defs>`;
      return [clip, ...out].join("\n  ");
    },
  };
  return api;
}

/* Tiny 2x2 / vector helpers so figure scripts compute rather than guess. */
export const mv = (M, v) => M.map(row => row.reduce((s, m, j) => s + m * v[j], 0));
export const add = (a, b) => a.map((x, i) => x + b[i]);
export const sub = (a, b) => a.map((x, i) => x - b[i]);
export const scale = (k, a) => a.map(x => k * x);
export const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);
export const norm = a => Math.sqrt(dot(a, a));
export const fmt = (v, d = 2) => (Math.abs(v - Math.round(v)) < 1e-12 ? String(Math.round(v)) : v.toFixed(d)).replace("-", "−");
