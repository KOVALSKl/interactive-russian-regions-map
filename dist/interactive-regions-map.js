import { openBlock as o, createElementBlock as r, createElementVNode as d, Fragment as l, renderList as p, createBlock as h } from "vue";
const u = { class: "map-region" }, g = ["d"], m = {
  props: ["d", "data"],
  emits: ["regionClicked"],
  setup(e, { emit: s }) {
    const t = e;
    return (a, n) => (o(), r("g", u, [
      d("path", {
        class: "map-region-path",
        d: t.d,
        onClick: n[0] || (n[0] = (i) => s("regionClicked", { event: i, data: e.data }))
      }, null, 8, g)
    ]));
  }
}, k = { class: "map-container w-100" }, _ = ["width", "height", "viewBox"], w = { id: "regions-container" }, f = /* @__PURE__ */ d("path", {
  fill: "none",
  stroke: "white",
  "stroke-linejoin": "round"
}, null, -1), x = {
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
  setup(e, { emit: s }) {
    const t = e;
    return (a, n) => (o(), r("div", k, [
      (o(), r("svg", {
        id: "map",
        width: t.width,
        height: t.height,
        viewBox: [0, 0, t.width, t.height]
      }, [
        d("g", w, [
          (o(!0), r(l, null, p(e.mapData.features, (i) => (o(), h(m, {
            key: i.properties.NAME_1,
            id: i.properties.id,
            ref_for: !0,
            ref: "regionsRef",
            data: i,
            d: e.path(i),
            onRegionClicked: n[0] || (n[0] = (c) => s("regionClicked", c))
          }, null, 8, ["id", "data", "d"]))), 128)),
          f
        ])
      ], 8, _))
    ]));
  }
};
export {
  m as MapRegion,
  x as RegionsMap
};
