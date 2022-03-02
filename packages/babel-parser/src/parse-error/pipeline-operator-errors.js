// @flow

import { toParseErrorCredentials } from "../parse-error";
import toNodeDescription from "./to-node-description";

export const UnparenthesizedPipeBodyDescriptions = new Set<string>([
  "ArrowFunctionExpression",
  "AssignmentExpression",
  "ConditionalExpression",
  "YieldExpression",
]);

export default (_: typeof toParseErrorCredentials) => ({
  // This error is only used by the smart-mix proposal
  PipeBodyIsTighter: _<"PipeBodyIsTighter">(
    `Unexpected yield after pipeline body; any yield expression acting as Hack-style pipe body must be parenthesized due to its loose operator precedence.`,
  ),
  PipeTopicRequiresHackPipes: _<"PipeTopicRequiresHackPipes">(
    'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.',
  ),
  PipeTopicUnbound: _<"PipeTopicUnbound">(
    "Topic reference is unbound; it must be inside a pipe body.",
  ),
  PipeTopicUnconfiguredToken: _<
    "PipeTopicUnconfiguredToken",
    {| token: string |},
  >(
    ({ token }) =>
      `Invalid topic token ${token}. In order to use ${token} as a topic reference, the pipelineOperator plugin must be configured with { "proposal": "hack", "topicToken": "${token}" }.`,
  ),
  PipeTopicUnused: _<"PipeTopicUnused">(
    "Hack-style pipe body does not contain a topic reference; Hack-style pipes must use topic at least once.",
  ),
  PipeUnparenthesizedBody: _<"PipeUnparenthesizedBody", {| type: string |}>(
    ({ type }) =>
      `Hack-style pipe body cannot be an unparenthesized ${toNodeDescription({
        type,
      })}; please wrap it in parentheses.`,
  ),

  // Messages whose codes start with “Pipeline” or “PrimaryTopic”
  // are retained for backwards compatibility
  // with the deprecated smart-mix pipe operator proposal plugin.
  // They are subject to removal in a future major version.
  PipelineBodyNoArrow: _<"PipelineBodyNoArrow">(
    'Unexpected arrow "=>" after pipeline body; arrow function in pipeline body must be parenthesized.',
  ),
  PipelineBodySequenceExpression: _<"PipelineBodySequenceExpression">(
    "Pipeline body may not be a comma-separated sequence expression.",
  ),
  PipelineHeadSequenceExpression: _<"PipelineHeadSequenceExpression">(
    "Pipeline head should not be a comma-separated sequence expression.",
  ),
  PipelineTopicUnused: _<"PipelineTopicUnused">(
    "Pipeline is in topic style but does not use topic reference.",
  ),
  PrimaryTopicNotAllowed: _<"PrimaryTopicNotAllowed">(
    "Topic reference was used in a lexical context without topic binding.",
  ),
  PrimaryTopicRequiresSmartPipeline: _<"PrimaryTopicRequiresSmartPipeline">(
    'Topic reference is used, but the pipelineOperator plugin was not passed a "proposal": "hack" or "smart" option.',
  ),
});
