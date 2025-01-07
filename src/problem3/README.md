# Problem #3:

## List out the computational inefficiencies and anti-patterns found in the code block below.

NOTE: I will list out the inefficiencies and anti-patterns found in the code block in the file `messy-task.tsx` by commenting on the code with format `// ISSUE: [issue description]`.

ASSUMPTION: children is also defined in the BoxProps interface.

Refactored code will be 2 files, 1 file for v18 and below (still using useMemo) and 1 file for v19 (not using useMemo).

- `messy-task.tsx` is the original code.
- `refactored-task-v18.tsx` is the refactored code for v18 and below.
- `refactored-task-v19.tsx` is the refactored code for v19.

