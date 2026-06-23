# AI Evals for Everyone Handbook
Source: handbook_evals_updated.pdf (Aishwarya Naresh Reganti & Kiriti Badam)

## Table of contents
1. WTH are AI Evals?
2. Model Evaluations vs Product Evaluations
3. The Evaluation Framework
4. Building Reference Datasets
5. Implementing Evaluation Metrics
6. Production Challenges
7. Production Monitoring Strategies
8. The Complete Evaluation Process
9. Common Misconceptions About AI Evaluation
10. Glossary of Terms

## Chapter 1: The core insight — non-determinism

Traditional software (World 1): Input X → Predefined Logic → Output Y (always the same)
AI software (World 2): Natural Language Input → Probabilistic Model → Output B/C/D (varies)

This breaks classical testing assumptions in two ways:
1. **Input space is unbounded** — users express intent in natural language you can't predict
2. **Output is not guaranteed** — same input can yield different responses across runs

Traditional unit tests ask: "Did the system do exactly what we expected?"
AI evals ask: "Does the system behave acceptably across a range of conditions?"

## Chapter 2: Model Evals vs Product Evals — the crucial distinction

| | Model Evals | Product Evals |
|---|---|---|
| Who does it | Frontier labs, researchers | Product teams |
| Question | How capable is this model generally? | Does it work for MY use case? |
| Method | Standardized benchmarks, fixed datasets | Domain-specific tasks, real user data |
| Limitation | Domain agnostic — won't tell you product fit | Context-specific — can't compare across products |

**Key insight**: A model can score well on benchmarks and still fail unacceptably for your product. You always need your own product evals.

## Terminology (from Chapter 1)
- **Evaluation**: The overall process of assessing how an AI system behaves — not a single test, score, or dashboard
- **Benchmark / Eval harness**: The setup used to run evaluations repeatably (dataset + execution process)
- **Evaluation metrics**: Dimensions along which behavior is judged — always context-dependent, always need rubrics
- **Rubric**: Defines what "good" and "failure" look like in a given context — makes vague metrics like "helpfulness" concrete

## Why "evals" causes confusion
The word is used to mean:
- Benchmark scores (researchers)
- Rubrics for product behavior (PMs)
- Training datasets + annotation guidelines (data labeling companies)
- LLM-as-judge outputs (engineers)

These are all different things. The handbook uses "evaluation" throughout to force precision.

## Reading notes for this project
- Chapter 4 (Reference Datasets) → how to build the test cases for our grid world
- Chapter 5 (Eval Metrics) → start with code-based, add LLM judge later
- Chapter 9 (Common Misconceptions) → "benchmarks don't predict reality", "it's never one-and-done"
