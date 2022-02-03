export type Pos = {
  start: number;
};

export class Position {
  constructor(
    public line: number,
    public column: number,
    public index: number
  ) {}
}

export class SourceLocation {
  start: Position;
  end: Position;
  filename: string;
  identifierName?: string;

  constructor(start: Position, end?: Position) {
    this.start = start;
    this.end = end;
  }
}

export default SourceLocation;

/**
 * creates a new position with a non-zero column offset from the given position.
 * This function should be only be used when we create AST node out of the token
 * boundaries, such as TemplateElement ends before tt.templateNonTail. This
 * function does not skip whitespaces.
 *
 * @export
 * @param {Position} position
 * @param {number} columnOffset
 * @returns {Position}
 */
export function createPositionWithColumnOffset(
  position: Position,
  columnOffset: number
) {
  const { line, column, index } = position;
  return new Position(line, column + columnOffset, index + columnOffset);
}
