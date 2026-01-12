These standards must be followed for all code, UI, UX, and architecture decisions.

1. Engineering Mindset

Optimize for clarity, correctness, and maintainability

Prefer simple, explicit solutions

Avoid cleverness unless it clearly reduces complexity

Every line of code must have a reason to exist

If something is impressive but unnecessary, do not add it.

2. Code Quality

Write readable, self-explanatory code

Use meaningful names (variables, functions, components)

Keep functions small and focused

Avoid deep nesting without justification

Code should be easy to understand without comments.

3. Structure & Organization

One file = one clear responsibility

Group related logic together

Avoid circular dependencies

Keep files reasonably sized

Structure should reflect intent, not convenience.

4. Abstractions

Do not abstract early

Introduce abstraction only when duplication or complexity is real

Prefer composition over inheritance

Avoid generic utilities without a clear use case

Every abstraction must reduce mental load.

5. Styling & UI (General)

Consistency over creativity

Reuse patterns instead of inventing new ones

Visual hierarchy must be clear

Whitespace is intentional, not accidental

UI should feel stable and predictable.

6. Interaction & UX

Every interactive element must have:

Hover feedback

Active / pressed feedback

Focus feedback

Feedback must be subtle and immediate

Avoid surprising behavior

UX should reinforce user confidence.

7. Motion & Animation

Motion must serve a purpose

Keep animations short and restrained

Avoid unnecessary or decorative animations

Respect user preferences (reduced motion)

If motion does not improve understanding, remove it.

8. Accessibility

Use semantic HTML

Ensure keyboard navigation works

Provide visible focus states

Do not rely on color alone to convey meaning

Accessibility is a baseline requirement.

9. Performance

Avoid unnecessary re-renders

Prefer lightweight solutions

Do not introduce heavy dependencies without strong justification

Performance is part of user experience

Fast and stable beats clever and slow.

10. Error Handling & Edge Cases

Handle failure paths explicitly

Avoid silent failures

Prefer clear error states over hidden behavior

Assume things can and will fail.

11. Consistency

Follow existing patterns before introducing new ones

Naming, spacing, and structure should be uniform

Inconsistency is technical debt

NOTE: Try to write optimized and minimum code, where ever a good library exsist use that instad of writing manual code
