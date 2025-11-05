<!--
SYNC IMPACT REPORT - Constitution v1.2.0

VERSION CHANGE: v1.1.0 → v1.2.0
BUMP RATIONALE: MINOR - Reverted constitution to English; clarified that constitution itself
                        remains in English while enforcing Traditional Chinese for all
                        user-facing documentation, specifications, and plans

MODIFIED PRINCIPLES:
- V. Documentation Language: Clarified that constitution is in English but ALL specs, plans,
  and user-facing docs must be in Traditional Chinese (zh-TW)

TEMPLATES REQUIRING UPDATES:
✅ .specify/templates/plan-template.md - Constitution Check updated with language requirement
✅ .specify/templates/spec-template.md - Header comment updated with zh-TW requirement
✅ .specify/templates/tasks-template.md - Constitution Compliance updated with language note
✅ .specify/templates/checklist-template.md - Header comment updated with zh-TW requirement
✅ .github/prompts/speckit.specify.prompt.md - Language Requirement section added
✅ .github/prompts/speckit.plan.prompt.md - Language Requirement section added
✅ .github/prompts/speckit.tasks.prompt.md - Language Requirement section added
✅ .github/prompts/speckit.checklist.prompt.md - Language Requirement section added
✅ .github/prompts/speckit.clarify.prompt.md - Language Requirement section added

FOLLOW-UP TODOS:
- None - all placeholders resolved with concrete values
- All templates and prompts updated to enforce zh-TW requirement
- Constitution itself remains in English as governance document
-->

# Family Accounting Constitution

**Note**: This constitution is maintained in English as the governance document. However,
per Principle V, all specifications, plans, tasks, and user-facing documentation MUST be
written in Traditional Chinese (zh-TW).

## Core Principles

### I. Code Quality First

Every code contribution MUST adhere to the highest standards of quality and maintainability.

**Non-Negotiable Rules**:
- Code MUST be self-documenting with clear variable/function names
- Complex logic MUST include inline comments explaining the "why", not just the "what"
- All functions MUST have single, well-defined responsibilities (Single Responsibility Principle)
- Code duplication MUST be eliminated through proper abstraction
- All public APIs MUST include comprehensive documentation (docstrings, JSDoc, etc.)
- Linting and formatting tools MUST pass without warnings before commit

**Rationale**: Technical debt compounds rapidly in financial applications. Poor code quality
leads to bugs, security vulnerabilities, and maintenance nightmares. Quality standards prevent
these issues from emerging and ensure long-term project sustainability.

### II. Testing Standards (NON-NEGOTIABLE)

Test-Driven Development (TDD) is mandatory for all features. No implementation without failing tests first.

**Non-Negotiable Rules**:
- Tests MUST be written BEFORE implementation (Red-Green-Refactor cycle)
- Tests MUST fail initially, proving they test the right behavior
- User approval of test scenarios is REQUIRED before implementation begins
- Every feature MUST have:
  * Unit tests for individual functions/components (>80% coverage minimum)
  * Integration tests for user journeys and API contracts
  * Edge case and error condition tests
- Tests MUST run automatically in CI/CD pipeline
- All tests MUST pass before merge to main branch
- Tests MUST be maintained alongside code (never skip test updates)

**Rationale**: Financial data requires absolute correctness. TDD ensures behavior is specified
upfront, reduces bugs, provides living documentation, and enables confident refactoring. This
is non-negotiable because the cost of financial calculation errors far exceeds the cost of
comprehensive testing.

### III. User Experience Consistency

User-facing features MUST provide consistent, intuitive, and accessible experiences across all
interfaces.

**Non-Negotiable Rules**:
- UI components MUST follow established design system patterns
- User interactions MUST provide immediate feedback (loading states, confirmations, errors)
- Error messages MUST be user-friendly, actionable, and specific
- All user journeys MUST be tested for accessibility (WCAG 2.1 AA minimum)
- Mobile and desktop experiences MUST be responsive and optimized for their contexts
- Forms MUST validate input with clear, inline error messages
- Critical actions (delete, transfer money) MUST require explicit confirmation
- User preferences and settings MUST persist across sessions

**Rationale**: Family accounting involves non-technical users who need confidence in the
system. Inconsistent UX creates confusion, errors, and abandonment. Accessibility ensures
the app serves all family members regardless of abilities.

### IV. Performance Requirements

The application MUST be fast, responsive, and efficient to ensure a smooth user experience.

**Non-Negotiable Rules**:
- Initial page load MUST complete within 2 seconds on 3G connection
- UI interactions MUST respond within 100ms (perceived as instantaneous)
- API endpoints MUST respond within 500ms for 95th percentile requests
- Database queries MUST be optimized with appropriate indexes
- Large data sets MUST implement pagination or virtualization
- Images and assets MUST be optimized and lazy-loaded where appropriate
- Bundle sizes MUST be monitored and kept minimal (code splitting enforced)
- Performance regressions MUST be caught in CI with automated benchmarks

**Rationale**: Slow applications frustrate users and reduce adoption. Financial apps are
used frequently throughout the day; any friction compounds user dissatisfaction. Performance
is a feature, not an afterthought.

### V. Documentation Language (Traditional Chinese) - NON-NEGOTIABLE

All specifications, plans, and user-facing documentation MUST be written in Traditional Chinese
(zh-TW) to serve the target user base effectively.

**Non-Negotiable Rules**:
- Feature specifications (spec.md) MUST be written in Traditional Chinese
- Implementation plans (plan.md) MUST be written in Traditional Chinese
- Task lists (tasks.md) MUST be written in Traditional Chinese
- Checklists (checklists/*.md) MUST be written in Traditional Chinese
- User-facing documentation (README, guides, help text) MUST be in Traditional Chinese
- UI text, error messages, and labels MUST be in Traditional Chinese
- Code comments MAY be in English or Traditional Chinese (developer preference)
- Technical API documentation MAY be in English for developer audience
- Commit messages MAY be in English for version control clarity
- **This constitution itself remains in English** as the authoritative governance document

**Rationale**: This is a family accounting application targeting Traditional Chinese-speaking
users. Documentation in their native language ensures clarity, reduces errors from
misunderstanding, and improves adoption. Localization is not optional for core user-facing
materials.

**Exceptions**: Internal technical documentation (architecture diagrams, API schemas, code
comments, and this constitution) may use English when it improves clarity for international
collaboration or when working with English-based frameworks and libraries.

## Performance Benchmarks

The following metrics MUST be monitored and maintained:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time to First Byte (TTFB) | <200ms | Server response time |
| First Contentful Paint (FCP) | <1.0s | Initial render performance |
| Largest Contentful Paint (LCP) | <2.0s | Main content load time |
| Time to Interactive (TTI) | <2.5s | Full interactivity readiness |
| Cumulative Layout Shift (CLS) | <0.1 | Visual stability score |
| API Response (p95) | <500ms | Backend performance |
| API Response (p99) | <1000ms | Backend worst-case |
| Database Query (p95) | <100ms | Query optimization |
| Bundle Size (main) | <250KB gzipped | JavaScript payload |
| Bundle Size (total) | <500KB gzipped | All initial assets |

**Enforcement**: Performance tests MUST run in CI. PRs that degrade metrics by >10% MUST be
justified and approved by tech lead.

## Quality Gates

All features MUST pass through the following checkpoints before being considered complete:

### Gate 1: Specification Review
- User stories are clear, prioritized, and independently testable
- Requirements are complete with measurable success criteria
- Edge cases and error scenarios are documented
- **Specification is written in Traditional Chinese (zh-TW)**

### Gate 2: Test Approval
- Test scenarios cover all acceptance criteria
- Tests are reviewed and approved by stakeholder
- Tests fail as expected (proving they test the right behavior)

### Gate 3: Implementation Review
- Code passes all automated linting and formatting checks
- All tests pass (unit, integration, contract)
- Code review completed with at least one approval
- No unresolved review comments

### Gate 4: Performance Validation
- Performance benchmarks meet targets
- No regressions in key metrics
- Load testing completed for API changes

### Gate 5: UX Validation
- Feature tested on target devices/browsers
- Accessibility audit passed
- User feedback incorporated (if applicable)
- **UI text is in Traditional Chinese (zh-TW)**

### Gate 6: Documentation Complete
- Public APIs documented
- User-facing features have help text or guides
- README and quickstart guides updated if needed
- **All user-facing documentation is in Traditional Chinese (zh-TW)**

**Failure Response**: If any gate fails, work returns to the appropriate phase. No gate may
be skipped without explicit tech lead approval and documented justification.

## Governance

This constitution represents the foundational principles and standards for the Family
Accounting project. It supersedes all other development practices and guides.

### Amendment Process

1. Amendments MUST be proposed via documented issue/PR with rationale
2. Amendments MUST be reviewed by project maintainers
3. Breaking changes require migration plan for existing code
4. Version number MUST be incremented per semantic versioning:
   - **MAJOR**: Backward-incompatible governance changes, principle removals/redefinitions
   - **MINOR**: New principles added or material expansions to guidance
   - **PATCH**: Clarifications, wording improvements, non-semantic refinements

### Compliance

- All code reviews MUST verify compliance with constitution principles
- Constitution violations MUST be documented and justified in plan.md Complexity Tracking
- Repeated violations without justification may result in PR rejection
- Template files (.specify/templates/) MUST align with constitutional requirements
- **Language compliance (Traditional Chinese for specs/plans/docs) is strictly enforced**

### Living Document

This constitution evolves with the project. Developers are encouraged to propose improvements
based on practical experience, provided they maintain the core commitment to quality, testing,
user experience, performance, and language requirements.

**Version**: 1.2.0 | **Ratified**: 2025-11-05 | **Last Amended**: 2025-11-05
