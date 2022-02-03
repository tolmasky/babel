import type Parser from "./index";
import UtilParser from "./util";
import { SourceLocation, type Position } from "../util/location";
//import type { Comment, Node as NodeType, NodeBase } from "../types";
import type * as N from "@babel/types";

// Start an AST node, attaching a start offset.

class Node {
  constructor(parser: Parser, pos: number, loc: Position) {
    this.start = pos;
    this.end = 0;
    this.loc = new SourceLocation(loc);
    if (parser?.options.ranges) this.range = [pos, 0];
    if (parser?.filename) this.loc.filename = parser.filename;
  }
  type: string = "";
  declare start: number;
  declare end: number;
  declare loc: SourceLocation;
  declare range: [number, number];
  declare leadingComments: Array<N.Comment>;
  declare trailingComments: Array<N.Comment>;
  declare innerComments: Array<N.Comment>;
  declare extra: { [key: string]: any };
}
const NodePrototype = Node.prototype;

// FIXME!!!!
/*
if (!process.env.BABEL_8_BREAKING) {
  // $FlowIgnore
  NodePrototype.__clone = function (): Node {
    // $FlowIgnore
    const newNode: any = new Node();
    const keys = Object.keys(this);
    for (let i = 0, length = keys.length; i < length; i++) {
      const key = keys[i];
      // Do not clone comments that are already attached to the node
      if (
        key !== "leadingComments" &&
        key !== "trailingComments" &&
        key !== "innerComments"
      ) {
        newNode[key] = this[key];
      }
    }

    return newNode;
  };
}*/

function clonePlaceholder(node: any): any {
  return cloneIdentifier(node);
}

export function cloneIdentifier(node: any): any {
  // We don't need to clone `typeAnnotations` and `optional`: because
  // cloneIdentifier is only used in object shorthand and named import/export.
  // Neither of them allow type annotations after the identifier or optional identifier
  const { type, start, end, loc, range, extra, name } = node;
  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  cloned.extra = extra;
  cloned.name = name;
  if (type === "Placeholder") {
    cloned.expectedNode = node.expectedNode;
  }
  return cloned;
}

export function cloneStringLiteral(node: any): any {
  const { type, start, end, loc, range, extra } = node;
  if (type === "Placeholder") {
    return clonePlaceholder(node);
  }
  const cloned = Object.create(NodePrototype);
  cloned.type = type;
  cloned.start = start;
  cloned.end = end;
  cloned.loc = loc;
  cloned.range = range;
  if (node.raw !== undefined) {
    // estree set node.raw instead of node.extra
    cloned.raw = node.raw;
  } else {
    cloned.extra = extra;
  }
  cloned.value = node.value;
  return cloned;
}

export class NodeUtils extends UtilParser {
  startNode<T extends N.Node>(): T {
    return (new Node(this, this.state.start, this.state.startLoc) as unknown) as T;
  }

  startNodeAt<T extends N.Node>(pos: number, loc: Position): T {
    return (new Node(this, pos, loc) as unknown) as T;
  }

  /** Start a new node with a previous node's location. */
  startNodeAtNode<T extends N.Node>({ start, loc } : T): T {
    return (this.startNodeAt(start, loc.start) as unknown) as T;
  }

  // Finish an AST node, adding `type` and `end` properties.

  finishNode<T extends N.Node>(node: T, type: N.NodeType): T {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc) as T;
  }

  // Finish node at given position

  finishNodeAt<T extends N.Node>(node: T, type: N.NodeType, endLoc: Position): T {
    if (process.env.NODE_ENV !== "production" && node.end > 0) {
      throw new Error(
        "Do not call finishNode*() twice on the same node." +
          " Instead use resetEndLocation() or change type directly.",
      );
    }
    node.type = type;
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
    if (this.options.attachComment) this.processComment(node);
    return node;
  }

  resetStartLocation(node: N.Node, start: number, startLoc: Position): void {
    node.start = start;
    node.loc.start = startLoc;
    if (this.options.ranges) node.range[0] = start;
  }

  resetEndLocation(
    node: N.Node,
    endLoc: Position = this.state.lastTokEndLoc,
  ): void {
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
  }

  /**
   * Reset the start location of node to the start location of locationNode
   */
  resetStartLocationFromNode(node: N.Node, { start, loc } : N.Node): void {
    this.resetStartLocation(node, start, loc.start);
  }
}
