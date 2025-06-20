# Task Completion Checklist

When completing any development task, **ALWAYS** run these commands in order:

## Required Quality Checks
1. **Type Checking**: `npm run typecheck`
   - Runs React Router type generation
   - Validates TypeScript types across the entire codebase
   - Must pass with no errors

2. **Linting**: `npm run lint`
   - Runs oxlint with React and React Hooks rules
   - Must pass with no errors (warnings are acceptable but should be addressed)
   - Use `npm run lint:fix` for automatic fixes when possible

3. **Testing**: `npm run test`
   - Runs the full test suite with Vitest
   - All tests must pass
   - For specific tests: `npm run test -- <test-file-pattern>`

## Database Tasks
If changes involve database schema:
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Apply migrations
- Test with `npm run db:seed` if needed

## Before Committing
- Ensure all quality checks pass
- Test the application manually with `npm run dev`
- Verify authentication still works with test credentials
- Check that no console errors appear in browser dev tools

## Commit Guidelines
- **DO NOT** mention Claude Code in commit messages (per CLAUDE.local.md)
- Write clear, descriptive commit messages
- Focus on "why" rather than "what" in commit descriptions