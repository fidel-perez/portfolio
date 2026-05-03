# `portfolio.json` — schema and consumption guide

Structured summary of `index.html`. Cheap, machine-readable access for any
crew or script that needs portfolio facts without parsing 5500 lines of
HTML or running a knowledge-graph ingest.

This is **Path C** in `docs/FIDEL-JOBS-COMPANY.md` §9 (knowledge ingest).
It avoids both `extractor__extract` (LLM-tax) and `knowledge__ingest`
(blocked on parser gaps).

## Top-level keys

| key                       | type     | meaning |
|---------------------------|----------|---------|
| `identity`                | object   | Name, headline, contact links. Static. |
| `metrics`                 | object   | Hero stats (years, services, sources, nodes). |
| `stack`                   | object   | Categorised tech tags (langs/data/infra/ai/observability/frameworks). |
| `themes`                  | array    | Top-level themes (id, label, summary). Used by `case_study_pick` to match a target's stack. |
| `projects`                | array    | One entry per portfolio project / showcase app. See below. |
| `career_summary`          | array    | Anonymised role highlights — used in cover paragraphs. |
| `value_props_for_outreach`| array    | Short copyable lines for crews drafting outreach. |
| `regenerated_at`          | string   | ISO date stamp from `scripts/portfolio_summary.py`. |
| `source`                  | string   | Source path (always `submodules/portfolio/index.html`). |

## `projects[]` entry

| field             | type    | meaning |
|-------------------|---------|---------|
| `slug`            | string  | URL-safe id; stable across renders. |
| `title`           | string  | Display title. |
| `summary`         | string  | 1–3 sentence prose summary. |
| `anchor`          | string  | Deep-link URL (live demo or portfolio anchor). |
| `tech`            | array   | Tech tags. |
| `themes`          | array   | Theme ids this project demonstrates (cross-ref with `themes[]`). |
| `screenshot`      | string  | Relative path under `submodules/portfolio/` or null. |
| `headline_metric` | string  | One-line proof point. |

## How crews consume it

### Research crew
- Reads `themes[]` + `projects[].themes` to pick the project that best
  overlaps a target company's stack signal (powers `case_study_pick`).
- Reads `value_props_for_outreach[]` to seed cover-letter paragraphs.

### Development crew (microsite render)
- `proof_strip` block reads `metrics`.
- `case_study_pick` block reads the chosen `projects[]` entry.
- `links_strip` block reads `identity.links`.

### Marketing crew (cover/DM drafting)
- Pulls `career_summary[]` highlights as anchor evidence.
- Pulls `value_props_for_outreach[]` as line candidates.

### Architecture crew (IDR draft)
- Reads `themes[]` to frame Fidel-style proposals (agent-orchestration,
  self-hosted-everything, etc.).
- Reads `projects[].themes` to cite a project per opportunity.

## Regeneration

```sh
python3 projects/docker-compose-ai-company/scripts/portfolio_summary.py
```

Idempotent. Re-parses `index.html`, rewrites `portfolio.json` in place.
Diff is committed by the operator (or by `agents-portfolio-bump.sh`).

## Why JSON, not YAML

JSON is parser-universal and avoids the YAML-anchor gotchas a few crews
have hit. The file is small enough that human-readability isn't worse.
