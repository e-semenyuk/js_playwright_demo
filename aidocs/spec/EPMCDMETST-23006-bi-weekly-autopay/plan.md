# Implementation Plan: Bi-Weekly Autopay Support

#�= Overview
This feature extends the existing autopay functionality to support bi-weekly payment cadence, enabling users to align loan payments with their bi-weekly paychecks. The implementation includes:

- **Budget Match Mode**: Split monthly payment into two bi-weekly payments with logic to handle months with 3 pay dates
- **Fast Track Mode**: Use `Monthly Payment × 12 ÷ 26` formula for accelerated payoff
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
- The system will not schedule payments on the third bi-weekly occurrence in a month for Budget Match mode.
- Payoff estimates are calculated using existing amortization logic and compared against hypothetical monthly payments.
- Existing date utilities `formatDate()`, `getNextBusinessDay()`, `isWeekend()` can be extended with holiday detection.
- The schedule preview page (`app/autopay/preview/page.tsx`) exists as a skeleton implementation (noted in README.md).
- User flow: Setup Form → Preview Page → Confirmation ₒ Dashboard.