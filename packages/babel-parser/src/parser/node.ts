import type Parser from "./index";
import UtilParser from "./util";
import { SourceLocation, Position, Comment, SyntaxNode } from "../grammar";

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
  declare leadingComments: Comment[];
  declare trailingComments: Comment[];
  declare innerComments: Comment[];
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
  startNode<T extends SyntaxNode<any>>(): T {
    return (new Node(this, this.state.start, this.state.startLoc) as unknown) as T;
  }

  startNodeAt<T extends SyntaxNode<any>>(pos: number, loc: Position): T {
    return (new Node(this, pos, loc) as unknown) as T;
  }

  /** Start a new node with a previous node's location. */
  startNodeAtNode<T extends SyntaxNode<any>>({ start, loc } : T): T {
    return (this.startNodeAt(start, loc.start) as unknown) as T;
  }

  // Finish an AST node, adding `type` and `end` properties.

  finishNode<T extends SyntaxNode<any>>(node: T, type: T["type"]): T {
    return this.finishNodeAt(node, type, this.state.lastTokEndLoc) as T;
  }

  // Finish node at given position
  finishNodeAt<T extends SyntaxNode<any>>(node: T, type: T["type"], endLoc: Position): T {
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

  resetStartLocation(node: SyntaxNode<any>, start: number, startLoc: Position): void {
    node.start = start;
    node.loc.start = startLoc;
    if (this.options.ranges) node.range[0] = start;
  }

  resetEndLocation(
    node: SyntaxNode<any>,
    endLoc: Position = this.state.lastTokEndLoc,
  ): void {
    node.end = endLoc.index;
    node.loc.end = endLoc;
    if (this.options.ranges) node.range[1] = endLoc.index;
  }

  /**
   * Reset the start location of node to the start location of locationNode
   */
  resetStartLocationFromNode(node: SyntaxNode<any>, { start, loc } : SyntaxNode<any>): void {
    this.resetStartLocation(node, start, loc.start);
  }
}
