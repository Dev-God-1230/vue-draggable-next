import { ComponentStructure } from "./componentStructure";
import { isHtmlTag, isTransition } from "../util/tags";
import { resolveComponent, TransitionGroup } from "vue";

function getSlot(slots, key) {
  const slotValue = slots[key];
  return slotValue ? slotValue() : [];
}

function computeNodes({ $slots, realList, itemKey }) {
  const [header, footer] = ["header", "footer"].map(name =>
    getSlot($slots, name)
  );
  const { item } = $slots;
  if (!item) {
    throw new Error("draggable element must have an item slot");
  }
  const defaultNodes = realList.flatMap((element, index) =>
    item({ element, index }).map(node => {
      node.key = element[itemKey];
      node.props = { ...(node.props || {}), "data-draggable": true };
      return node;
    })
  );
  if (defaultNodes.length !== realList.length) {
    throw new Error("Item slot must have only one child");
  }
  return {
    header,
    footer,
    default: defaultNodes
  };
}

function getRootInformation(tag) {
  const transition = isTransition(tag);
  const externalComponent = !isHtmlTag(tag) && !transition;
  return {
    transition,
    externalComponent,
    tag: externalComponent
      ? resolveComponent(tag)
      : transition
      ? TransitionGroup
      : tag
  };
}

function computeComponentStructure({ $slots, tag, realList, itemKey }) {
  const nodes = computeNodes({ $slots, realList, itemKey });
  const root = getRootInformation(tag);
  return new ComponentStructure({ nodes, root, realList });
}

export { computeComponentStructure };
