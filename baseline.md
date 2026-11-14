# CalcZen Optimization Baseline

Date: 2026-11-14

## 1. Bundle & Chunk Sizes (`npm run build`)
- Largest JS application chunk (`dist/assets/index-*.js`): **555.37 kB** (raw) / **165.38 kB** (gzip)
- Total transformed modules: 3,404 modules
- Built time: ~28.5s

## 2. TypeScript Diagnostic Errors (`npx tsc --noEmit`)
- Total TS errors: **186** errors
- Primary contributors:
  - Legacy Next.js route files in `src/app/**` (referencing missing `next` & `next/navigation`)
  - Legacy `src/components/ui/Link.tsx`
  - Calculators passing unneeded `onCalculate` and `category` props to `EmptyResultPlaceholder`
  - Route type mismatches in `HeroCalculatorVisual.tsx`
  - Calculator prop & type misalignments (e.g. `CementBagCalculator`, `401kCalculator`, `CGPACalculator`, PDF export props)

## 3. Headless Chrome Calculator Audit (`node scripts/audit-calculators.mjs`)
- Total calculators audited: **46**
- Passed: **46**
- Failed: **0**
- All 46 routes load, calculate, and trigger interactions with 0 runtime errors.
