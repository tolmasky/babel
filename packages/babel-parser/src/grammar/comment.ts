import SourceNode from "./source-node";

// https://tc39.es/ecma262/#prod-Comment
export type Comment = MultiLineComment | SingleLineComment;

export default Comment;

// https://tc39.es/ecma262/#prod-MultiLineComment
export type MultiLineComment = SourceNode<{
  type: "CommentBlock";
  GrammarSymbol: "MultiLineComment";

  value: string;
}>;

// https://tc39.es/ecma262/#prod-SingleLineComment
export type SingleLineComment = SourceNode<{
  type: "CommentLine";
  GrammarSymbol: "SingleLineComment";

  value: string;
}>;
