# CalcZen Blog Feature Removal Map

Generated: 2026-11-14T07:48:43.908Z

This map classifies all files referencing "blog" across the CalcZen repository into **REMOVE**, **KEEP (calculator content)**, and **EDIT**.

## 1. Summary Counts

- **REMOVE (Files to delete)**: 25
- **KEEP (Calculator content & layouts)**: 49
- **EDIT (Shared files to update)**: 29
- **Total Files Audited**: 103

## 2. Detailed Classification

| File Path | Classification | Purpose / Action |
| :--- | :--- | :--- |
| `src/app/blog/BlogClient.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/app/blog/page.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/app/blog/[category]/[slug]/BlogDetailClient.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/app/blog/[category]/[slug]/page.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/app/blog/[slug]/page.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/app/HomeClient.tsx` | **EDIT** | Legacy file - clean up blog references if any |
| `src/calculators/401kCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/AcElectricityCostCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/AgeCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/ApplianceElectricityCostCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/AttendanceCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/BMICalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/BMRCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/BodyFatCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/CalorieCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/CementBagCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/CGPACalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/CompoundInterestCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/CreditCardEMICalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/DiamondJewelleryPriceCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/FDCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/FertilityCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/GoldJewelleryBillCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/GoldLoanAgainstJewelleryCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/GoldMakingChargesCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/GoldPurityKaratConverter.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/GSTCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/GstInvoiceCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/HomeElectricityBillCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/InflationCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/JewelleryBudgetToWeightCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/JobOfferCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/LoanEligibilityCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/LoanEMICalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/MortgageCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/OldGoldExchangeValueCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/PercentageCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/PregnancyDueDateCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/ProductProfitCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/ProteinCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/RccPriceCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/RetirementCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/SalaryCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/ScientificCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/SilverJewelleryBillCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/SIPCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/SleepCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/StandardCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/TipCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/calculators/WaterIntakeCalculator.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/components/BlogSection.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/components/CalculatorBlog.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/components/CalculatorPageLayout.tsx` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/components/HeroSection.tsx` | **EDIT** | Remove or replace blog links |
| `src/components/layout/Footer.tsx` | **EDIT** | Replace "Blog" footer link with "Tools" |
| `src/components/layout/Header.tsx` | **EDIT** | Replace "Blog" nav item with "Tools" |
| `src/data/blogContent.ts` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/data/homeContent.ts` | **EDIT** | Replace/remove blog references |
| `src/data/staticPagesContent.ts` | **EDIT** | Remove blog section references |
| `src/lib/blog-api.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/routes/blog.$category.$slug.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/routes/blog.$slug.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/routes/blog.index.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/routes/blog.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `src/routes/index.tsx` | **EDIT** | Remove BlogSection, replace blog link with Tools |
| `src/routeTree.gen.ts` | **EDIT** | Regenerate automatically without blog routes |
| `src/styles.css` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `src/utils/blog-parser.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `admin/src/App.tsx` | **EDIT** | Remove /blogs and /blogs/new admin routes |
| `admin/src/components/AdminLayout.tsx` | **EDIT** | Remove "Blogs" navigation item from sidebar |
| `admin/src/pages/BlogEditor.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `admin/src/pages/BlogList.tsx` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `admin/src/pages/Infrastructure.tsx` | **EDIT** | Remove blog cache purge / counts if present |
| `admin/src/services/api.ts` | **EDIT** | Remove blog API client methods |
| `admin/src/styles.css` | **KEEP (calculator content)** | Per-calculator article/SEO content & typography styles |
| `server/src/app.ts` | **EDIT** | Unmount /api/blogs router and blog upload static directory |
| `server/src/controllers/blogAdminController.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/controllers/blogController.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/controllers/infrastructureController.ts` | **EDIT** | Remove blog cache purge logic |
| `server/src/routes/adminRoutes.ts` | **EDIT** | Unmount blog admin endpoints |
| `server/src/routes/blogRoutes.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/scripts/backfillBase64Images.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/scripts/backfillSeoWithImages.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/services/blogService.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/types/database.ts` | **EDIT** | Remove Blog / BlogPost types |
| `server/src/utils/blogHtmlRenderer.ts` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `server/src/utils/imageOptimizer.ts` | **EDIT** | Keep if used by other features, or remove blog-specific optimizer |
| `server/src/utils/seo.ts` | **EDIT** | Remove blog SEO helpers |
| `server/src/utils/serializers.ts` | **EDIT** | Remove blog serializer |
| `server/src/utils/sitemap.ts` | **EDIT** | Remove blog sitemap generator logic |
| `scripts/generate-sitemap.mjs` | **EDIT** | Remove blog URLs and sitemap-blogs.xml; add /tools |
| `scripts/generate-sitemap.ts` | **EDIT** | Remove blog URLs and sitemap-blogs.xml; add /tools |
| `scripts/map-blogs.mjs` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `scripts/prerender.ts` | **EDIT** | Remove blog URL prerendering and blog API call; add /tools |
| `scripts/update-group2.mjs` | **EDIT** | Script artifact from previous migration |
| `public/admin/index.html` | **EDIT** | Remove blog references if any |
| `public/llms.txt` | **EDIT** | Remove /blog entries |
| `public/robots.txt` | **EDIT** | Remove Sitemap: sitemap-blogs.xml |
| `public/rss.xml` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `public/sitemap-blogs.xml` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `public/sitemap-news.xml` | **REMOVE** | Standalone blog-specific route, page, component, controller, service, or XML feed |
| `public/sitemap.xml` | **EDIT** | Remove /blog entries; add /tools |
| `package.json` | **EDIT** | Remove db:migrate-blogs script |
