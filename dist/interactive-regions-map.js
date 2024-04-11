import { openBlock as m, createElementBlock as v, renderSlot as D, createElementVNode as I, Fragment as B, renderList as q, createBlock as F, computed as j, ref as g, watch as $, onMounted as L, unref as A } from "vue";
import * as s from "d3";
const V = { class: "map-region" }, Z = ["id", "d"], G = {
  props: ["d", "data"],
  emits: ["regionClicked"],
  setup(n, { emit: r }) {
    const e = n;
    return (l, i) => (m(), v("g", V, [
      D(l.$slots, "map-region-component", {
        d: e.d,
        onClick: i[0] || (i[0] = (a) => r("regionClicked", { event: a, data: n.data }))
      }, () => [
        I("path", {
          id: `path_${n.data.properties.id}`,
          class: "map-region-path",
          d: e.d,
          onClick: i[1] || (i[1] = (a) => r("regionClicked", { event: a, data: n.data }))
        }, null, 8, Z)
      ])
    ]));
  }
}, H = { class: "map-container w-100" }, J = ["width", "height", "viewBox"], K = { id: "regions-container" }, Q = /* @__PURE__ */ I("path", {
  fill: "none",
  stroke: "white",
  "stroke-linejoin": "round"
}, null, -1), ee = {
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
  setup(n, { emit: r }) {
    const e = n;
    return (l, i) => (m(), v("div", H, [
      (m(), v("svg", {
        id: "map",
        width: e.width,
        height: e.height,
        viewBox: [0, 0, e.width, e.height]
      }, [
        I("g", K, [
          (m(!0), v(B, null, q(n.mapData.features, (a) => (m(), F(G, {
            key: a.properties.id,
            id: a.properties.id,
            data: a,
            d: n.path(a),
            onRegionClicked: i[0] || (i[0] = (h) => r("regionClicked", h))
          }, null, 8, ["id", "data", "d"]))), 128)),
          Q
        ])
      ], 8, J))
    ]));
  }
}, U = (n, r) => {
  const e = n.__vccOpts || n;
  for (const [l, i] of r)
    e[l] = i;
  return e;
}, W = { class: "map-provider-container" }, X = {
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
    disableZoomOnClick: {
      type: Boolean,
      default: !1
    },
    regionsColorSchema: {
      type: Object,
      default: {}
    },
    regionDefaultColor: {
      type: String,
      default: "#444"
    },
    chosenRegionColor: {
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
  setup(n, { emit: r }) {
    const e = n, l = e.mapData.features.length, i = /* @__PURE__ */ new Map(), a = j(() => e.mapProjection ?? s.geoTransverseMercator().fitSize([e.width, e.height], e.mapData).rotate([-90, 0]).center([-20, -20])), h = j(() => e.mapData.features[p.value]), p = g(0), b = g(s.geoPath().projection(a.value)), y = g(
      s.zoom().scaleExtent([1, 8]).on("zoom", E)
    ), k = g(null), f = g(e.regionsColorSchema), C = g(null);
    $(h, (o, t) => {
      var d, u;
      console.log(t.properties.id), console.log(f);
      let c = t.properties.id in f.value;
      console.log(c), (d = i.get(t.properties.id)) == null || d.style.setProperty(
        "fill",
        c ? f.value[t.properties.id].color : e.regionDefaultColor
      ), (u = i.get(o.properties.id)) == null || u.style.setProperty("fill", e.chosenRegionColor);
    }), $(f, (o) => {
      console.log(f), P(o);
    });
    function P(o) {
      var t;
      for (let [c, d] of i.entries()) {
        const u = ((t = o[c]) == null ? void 0 : t.color) ?? e.regionDefaultColor;
        d.style.setProperty("fill", u);
      }
    }
    function x(o) {
      o < 0 ? p.value = l - 1 : o >= l ? p.value = 0 : p.value = o;
    }
    function z(o) {
      for (let t = 0; t < l; t++)
        if (e.mapData[t].properties.id === o.properties.id)
          return t;
    }
    function M(o) {
      let t = o.properties.id;
      return e.mapDataIndexes[t].index;
    }
    function O() {
      x(++p.value), w(), r("nextRegion");
    }
    function _() {
      x(--p.value), w(), r("previousRegion");
    }
    function w() {
      let o = h.value.properties.id;
      i.get(o).dispatchEvent(new PointerEvent("click", void 0));
    }
    function E(o) {
      const { transform: t } = o;
      C.value.attr("transform", t), C.value.attr("stroke-width", 1 / t.k);
    }
    function N() {
      r("mapClicked"), k.value.transition().duration(e.animationDurationTime).call(
        y.value.transform,
        s.zoomIdentity,
        s.zoomTransform(k.value.node()).invert([e.width / 2, e.height / 2])
      );
    }
    function T({ event: o, data: t }) {
      const [[c, d], [u, S]] = b.value.bounds(t);
      o.stopPropagation();
      let R;
      e.mapDataIndexes ? R = M(t) : R = z(t), x(R), k.value.transition().duration(e.animationDurationTime).call(
        y.value.transform,
        s.zoomIdentity.translate(e.width / 2, e.height / 2).scale(Math.min(8, 0.9 / Math.max((u - c) / e.width, (S - d) / e.height))).translate(-(c + u) / 2, -(d + S) / 2)
      ), r("regionClicked", { event: o, data: t });
    }
    return L(() => {
      k.value = s.select("svg").on("click", N).call(y.value), C.value = s.select("#regions-container");
      const o = document.querySelectorAll("path.map-region-path").values();
      for (let t of o)
        i.set(t.parentElement.id, t);
      P(e.regionsColorSchema), w();
    }), (o, t) => (m(), v("div", W, [
      D(o.$slots, "map", {
        width: n.width,
        height: n.height,
        mapData: n.mapData,
        path: b.value,
        onRegionClicked: T
      }, void 0, !0),
      D(o.$slots, "default", {
        currentRegion: A(h),
        onNextRegion: O,
        onPreviousRegion: _
      }, void 0, !0)
    ]));
  }
}, te = /* @__PURE__ */ U(X, [["__scopeId", "data-v-c831511b"]]);
export {
  te as MapProvider,
  G as MapRegion,
  ee as RegionsMap
};
