# Implementation Plan: Bi-Weekly Autopay Support

## Overview
This feature extends the existing autopay functionality to support bi-weekly payment cadence, enabling users to align loan payments with their bi-weekly paychecks. The implementation includes:

- **Budget Match Mode**: Split monthly payment into two bi-weekly payments with logic to handle months with 3 pay dates
- **Fast Track Mode**: Use `(Monthly Payment × 12) ÷ 26` formula for accelerated payoff
- **Schedule Preview**: Interactive UI to show upcoming payments, adjustments for holidays/weekends, and payoff projections
- **Payoff Estimate**: Comparison of payoff date and interest saved vs. monthly payments
- **Flexible Payday Anchor**: Support for both day-of-week (every Friday) and specific date (next payday is Jan 15)

## User Story
**As a** loan borrower,  
**I want to** set up autopay with a bi-weekly cadence,  
**so that** my payments can align with my paycheck schedule and potentially pay off my loan faster.

### Acceptance Criteria
1. **Cadence Selection**: User can select "Bi-Weekly" cadence on the autopay setup form.
2. **Mode Selection**: User can choose between "Budget Match" and "Fast Track" modes.
3. **Payday Anchor**: User can either:
   - Select a day of week (e.g., "every Friday") - first occurrence becomes the start date
   - Enter a specific next payday date (e.g., "Jan 15, 2025")
4. **Budget Match Behavior**:
   - Each payment = Monthly Payment ÷ 2
   - If a calendar month contains the third bi-weekly date, indicate it in the preview but do not schedule a payment on that date.
5. **Fast Track Behavior**:
   - Each payment = (Monthly Payment × 12) ÷ 26
   - This results in extra principal payments that accelerate loan payoff.
6. **Schedule Preview**:
   - Display a preview of next 12-24 payments (or all payments until payoff)
   - Show original and adjusted dates for weekend/holiday adjustments
   - Highlight third paydates in Budget Match mode (no payment scheduled)
7. **Payoff Estimate**:
   - Projected payoff date(s) for the selected bi-weekly mode
   - Total interest saved compared to standard monthly payments
8. **Business Day Adjustment**: Payments falling on weekends or US federal holidays are adjusted to the previous business day.
9. **Confirmation**: User must review and confirm the schedule preview before activating autopay.

### Assumptions
- The database schema for `autopay_configs` and `payment_schedules` already supports bi-weekly cadence (`cadence: 'bi_weekly'`).
- US federal holiday list will be hardcoded for MVP (extensible to API later).
- Tdme system will not schedule payments on the third bi-weekly occurrence in a month for Budget Match mode.
- Payoff estimates are calculated using existing amortization logic and compared against hypothetical monthly payments.
- Existing date utilities `formatDate()`, `getNextBusinessDay()`, `isWeekend()` can be extended with holiday detection.
- The schedule preview page (`app/autopay/preview/page.tsx`) exists as a skeleton implementation (noted in README.md).
- Ucer flow: Setup Form → Preview Page ₒ Confirmation ₒ Dashboard.

---

## Research Findings

### Existing Codebase Patterns

**Similar Features**:
- `app/autopay/setup/page.tsx`: Existing autopay setup form with cadence selection (currently monthly only)
- `app/autopay/edit/page.tsx`: Edit autopay configuration form
- `app/autopay/preview/page.tsx`: Skeleton implementation (mentioned in README.md)
- `app/api/autopay/setup/route.ts`: API route for creating autopay configs (currently rejects bi-weekly)
- `app/api/autopay/update/route.ts`: API route for updating autopay configs
- `app/api/loans/create/route.ts`: Amortization calculation pattern (reusable for payoff estimates)

**Reusable Components**:
- `components/ui/button.tsx`, `input.tsx`, `select.tsx`, `card.tsx`: UI components
- `lib/utils.ts`: Date utilities (`formatDate`, `getNextBusinessDay`, `isWeekend`)
- `lib/types.ts`: TypeScript types (`AutopayCadence: 'monthly' | 'bi_weekly'`, `AutopayMode: 'budget_match' | 'fast_track'`)
- `lib/supabase.ts`: Supabase client for database access

**Established Patterns**:
- API routes use Next.js app-directory style (`route.ts`)
- Forms use Shadcn/UI components with React state
- Amortization calculations follow standard loan amortization formulas
- Database schema: `autopay_configs`, `payment_schedules`, `loans` tables
- Error handling: API routes return JSON with `error` field and appropriate HTTP status codes

---

## Technical Context

- **Tech Stack**:
  - **Frontend**: Next.js 14, React, TypeScript, Shadcn/UI components, Tailwind CSS
  - **Backend**: Next.js API Routes (App Router)
  - **Database**: Supabase (PostgreSQL)
  - **Auth**: Supabase Auth (implicit in existing implementation)

- **Dependencies**:
  - Supabase client (`@supabase/supabase-js`)
  - Date manipulation library (currently native JavaScript `Date`)
  - Shadcn/UI component library

- **Integrations**:
  - `autopay_configs` table (new `cadence: 'bi_weekl{'` entries)
  - `payment_schedules` table (bi-weekly schedule entries)
  - `loans` table (read monthly payment, APR, balance)
  - Existing date utilities in `lib/utils.ts`

---

## API Contracts

> **Note**: This OpenAPI 3.0.3 specification describes all API endpoints, request/response schemas, authentication, and error responses needed for this feature implementation.

```yaml
openapi: 3.0.3
info:
  title: Bi-Weekly Autopay API
  version: 1.0.0
  description: API endpoints for bi-weekly autopay setup, schedule preview, and payoff estimates.

servers:
  - url: http://localhost:3000
    description: Local development server

paths:
  /api/autopay/setup:
    post:
      summary: Create autopay configuration (including bi-weekly)
      description: Creates new autopay configuration for a loan with specified cadence (monthly or bi-weekly) and mode. Also generates initial payment schedule.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - loanId
                - cadence
                - mode
                - paydayAnchor
                - startDate
              properties:
                loanId:
                  type: string
                  format: uuid
                  description: UUID of the loan
                cadence:
                  type: string
                  enum: ['monthly', 'bi_weekly']
                  description: Payment cadence
                mode:
                  type: string
                  enum: ['budget_match', 'fast_track']
                  description: Autopay mode
                paydayAnchor:
                  type: string
                  description: Day of week ('monday', 'friday', etc.) or specific date ('YYYY-MM-DD')
                  example: "friday"
                startDate:
                  type: string
                  format: date
                  description: First payment date
                  example: "2025-01-15"
            example:
              loanId: "123e4567-e89b-12d3-a456-426614174000"
              cadence: "bi_weekly"
              mode: "fast_track"
              paydayAnchor: "friday"
              startDate: "2025-01-15"
      responses:
        '201':
          description: Autopay configuration created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                    format: uuid
                    description: Generated autopay config ID
                  cadence:
                    type: string
                  mode:
                    type: string
                  startDate:
                    type: string
                    format: date
                  paydayAnchor:
                    type: string
                  scheduleIds:
                    type: array
                    items:
                      type: string
                      format: uuid
                    description: Generated payment schedule IDs
            example:
              id: "789e4567-e89b-12d3-a456-426614174000"
              cadence: "bi_weekly"
              mode: "fast_track"
              startDate: "2025-01-15"
              paydayAnchor: "friday"
              scheduleIds: ["111e4567-e89b-12d3-a456-426614174000", "..."]
        '400':
          description: Bad request (invalid parameters)
          content:
            application/json:
              schema:
                $ref: '#components/schemas/ErrorResponse'
        '404':
          description: Loan not found
          content:
            application/json:
              schema:
                $ref: '#components/schemas/ErrorResponse'
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: '#components/schemas/ErrorResponse'

  /api/autopay/preview: 
    post:
      summary: Generate payment schedule preview
      description: Generates a preview of the payment schedule for the specified autopay configuration without persisting to database. Includes business day adjustments and third paydate indicators.
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - loanId
                - cadence
                - mode
                - paydayAnchor
                - startDate
              properties:
                loanId:
                  type: string
                  format: uuid
                cadence:
                  type: string
                  enum: ['monthly', 'bi_weekly']
                mode:
                  type: string
                  enum: ['budget_match', 'fast_track']
                paydayAnchor:
                  type: string
                startDate:
                  type: string
                  format: date
                previewCount:
                  type: integer
                  description: Number of payments to preview (default: 24)
                  default: 24
                  minimum: 1
                  maximum: 100
            example:
              loanId: "123e4567-e89b-12d3-a456-426614174000"
              cadence: "bi_weekly"
              mode: "budget_match"
              paydayAnchor: "friday"
              startDate: "2025-01-15"
              previewCount: 24
      responses:
        '200':
          description: Schedule preview generated successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  schedule:
                    type: array
                    items:
                      $ref: '#components/schemas/SchedulePreviewItem'
                  payoffEstimate:
                    $ref: '#components/schemas/PayoffEstimate'
            example:
              schedule:
                - scheduledDate: "2025-01-15"
                  originalDate: "2025-01-15"
                  amount: 462.00
                  isAdjusted: false
                  isThirdPaydate: false
                - scheduledDate: "2025-01-29"
                  originalDate: "2025-01-29"
                  amount: 462.00
                  isAdjusted: false
                  isThirdPaydate: false
                - scheduledDate: "2025-02-12"
                  originalDate: "2025-02-12"
                  amount: 462.00
                  isAdjusted: false
                  isThirdPaydate: false
                - scheduledDate: "2025-02-26"
                  originalDate: "2025-02-26"
                  amount: 0.00
                  isAdjusted: false
                  isThirdPaydate: true
              payoffEstimate:
                biWeeklyPayoffDate: "2030-05-15"
                biWeeklyTotalInterest: 3500.00
                monthlyPayoffDate: "2030-12-15"
                monthlyTotalInterest: 4200.00
                interestSaved: 700.00
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#components/schemas/ErrorResponse'
        '404':
          description: Loan not found
          content:
            application/json:
              schema:
                $ref: '#components/schemas/ErrorResponse'
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                $ref: '#components/schemas/ErrorResponse'

components:
  schemas:
    SchedulePreviewItem:
      type: object
      properties:
        scheduledDate:
          type: string
          format: date
          description: Adjusted payment date (business day after holiday/weekend adjustment)
        originalDate:
          type: string
          format: date
          description: Original bi-weekly date before adjustment
        amount:
          type: number
          format: double
          description: Payment amount (0.00 for third paydates in Budget Match)
        isAdjusted:
          type: boolean
          description: Whether date was adjusted for holiday/weekend
        isThirdPaydate:
          type: boolean
          description: Whether this is a third paydate in the month (no payment scheduled for Budget Match)
      required:
        - scheduledDate
        - originalDate
        - amount
        - isAdjusted
        - isThirdPaydate

    PayoffEstimate:
      type: object
      properties:
        biWeeklyPayoffDate:
          type: string
          format: date
          description: Projected payoff date for bi-weekly schedule
        biWeeklyTotalInterest:
          type: number
          format: double
          description: Total interest paid over bi-weekly schedule
        monthlyPayoffDate:
          type: string
          format: date
          description: Projected payoff date for hypothetical monthly schedule
        monthlyTotalInterest:
          type: number
          format: double
          description: Total interest paid over hypothetical monthly schedule
        interestSaved:
          type: number
          format: double
          description: Interest saved by using bi-weekly instead of monthly
      required:
        - biWeeklyPayoffDate
        - biWeeklyTotalInterest
        - monthlyPayoffDate
        - monthlyTotalInterest
        - interestSaved

    ErrorResponse:
      type: object
      properties:
        error:
          type: string
          description: Error message
      required:
        - error
```

---

## Architecture & Design

### Component Overview

The bi-weekly autopay feature extends the existing autopay architecture with new components:

1. **Frontend**:
   - `app/autopay/setup/page.tsx`: Updated to support bi-weekly cadence and payday anchor selection
   - `app/autopay/preview/page.tsx`: New schedule preview page with payoff estimates
   - `components/autopay/SchedulePreviewTable.tsx`: Table component to display schedule with adjustments
   - `components/autopay/PayoffEstimateCard.tsx`: Card component to show payoff comparison

2. **Backend APIs**:
   - `app/api/autopay/setup/route.ts`: Updated to handle `cadence: 'bi_weekly'`
   - `app/api/autopay/preview/route.ts`: New endpoint for schedule preview generation

3. **Utilities**:
   - `lib/utils/date.ts`: Extended with holiday detection and bi-weekly date generation
   - `lib/utils/schedule.ts`: New utility for bi-weekly schedule generation and third paydate detection
   - `lib/utils/amortization.ts`: New utility for payoff estimate calculations

4. **Database**:
   - `autopay_configs`: Already supports `cadence: 'bi_weekly'`
   - `payment_schedules`: Already supports bi-weekly schedule entries

### Data Model

**Existing Tables (No Changes Required)**:

```sql
-- autopay_configs already supports bi-weekly cadence
CREATE TABLE autopay_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_id UUID NOT NULL REFERENCES loans(id),
  cadence TEXT NOT NULL CHECK (cadence IN ('monthly', 'bi_weekly')),
  mode TEXT NOT NULL CHECK (mode IN ('budget_match', 'fast_track')),
  start_date DATE NOT NULL,
  payday_anchor TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- payment_schedules already supports bi-weekly entries
CREATE TABLE payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autopay_config_id UUID NOT NULL REFERENCES autopay_configs(id),
  scheduled_date DATE NOT NULL,
  original_date DATE,
  amount NUMERIC(10, 2) NOT NULL,
  is_adjusted BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processed', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**TypeScript Interfaces**:

```typescript
// lib/types.ts
export type AutopayCadence = 'monthly' | 'bi_weekly';
export type AutopayMode = 'budget_match' | 'fast_track';

export interface AutopayConfig {
  id: string;
  loan_id: string;
  cadence: AutopayCadence;
  mode: AutopayMode;
  start_date: string;
  payday_anchor: string;
  is_active: boolean;
}

export interface SchedulePreviewItem {
  scheduledDate: string;
  originalDate: string;
  amount: number;
  isAdjusted: boolean;
  isThirdPaydate: boolean;
}

export interface PayoffEstimate {
  biWeeklyPayoffDate: string;
  biWeeklyTotalInterest: number;
  monthlyPayoffDate: string;
  monthlyTotalInterest: number;
  interestSaved: number;
}
```

### Security Considerations

1. **Authentication**:
   - All API endpoints require Supabase authentication
   - Users can only access/modify their own autopay configs

2. **Authorization**:
   - Row-level security (RLS) policies on `autopay_configs` and `payment_schedules`
   - Verify user owns the loan before creating/modifying autopay

3. **Input Validation**:
   - Validate cadence, mode, and date formats on both client and server
   - Prevent invalid dates (e.g., start date in the past)

4. **Data Integrity**:
   - Transactional inserts for `autopay_configs` and `payment_schedules`
   - Foreign key constraints to ensure referential integrity

### Error Handling

1. **API Errors**:
   - Return JSON with `error` field and appropriate HTTP status codes
   - `400`: Bad request (invalid parameters)
   - `404`: Loan not found
   - `500`: Internal server error

2. **Frontend Errors**:
   - Display user-friendly error messages in toast notifications
   - Form validation errors displayed inline

3. **Edge Cases**:
   - Handle loans with no balance (prevent autopay creation)
   - Handle loans already paid off
   - Handle loans with existing autopay (update or prevent duplicate)

---

## Implementation Phases

### Phase 0: Research & Discovery
- [x] Review existing autopay implementation *(ncompleted during planning)*
- [ ] Validate APB�contract with frontend team
- [ ] Review database schema consistency

### Phase 1: Core Backend Implementation
- [ ] Create `lib/utils/date.ts` with holiday detection:
  - Hardcode US federal holidays for 2025-2030
  - Extend `isBusinessDay()` to include holiday checks
  - Extend `getNextBusinessDay()` to handle holidays

- [ ] Create `lib/utils/schedule.ts` with bi-weekly logic:
  - `generateBiWeeklyDates()`: Generate bi-weekly dates from start date
  - `detectThirdPaydate()`: Detect if a date is the third occurrence in a month
  - `adjustForBusinessDay()`: Adjust dates falling on weekends/holidays

- [ ] Create `lib/utils/amortization.ts` with payoff calculations:
  - `calculateBiWeeklyPayoff()`: Simulate bi-weekly payment schedule
  - `calculateMonthlyPayoff()`: Simulate monthly payment schedule
  - `comparePayoffEstimates()`: Compare bi-weekly vs. monthly

- [ ] Update `app/api/autopay/setup/route.ts`:
  - Remove rejection of `cadence: 'bi_weekly'`
  - Add logic to generate bi-weekly schedule
  - Calculate payment amount based on mode: 
    - Budget Match: `monthlyPayment / 2`
    - Fast Track: `(monthlyPayment * 12) / 26`
  - Exclude third paydates in Budget Match mode
  - Insert autopay config and schedule in transaction

- [ ] Create `app/api/autopay/preview/route.ts`:
  - Accept same parameters as setup endpoint
  - Generate schedule preview without persisting to database
  - Return schedule array and payoff estimate

### Phase 2: Frontend Implementation
- [ ] Update `app/autopay/setup/page.tsx`:
  - Add "Bi-Weekly" option to cadence selector
  - Add payday anchor selector (day-of-week and specific date)
  - Add "Preview Schedule" button that navigates to preview page
  - Pass form data via URL parameters or React context

- [ ] Implement `app/autopay/preview/page.tsx`:
  - Fetch schedule preview from `/api/autopay/preview`
  - Display schedule table with highlighted adjustments
  - Display payoff estimate card
  - Add "Confirm" button that calls `/api/autopay/setup`

- [ ] Create `components/autopay/SchedulePreviewTable.tsx`:
  - Table columns: Payment #, Scheduled Date, Original Date, Amount, Notes
  - Highlight adjusted dates (yellow)
  - Highlight third paydates (orange, show "No payment scheduled")

- [ ] Create `components/autopay/PayoffEstimateCard.tsx`:
  - Display bi-weekly and monthly payoff dates
  - Display total interest for both
  - Highlight interest saved (green)

### Phase 3: Testing & Documentation
- [ ] Unit tests for utility functions:
  - `lib/utils/date.ts` (holiday detection, business day adjustment)
  - `lib/utils/schedule.ts` (bi-weekly date generation, third paydate detection)
  - `lib/utils/amortization.ts` (payoff calculations)

- [ ] Integration tests for API endpoints:
  - Test `/api/autopay/setup` with bi-weekly cadence
  - Test `/api/autopay/preview` with various parameters
  - Test edge cases (invalid loan ID, invalid dates)

- [ ] End-to-end tests with Playwright:
  - Test setup form with bi-weekly cadence
  - Test schedule preview page
  - Test confirmation and autopay creation

- [ ] Create internal developer documentation:
  - API endpoint documentation (OpenAPI spec above)
  - Utility function documentation
  - UI component usage examples

---

## Expected Artifacts
- `plan.md` (this file)
- OpenAPI specification (embedded above)
- Utility functions (`lib/utils/date.ts`, `schedule.ts`, `amortization.ts`)
- Updated API routes (`app/api/autopay/setup/route.ts`, `app/api/autopay/preview/route.ts`)
- Updated UI pages (`app/autopay/setup/page.tsx`, `app/autopay/preview/page.tsx`)
- New UIcomponents (`SchedulePreviewTable.tsx`, `PayoffEstimateCard.tsx`)
- Unit tests
- Integration tests
- E2E tests (Playwright)
- Test coverage reports

---

## Dependencies
- **Supabase**: Database schema must already support `cadence: 'bi_weekly'`
- **Existing date utilities**: Extend `lib/utils.ts` with holiday detection
- **Existing amortization logic**: Reuse from `app/api/loans/create/route.ts`
- **Shadcn/UI components**: Use existing `Table`, `Card`, `Button` components

---

## Notes
- This implementation uses hardcoded US federal holidays for MVP. Future enhancement could use a holiday API or admin-configurable holiday list.
- The schedule preview page is an intermediary step before confirmation. Users must review and confirm before autopay is activated.
- Bi-weekly payments are generated for the entire loan term at autopay creation time. Future enhancement could generate schedules periodically.
- The payoff estimate compares bi-weekly vs. hypothetical monthly payments calculated on-the-fly (not from database).
