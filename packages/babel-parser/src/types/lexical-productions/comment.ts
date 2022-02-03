import LexicalProduction from "../lexical-production";

// https://tc39.es/ecma262/#prod-Comment
export type Comment =
    | MultiLineComment
    | SingleLineComment;

export default Comment;

// https://tc39.es/ecma262/#prod-MultiLineComment
export type MultiLineComment = LexicalProduction<
  "MultiLineComment",
  "CommentBlock"
>;

// https://tc39.es/ecma262/#prod-SingleLineComment
export type SingleLineComment = LexicalProduction<
  "SingleLineComment",
  "CommentLine"
>;

