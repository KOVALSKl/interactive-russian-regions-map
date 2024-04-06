import { openBlock as m, createElementBlock as h, createElementVNode as k, toDisplayString as T, renderSlot as C, Fragment as O, renderList as S, createBlock as q, computed as I, ref as g, watch as A, onMounted as F } from "vue";
import * as l from "d3";
const L = { class: "map-region" }, V = { class: "map-region-title" }, G = ["id", "d"], H = {
  __name: "MapRegion",
  props: ["d", "data"],
  emits: ["regionClicked"],
  setup(o, { emit: d }) {
    const e = o, r = d;
    return (c, i) => (m(), h("g", L, [
      k("title", V, `
      ` + T(o.data.properties.NAME_1) + `
    `, 1),
      C(c.$slots, "map-region-component", {
        d: e.d,
        onClick: i[0] || (i[0] = (a) => r("regionClicked", { event: a, data: o.data }))
      }, () => [
        k("path", {
          id: `path_${o.data.properties.id}`,
          class: "map-region-path",
          d: e.d,
          onClick: i[1] || (i[1] = (a) => r("regionClicked", { event: a, data: o.data }))
        }, null, 8, G)
      ])
    ]));
  }
}, J = { class: "map-container w-100" }, K = ["width", "height", "viewBox"], Q = { id: "regions-container" }, U = /* @__PURE__ */ k("path", {
  fill: "none",
  stroke: "white",
  "stroke-linejoin": "round"
}, null, -1), ee = {
  __name: "RegionsMap",
  props: {
    mapData: {
      type: Object,
      required: !0
    },
    path: {
      type: Function,
      required: !0
    },
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 900
    }
  },
  emits: ["regionClicked"],
  setup(o, { emit: d }) {
    const e = o, r = d;
    return (c, i) => (m(), h("div", J, [
      (m(), h("svg", {
        id: "map",
        width: e.width,
        height: e.height,
        viewBox: [0, 0, e.width, e.height]
      }, [
        k("g", Q, [
          (m(!0), h(O, null, S(o.mapData.features, (a) => (m(), q(H, {
            key: a.properties.NAME_1,
            id: a.properties.id,
            data: a,
            d: o.path(a),
            onRegionClicked: i[0] || (i[0] = (u) => r("regionClicked", u))
          }, null, 8, ["id", "data", "d"]))), 128)),
          U
        ])
      ], 8, K))
    ]));
  }
}, W = (o, d) => {
  const e = o.__vccOpts || o;
  for (const [r, c] of d)
    e[r] = c;
  return e;
}, X = { class: "map-provider-container" }, Y = {
  __name: "MapProvider",
  props: {
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 900
    },
    mapData: {
      type: Object,
      required: !0
    },
    mapDataIndexes: {
      type: Object,
      default: null
    },
    mapProjection: {
      type: Object,
      default: null
    },
    animationDurationTime: {
      type: Number,
      default: 1500
    },
    color: {
      type: String,
      default: "red"
    }
  },
  emits: [
    "nextRegion",
    "previousRegion",
    "regionClicked",
    "mapClicked"
  ],
  setup(o, { emit: d }) {
    const e = o, r = d, c = e.mapData.features.length, i = /* @__PURE__ */ new Map(), a = I(() => e.mapProjection ?? l.geoTransverseMercator().fitSize([e.width, e.height], e.mapData).rotate([-90, 0]).center([-20, -20])), u = I(() => e.mapData.features[f.value]), f = g(0), E = g(l.geoPath().projection(a.value)), y = g(
      l.zoom().scaleExtent([1, 8]).on("zoom", N)
    ), v = g(null), x = g(null);
    A(u, (t, n) => {
      var s, p;
      (s = i.get(n.properties.id)) == null || s.style.setProperty("fill", null), (p = i.get(t.properties.id)) == null || p.style.setProperty("fill", e.color);
    });
    function R(t) {
      t >= 0 && t < c && (f.value = t);
    }
    function M(t) {
      for (let n = 0; n < c; n++)
        if (e.mapData[n].properties.id === t.properties.id)
          return n;
    }
    function b(t) {
      let n = t.properties.id;
      return e.mapDataIndexes[n].index;
    }
    function $() {
      R(++f.value), w(), r("nextRegion");
    }
    function j() {
      R(--f.value), w(), r("previousRegion");
    }
    function w() {
      let t = u.value.properties.id;
      i.get(t).dispatchEvent(new PointerEvent("click", void 0));
    }
    function N(t) {
      const { transform: n } = t;
      x.value.attr("transform", n), x.value.attr("stroke-width", 1 / n.k);
    }
    function z() {
      v.value.transition().duration(e.animationDurationTime).call(
        y.value.transform,
        l.zoomIdentity,
        l.zoomTransform(v.value.node()).invert([e.width / 2, e.height / 2])
      );
    }
    function B({ event: t, data: n }) {
      const [[s, p], [D, _]] = E.value.bounds(n);
      t.stopPropagation(), console.log(s, p, D, _);
      let P;
      e.mapDataIndexes ? P = b(n) : P = M(n), R(P), v.value.transition().duration(e.animationDurationTime).call(
        y.value.transform,
        l.zoomIdentity.translate(e.width / 2, e.height / 2).scale(Math.min(8, 0.9 / Math.max((D - s) / e.width, (_ - p) / e.height))).translate(-(s + D) / 2, -(p + _) / 2)
      );
    }
    return F(() => {
      var n;
      v.value = l.select("svg").on("click", z).call(y.value), x.value = l.select("#regions-container");
      const t = document.querySelectorAll("path.map-region-path").values();
      for (let s of t)
        i.set(s.parentElement.id, s);
      (n = i.get(u.value.properties.id)) == null || n.style.setProperty("fill", e.color), w();
    }), (t, n) => (m(), h("div", X, [
      C(t.$slots, "map", {
        width: o.width,
        height: o.height,
        mapData: o.mapData,
        path: E.value,
        onRegionClicked: B
      }, void 0, !0),
      C(t.$slots, "default", {
        currentRegion: u.value,
        onNextRegion: $,
        onPreviousRegion: j
      }, void 0, !0)
    ]));
  }
}, te = /* @__PURE__ */ W(Y, [["__scopeId", "data-v-aaf3ea3d"]]);
export {
  te as MapProvider,
  H as MapRegion,
  ee as RegionsMap
};
