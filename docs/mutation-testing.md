# Mutation Testing

This repository uses mutation testing to ensure the effectiveness of our test suite. While code coverage tells us which lines are executed, mutation testing tells us if our tests actually catch bugs by injecting faults (mutants) into the source code.

## The "Source of Truth"

We maintain a baseline for our mutation score in `docs/mutation-baseline.json`. This file represents the current "gold standard" for our project's test effectiveness.

- **Baseline Score**: The mutation score from the `main` branch.
- **Total Mutants**: Total number of mutants generated during the last baseline run.

---

## Workflow

### 1. Updating the Baseline (on `main`)

When a significant change is merged into the `main` branch, we update our baseline to reflect the new state of the project. This ensures that future PRs compare against the most up-to-date test effectiveness.

**Command:**
```bash
pnpm run mutate:baseline
```

**Steps:**
1. Ensure you are on the `main` branch.
2. Run the command above.
3. Commit and push the updated `docs/mutation-baseline.json` to `main`.

### 2. Comparing Scores (on Pull Requests)

When working on a feature branch or opening a pull request, we run the comparison script to ensure that new changes haven't caused a regression in our mutation score.

**Command:**
```bash
pnpm run mutate:compare
```

**Expected Results:**
- **Success**: If the mutation score is equal to or higher than the baseline.
- **Failure**: If the mutation score has decreased (a negative delta).

This check is automated in our CI/CD pipeline via `.github/workflows/mutation-check.yml`.

---

## Equivalent Mutants

Sometimes mutants are **equivalent** — they change the code but produce identical observable behavior. These cannot be killed without refactoring the code itself, and they should be documented rather than chased indefinitely.

### Known Equivalent Mutants

#### `app/api/me/subscriptions/route.ts` — Catch block (4 mutants)

**Location**: Lines 71-76, the catch block for JSON parsing errors:

```typescript
} catch {
  // Not JSON — use raw text
  if (text) {
    backendError = text
  }
}
```

**Why they survive**: The four surviving mutants (IDs 127, 128, 129, 130) modify the `if (text)` condition or remove the catch block/assignment entirely. However, due to the `backendError || text` fallback on line 89, all variations produce the same observable output:

| Mutation | Code Change | Observable Result |
|----------|-------------|-------------------|
| Remove catch block | `} catch {}` | `backendError` stays null → fallback uses `text` |
| Remove assignment | `if (text) {}` | Same as above |
| `if (text)` → `true` | Always assigns | Same value assigned as fallback would use |
| `if (text)` → `false` | Never assigns | Falls through to fallback `text` |

**Decision**: These are accepted equivalent mutants. The code is correct and the fallback ensures consistent behavior regardless of mutations.

**How to suppress**: If you want Stryker to ignore these mutants in future runs, add inline suppression comments with mutant IDs:

```typescript
} catch {
  // Not JSON — use raw text
  if (text) {
    // Stryker disable ConditionalExpression : Equivalent mutants (IDs 128, 129)
    backendError = text // Stryker disable BlockStatement : Equivalent mutant (ID 130)
  }
} // Stryker disable BlockStatement : Equivalent mutant (ID 127)
```

Or suppress by mutator name if you don't want to track IDs:

```typescript
// Stryker disable-all-line BlockStatement,ConditionalExpression : Equivalent mutants — 
// the `backendError || text` fallback makes these mutations unkillable
```

#### `app/api/auth/sync/route.ts` — Log message tag (1 mutant)

**Location**: Line 37, the log tag string `'[api/auth/sync]'`

**Why it survives**: Mutating the tag prefix to an empty string produces a message that still contains the meaningful content. The test asserts on the full message including the tag, but this specific mutant is effectively equivalent — changing just the tag prefix while keeping the rest of the message intact produces a string that is still semantically identical for logging purposes.

---

## Suppressing Equivalent Mutants in Stryker

Stryker supports inline suppression comments to mark equivalent mutants. This prevents them from appearing as "survived" in future runs.

### Syntax

```typescript
// Single-line suppression (by mutant ID or mutator name)
mutatedCode() // Stryker disable MutatorName : Reason explanation

// Multi-line suppression (applies to next block)
// Stryker disable MutatorName : Reason explanation
if (condition) {
  block()
}
// Stryker restore MutatorName

// Suppress multiple mutators on next block
// Stryker disable-all-block MutatorA,MutatorB : Reason
```

### Available Suppression Types

| Directive | Scope | Example |
|-----------|-------|---------|
| `Stryker disable-line MutatorName` | Current line only | `code() // Stryker disable-line StringLiteral : Equivalent` |
| `Stryker disable MutatorName` | Next block only | `// Stryker disable BlockStatement : Equivalent\nif (x) {}` |
| `Stryker restore MutatorName` | End block scope | `// Stryker restore BlockStatement` |
| `Stryker disable-all-line MutatorA,MutatorB` | Current line, multiple mutators | `// Stryker disable-all-line StringLiteral,BooleanLiteral : Equivalent` |
| `Stryker disable-all-block MutatorA,MutatorB` | Next block, multiple mutators | `// Stryker disable-all-block BlockStatement,StringLiteral : Equivalent` |

### Best Practices

1. **Document the reason**: Always include a clear explanation of why the mutant is equivalent
2. **Include mutant IDs**: Reference specific IDs from `reports/mutation/mutation.json` for traceability
3. **Update baseline**: After suppressing mutants, run `pnpm run mutate:baseline` to update the baseline
4. **Consider refactoring**: If you find yourself suppressing many mutants in a file, consider whether the code structure could be improved