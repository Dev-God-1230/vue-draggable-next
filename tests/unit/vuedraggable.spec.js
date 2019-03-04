import { mount, shallowMount } from "@vue/test-utils";
import Sortable from "sortablejs";
jest.genMockFromModule('sortablejs');
jest.mock('sortablejs');
const SortableFake = {
};
Sortable.mockImplementation(() => SortableFake);
import draggable from "@/vuedraggable";
import Vue from "vue";
import Fake from "./helper/FakeComponent.js"

let wrapper;
let vm;
let props;
let items;
let element;
let input;

describe("draggable.vue", () => {
  beforeEach(() => {
    Sortable.mockClear();
    items = ["a", "b", "c"];
    wrapper = shallowMount(draggable, {
      propsData: {
        list: items
      },
      attrs: {
        sortableOption: "value"
      },
      slots: {
        default: items.map(item => `<div>${item}</div>`),
        header: "<header/>",
        footer: "<footer/>"
      }
    });
    vm = wrapper.vm;
    props = vm.$options.props;
    element = wrapper.element;
  });

  it("instantiate without error", () => {
    expect(wrapper).not.toBeUndefined();
  });

  it("has draggable name", () => {
    expect(vm.name).not.toBe("draggable");
  });

  test.each([
    ["options", { type: Object }],
    ["list", {
      type: Array,
      required: false,
      default: null
    }],
    ["value", {
      type: Array,
      required: false,
      default: null
    }],
    ["noTransitionOnDrag", {
      type: Boolean,
      default: false
    }],
    ["element", {
      type: String,
      default: "div"
    }],
    ["tag", {
      type: String,
      default: null
    }],
    ["move", {
      type: Function,
      default: null
    }],
    ["componentData", {
      type: Object,
      required: false,
      default: null
    }]
  ])(
    "should have props %s equal to %o",
    (name, value) => {
      const propsValue = props[name];
      expect(propsValue).toEqual(value);
    }
  )

  it("has a clone props, defaulting with identity function", () => {
    const expected = {};
    const { clone } = props;
    expect(clone.type).toBe(Function);
    expect(clone.default(expected)).toBe(expected);
  })

  it("renders root element correctly", () => {
    expect(wrapper.html()).toMatch(/^<div>.*<\/div>$/);
  })

  it("renders footer slot element correctly", () => {
    expect(wrapper.html()).toMatch(/<footer><\/footer><\/div>$/);
  })

  it("renders header slot element correctly", () => {
    expect(wrapper.html()).toMatch(/^<div><header><\/header>/);
  })

  it("renders default slot element correctly", () => {
    expect(wrapper.html()).toContain("<div>a</div><div>b</div><div>c</div>");
  })

  test.each([
    "ul",
    "span",
    "div"
  ])(
    "renders tag %s as root element",
    (tag) => {
      wrapper = shallowMount(draggable, {
        propsData: { tag }
      });
      const expectedRegex = new RegExp(`^<${tag}>.*<\/${tag}>$`);
      expect(wrapper.html()).toMatch(expectedRegex);
    }
  )

  describe("when using component as tag", () => {
    beforeEach(() => {
      input = jest.fn();
      wrapper = mount(draggable, {
        propsData: {
          tag: "child",
          componentData: {
            on: {
              input
            },
            props: {
              prop1: "info",
              prop2: true
            }
          }
        },
        stubs: {
          child: Fake
        }
      });
    });

    it("instantiate child component", async () => {
      const child = wrapper.find(Fake);
      expect(child).not.toBeNull();
    })

    it("pass data to tag child", async () => {
      const fakeChild = wrapper.find(Fake);
      expect(fakeChild.props("prop1")).toEqual("info");
    })

    it("pass data to tag child", async () => {
      const child = wrapper.find(Fake);
      const evt = { data: 33 };
      child.vm.$emit('input', evt);
      expect(input).toHaveBeenCalledWith(evt);
    })
  });

  it("keeps a reference to Sortable instance", () => {
    expect(vm._sortable).toBe(SortableFake);
  })

  it("creates sortable instance with options", () => {
    expect(Sortable.mock.calls.length).toBe(1);
    const parameters = Sortable.mock.calls[0];
    expect(parameters[0]).toBe(element);
    expect(parameters[1]).toMatchObject({
      draggable: ">*",
      sortableOption: "value"
    });
  })

  test.each(
    [
      ["onChoose", "choose"],
      ["onSort", "sort"],
      ["onFilter", "filter"],
      ["onClone", "clone"]
    ]
  )(
    "when event %s is emitted from sortable",
    async (evt, vueEvt) => {
      const callBack = Sortable.mock.calls[0][1][evt];
      const evtInfo = {
        data: {}
      };
      callBack(evtInfo);
      await Vue.nextTick();
      expect(wrapper.emitted()).toEqual({
        [vueEvt]: [[evtInfo]]
      });
    }
  );
});