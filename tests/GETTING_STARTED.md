# Getting Started with Tests

## Installation

First, install the test dependencies:

```bash
npm install --save-dev @types/jest jest jest-environment-node
```

## Running Tests

### All tests
```bash
npm test
```

### Watch mode (for development)
```bash
npm run test:watch
```

### Coverage report
```bash
npm run test:coverage
```

## Test Structure

```
tests/
├── repositories/
│   └── defects.repository.test.ts    # 11 test cases
└── services/
    └── defects.service.test.ts       # 15 test cases
```

**Total: 26 comprehensive test cases**

## What's Tested

### ✅ Repository Layer
- Database queries with Prisma mocks
- Success cases
- Error propagation
- Empty results

### ✅ Service Layer  
- Business logic validation
- DTO conversion
- Error handling (404, 400)
- Repository orchestration

## Quick Example

```typescript
// Repository test with Prisma mock
jest.mock('@/app/lib/prisma', () => ({
  rolls: { findUnique: jest.fn() },
  // ...
}))

// Service test with repository mock
jest.mock('@/repositories/defects.repository')
```

## Expected Output

```
PASS  tests/repositories/defects.repository.test.ts
PASS  tests/services/defects.service.test.ts

Test Suites: 2 passed, 2 total
Tests:       26 passed, 26 total
Time:        3.142s
```

## Troubleshooting

### TypeScript errors in tests?
Make sure `@types/jest` is installed:
```bash
npm install --save-dev @types/jest
```

### Mock not working?
Clear Jest cache:
```bash
npx jest --clearCache
```

## Next Steps

After installing dependencies:
1. Run `npm test` to verify all tests pass
2. Run `npm run test:coverage` to check coverage (should be >80%)
3. Start developing with `npm run test:watch`

