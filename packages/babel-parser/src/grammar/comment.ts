import SourceNode from "./source-node";

// https://tc39.es/ecma262/#prod-Comment
export type Comment = MultiLineComment | SingleLineComment;

export default Comment;

// https://tc39.es/ecma262/#prod-MultiLineComment
export interface MultiLineComment
  extends SourceNode<"MultiLineComment", "CommentBlock"> {
  value: string;
}

// https://tc39.es/ecma262/#prod-SingleLineComment
export interface SingleLineComment
  extends SourceNode<"SingleLineComment", "CommentLine"> {
  value: string;
}
