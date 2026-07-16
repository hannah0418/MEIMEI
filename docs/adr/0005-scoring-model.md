# Scoring is a plain sum over equal-size signatures, with ties broken by rarity

Twelve questions, four options each, and every option scores exactly one Trait by +1. A Persona's score is the plain sum of its three Trait scores, and the highest wins. Every Persona is exactly three Traits so that no Persona wins by arithmetic — under summing, a larger signature collects more points regardless of the answers, which would have made the five smaller Personas nearly unreachable and reintroduced the reachability failure that killed the pattern layer in ADR-0001.

## Considered Options

- **Weighted options** (an answer spreading 0.6 Analysis / 0.3 Rigor / 0.1 Speed) — richer, rejected because it needs tuning against simulated respondents that we have no time to run, and it cannot be debugged on paper at a booth.
- **Averaging instead of summing** — also neutralises unequal signatures, rejected because it makes a 2-Trait Persona easier to max out than a 3-Trait one: a subtler bias traded for a known one.
- **Random tie-break** — rejected outright. Students at a booth take the quiz together and compare; identical answers producing different Personas reads as a broken app, publicly. It also makes bugs unreproducible on an offline laptop.

## Consequences

Ties are common — twelve points over three-Trait signatures is coarse — so they resolve deterministically down a fixed order from rarest Persona to commonest, by how many Personas each of its Traits feeds: Diva Scrum Master, Loop Legend, Code Cutie (7), then Binary Babe, Debug Master, Syntax Superstar, Cool Dev (8), then Spark UI Designer (9). Rarest wins. The Rigor spine already gives Rigor-drawing Personas more paths to points, so awarding ties to the rare counterbalances rather than compounds it. In code this is one sort key: `(score desc, rarity-priority asc)`.

Two authoring rules follow and are not optional. Each Trait needs roughly 4–5 of the 48 option slots, or its Personas become unreachable — Command, Grit and Play are owned by exactly one Persona each, so starving them erases Diva, Loop Legend and Code Cutie. And within a single question, the four options must pull toward four different Personas: a question offering Analysis / Rigor / Speed / Composure is just asking "Binary Babe or Debug Master?", which is picking, not answering.
