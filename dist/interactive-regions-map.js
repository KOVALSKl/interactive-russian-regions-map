import { openBlock as d, createElementBlock as v, createElementVNode as y, computed as E, ref as l, watch as M, onMounted as O, Fragment as S, renderList as q, createBlock as A, renderSlot as F, unref as L } from "vue";
import * as r from "d3";
const V = { class: "map-region" }, G = ["d"], H = {
  props: ["d", "data"],
  emits: ["regionClicked"],
  setup(a, { emit: g }) {
    const e = a;
    return (x, c) => (d(), v("g", V, [
      y("path", {
        class: "map-region-path",
        d: e.d,
        onClick: c[0] || (c[0] = (s) => g("regionClicked", { event: s, data: a.data }))
      }, null, 8, G)
    ]));
  }
}, J = { class: "map-container w-100" }, K = ["width", "height", "transform", "viewBox"], Q = { id: "regions-container" }, U = /* @__PURE__ */ y("path", {
  fill: "none",
  stroke: "white",
  "stroke-linejoin": "round"
}, null, -1), X = {
  props: {
    width: {
      type: Number,
      default: 900
    },
    height: {
      type: Number,
      default: 900
    },
    regions: {
      type: Object,
      required: !0
    },
    regionsIndexes: {
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
    }
  },
  emits: ["nextRegion", "previousRegion"],
  setup(a, { emit: g }) {
    const e = a, x = e.regions.features.length;
    let c = [], s = /* @__PURE__ */ new Map();
    const j = E(() => e.mapProjection ?? r.geoTransverseMercator().fitSize([e.width, e.height], e.regions).rotate([-90, 0]).center([-20, -20])), i = l(0), _ = l(r.geoPath().projection(j.value)), z = l(null), p = l(null), m = l(null), k = l(null);
    l(null);
    const h = E(() => e.regions.features[i.value]);
    M(i, (t, o) => {
      console.log(`index was changed ${t}`), h.value = e.regions.features[t];
    }), M(h, (t, o) => {
      var n, u;
      (n = s.get(o.properties.id)) == null || n.style.setProperty("fill", null), (u = s.get(t.properties.id)) == null || u.style.setProperty("fill", "red");
    });
    function R(t) {
      t >= 0 && t < x && (i.value = t, console.log(`value updated: ${i.value}`));
    }
    function b(t) {
      for (let o = 0; o < x; o++)
        if (e.regions[o].properties.id === t.properties.id)
          return o;
    }
    function N(t) {
      let o = t.properties.id;
      return e.regionsIndexes[o].index;
    }
    function $() {
      console.log("clicked next"), R(++i.value), console.log(i.value), w(), g("nextRegion");
    }
    function B() {
      console.log("clicked previous"), R(--i.value), console.log(i.value), w(), g("previousRegion");
    }
    function w() {
      let t = h.value.properties.id;
      s.get(t).dispatchEvent(new PointerEvent("click", void 0));
    }
    function C(t) {
      const { transform: o } = t;
      k.value.attr("transform", o), k.value.attr("stroke-width", 1 / o.k);
    }
    function D() {
      m.value.transition().duration(e.animationDurationTime).call(
        p.value.transform,
        r.zoomIdentity,
        r.zoomTransform(m.value.node()).invert([e.width / 2, e.height / 2])
      );
    }
    function T({ event: t, data: o }) {
      console.log(t);
      const [[n, u], [I, P]] = _.value.bounds(o);
      t.stopPropagation();
      let f;
      console.log(o), e.regionsIndexes ? f = N(o) : f = b(o), console.log(f), R(f), m.value.transition().duration(e.animationDurationTime).call(
        p.value.transform,
        r.zoomIdentity.translate(e.width / 2, e.height / 2).scale(Math.min(8, 0.9 / Math.max((I - n) / e.width, (P - u) / e.height))).translate(-(n + I) / 2, -(u + P) / 2)
      );
    }
    return O(() => {
      p.value = r.zoom().scaleExtent([1, 8]).on("zoom", C), m.value = r.select("svg").on("click", D).call(p.value), c = document.querySelectorAll("path.map-region-path").values();
      for (let t of c)
        s.set(t.parentElement.id, t);
      k.value = r.select("#regions-container"), w();
    }), (t, o) => (d(), v("div", J, [
      (d(), v("svg", {
        id: "map",
        width: e.width,
        height: e.height,
        transform: z.value,
        viewBox: [0, 0, e.width, e.height]
      }, [
        y("g", Q, [
          (d(!0), v(S, null, q(a.regions.features, (n) => (d(), A(H, {
            key: n.properties.NAME_1,
            id: n.properties.id,
            ref_for: !0,
            ref: "regionsRef",
            data: n,
            d: _.value(n),
            onRegionClicked: T
          }, null, 8, ["id", "data", "d"]))), 128)),
          U
        ])
      ], 8, K)),
      F(t.$slots, "default", {
        regionData: L(h),
        onNextRegion: $,
        onPreviousRegion: B
      })
    ]));
  }
};
export {
  H as MapRegion,
  X as RegionsMap
};
