# Practical AI systems: retrieval, tools, evaluation, and deployment

**Prerequisites:** Python, NLP, evaluation, and basic HTTP concepts. **Outcome:** build an observable system whose behavior can be measured and recovered.

## Retrieval separates knowledge from generation

A retrieval pipeline parses documents, chooses chunks, indexes them, retrieves candidates, optionally reranks them, and supplies selected evidence to a generator. Each stage can fail independently.

Chunk size changes the retrieval unit. Too small can remove context; too large can dilute a match or waste context budget. Dense embedding similarity is not a calibrated probability of relevance. Lexical retrieval remains useful for exact identifiers, unusual names, and codes.

Measure retrieval recall at k on examples with known supporting passages. Then measure whether the generated answer is grounded in retrieved evidence. If retrieval missed the evidence, changing the final prompt cannot reliably reconstruct it.

## Tool use is a state transition

A tool contract needs input schema, output schema, authentication, timeout, error semantics, and side-effect classification. A model's proposed tool call is input to validation, not proof that the operation is authorized.

For a booking-related example, separate search, quote, confirmation, and purchase. Bind final actions to the exact reviewed quote and current availability. An idempotency key prevents retries from duplicating a successfully completed write.

~~~mermaid
stateDiagram-v2
  [*] --> Retrieve
  Retrieve --> Draft: evidence found
  Retrieve --> Clarify: missing information
  Draft --> Validate
  Validate --> Respond: supported
  Validate --> Clarify: unsupported
  Clarify --> Retrieve: new information
  Respond --> [*]
~~~

Multiple agents are useful when roles have distinct inputs, tools, and checks. Giving one model several role names does not itself create independent verification. Log which model, context, and evidence each role actually received.

## Evaluation before optimization

Create a dataset of representative requests with expected evidence, acceptable actions, and failure labels. Include ambiguous requests, missing data, conflicting evidence, empty retrieval, timeouts, and repeated tool calls.

Separate offline regression tests from production measurements. A small golden set is valuable for deterministic failures but may not estimate population performance accurately. Add stratified samples and confidence intervals for that purpose.

Track task completion, unsupported claims, tool errors, latency, and cost. Human review should use a rubric and examples, rather than an undefined "quality" score.

## Deployment as reproducible state

A deployment should identify its source revision, dependencies, content version, configuration, and schema version. Keep credentials server-side. A build that passes is not evidence that credentials, network access, or production migrations work.

Use CI for validation and artifact construction. Promote the same tested artifact to production. Restrict publishing to the intended branch and serialize deployments so an older build does not overwrite a newer release. Keep rollback instructions and health checks.

Prompt changes and content changes are application changes: version and evaluate them. Database migrations may need backward compatibility across a rolling deployment. Restoring a previous binary does not automatically reverse a schema change.

## Lab and problems

Build a local document-retrieval baseline with a corpus you can inspect. Create twenty factual questions and ten adversarial or unanswerable cases. For every response, retain retrieved document IDs and the model's answer.

1. Create a case where retrieval succeeds but generation fails.
2. Create a case where chunking destroys evidence.
3. Explain why retrying a timed-out purchase can duplicate it.
4. Design a read-only tool and a state-changing tool with distinct policies.
5. Define a release gate and rollback check for one observed failure mode.

<details><summary>Solutions</summary>

A model can ignore correct retrieved evidence or invent unsupported details. A chunk boundary can separate a condition from its conclusion. A timeout reports missing confirmation, not necessarily transaction failure; idempotency or querying operation state is needed. Release gates should test a concrete contract, not merely whether a process starts.

</details>

**Mastery:** trace a failed request across retrieval, model, tool, and deployment boundaries using recorded evidence. Later units: reranking, hybrid retrieval, agent orchestration, sandboxing, observability, caching, cost control, prompt-injection defenses, and production incident response.
