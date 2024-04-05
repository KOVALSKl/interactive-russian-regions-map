import { openBlock as d, createElementBlock as h, createElementVNode as w, Fragment as N, renderList as $, createBlock as T, computed as I, ref as m, watch as R, onMounted as O, renderSlot as E } from "vue";
import * as r from "d3";
const q = { class: "map-region" }, S = ["d"], F = {
  props: ["d", "data"],
  emits: ["regionClicked"],
  setup(o, { emit: s }) {
    const e = o;
    return (l, i) => (d(), h("g", q, [
      w("path", {
        class: "map-region-path",
        d: e.d,
        onClick: i[0] || (i[0] = (a) => s("regionClicked", { event: a, data: o.data }))
      }, null, 8, S)
    ]));
  }
}, A = { class: "map-container w-100" }, L = ["width", "height", "viewBox"], V = { id: "regions-container" }, G = /* @__PURE__ */ w("path", {
  fill: "none",
  stroke: "white",
  "stroke-linejoin": "round"
}, null, -1), U = {
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
  setup(o, { emit: s }) {
    const e = o;
    return (l, i) => (d(), h("div", A, [
      (d(), h("svg", {
        id: "map",
        width: e.width,
        height: e.height,
        viewBox: [0, 0, e.width, e.height]
      }, [
        w("g", V, [
          (d(!0), h(N, null, $(o.mapData.features, (a) => (d(), T(F, {
            key: a.properties.NAME_1,
            id: a.properties.id,
            ref_for: !0,
            ref: "regionsRef",
            data: a,
            d: o.path(a),
            onRegionClicked: i[0] || (i[0] = (c) => s("regionClicked", c))
          }, null, 8, ["id", "data", "d"]))), 128)),
          G
        ])
      ], 8, L))
    ]));
  }
}, H = (o, s) => {
  const e = o.__vccOpts || o;
  for (const [l, i] of s)
    e[l] = i;
  return e;
}, J = { class: "map-provider-container" }, K = {
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
  setup(o, { emit: s }) {
    const e = o, l = e.mapData.features.length, i = /* @__PURE__ */ new Map(), a = I(() => e.mapProjection ?? r.geoTransverseMercator().fitSize([e.width, e.height], e.mapData).rotate([-90, 0]).center([-20, -20])), c = I(() => e.mapData.features[f.value]), f = m(0), x = m(r.geoPath().projection(a.value)), v = m(
      r.zoom().scaleExtent([1, 8]).on("zoom", M)
    ), g = m(null), k = m(null);
    R(f, (t, n) => {
      c.value = e.mapData.features[t];
    }), R(c, (t, n) => {
      var u, p;
      (u = i.get(n.properties.id)) == null || u.style.setProperty("fill", null), (p = i.get(t.properties.id)) == null || p.style.setProperty("fill", e.color);
    });
    function b(t) {
      t >= 0 && t < l && (f.value = t);
    }
    function C(t) {
      for (let n = 0; n < l; n++)
        if (e.mapData[n].properties.id === t.properties.id)
          return n;
    }
    function P(t) {
      let n = t.properties.id;
      return e.mapDataIndexes[n].index;
    }
    function j() {
      let t = c.value.properties.id;
      i.get(t).dispatchEvent(new PointerEvent("click", void 0));
    }
    function M(t) {
      const { transform: n } = t;
      k.value.attr("transform", n), k.value.attr("stroke-width", 1 / n.k);
    }
    function z() {
      g.value.transition().duration(e.animationDurationTime).call(
        v.value.transform,
        r.zoomIdentity,
        r.zoomTransform(g.value.node()).invert([e.width / 2, e.height / 2])
      );
    }
    function B({ event: t, data: n }) {
      const [[u, p], [D, _]] = x.value.bounds(n);
      t.stopPropagation(), console.log(t, n);
      let y;
      e.mapDataIndexes ? y = P(n) : y = C(n), b(y), g.value.transition().duration(e.animationDurationTime).call(
        v.value.transform,
        r.zoomIdentity.translate(e.width / 2, e.height / 2).scale(Math.min(8, 0.9 / Math.max((D - u) / e.width, (_ - p) / e.height))).translate(-(u + D) / 2, -(p + _) / 2)
      );
    }
    return O(() => {
      g.value = r.select("svg").on("click", z).call(v.value), k.value = r.select("#regions-container");
      const t = document.querySelectorAll("path.map-region-path").values();
      for (let n of t)
        i.set(n.parentElement.id, n);
      j();
    }), (t, n) => (d(), h("div", J, [
      E(t.$slots, "map", {
        width: o.width,
        height: o.height,
        mapData: o.mapData,
        path: x.value,
        onRegionClicked: B
      }, void 0, !0),
      E(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, W = /* @__PURE__ */ H(K, [["__scopeId", "data-v-77414b0a"]]);
export {
  W as MapProvider,
  F as MapRegion,
  U as RegionsMap
};
