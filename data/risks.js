/* KIJA Pivot War Room — Risk watch (calm, in-line with deck)
 * Only risks actually discussed in the Board Discussion deck.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_RISKS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-27',
    risks: [
      {
        id: 'R1', name: 'US–China truce evolves / China+1 narrative weakens', severity: 'amber',
        condition: { metric: 'china_pipeline_paused_ha', op: '>=', value: 20, window: 'by 2026-12-31' },
        response: 'Reframe the offer around market access, utilities and workforce rather than the tariff gap.'
      },
      {
        id: 'R2', name: 'H2 2026 conversion below plan (Rp2,562 bn still to sign)', severity: 'red',
        condition: { metric: 'loi_ha', op: '<', value: 40, window: '2026-11-30' },
        response: 'Rank every live deal by probability and blocker; clear titles and handovers first; hold new capex.'
      },
      {
        id: 'R3', name: 'Kendal weight in sales (71% of 1H26)', severity: 'amber',
        condition: { metric: 'kendal_share_pct', op: '>', value: 75, window: 'quarterly review' },
        response: 'Close quarterly review; Cikarang pipeline provides a natural offset.'
      },
      {
        id: 'R4', name: 'Lender concentration (95% with one bank)', severity: 'amber',
        condition: { metric: 'single_bank_concentration_pct', op: '>', value: 90, window: 'monitor' },
        response: 'Diversify funding sources as a prudent working item, not an emergency; explore project finance for utility assets.'
      },
      {
        id: 'R5', name: 'Gross margin mix compression (39% FY25 vs 43% FY24)', severity: 'amber',
        condition: { metric: 'gross_margin_pct', op: '<', value: 37, window: 'half-year' },
        response: 'Grow services first (mid-40s margin); keep land sales at Cikarang-grade prices.'
      }
    ],
    guardrails: [
      { id: 'GL_cash', name: 'Cash floor', metric: 'cash_bn', op: '<', value: 2000, action: 'Hold new capex' },
      { id: 'GL_leverage', name: 'Net leverage ceiling', metric: 'net_leverage', op: '>', value: 1.0, action: 'Freeze JV guarantees' },
      { id: 'GL_ebitda_int', name: 'EBITDA/interest floor', metric: 'ebitda_interest', op: '<', value: 3.0, action: 'Renegotiate capex' }
    ]
  };
});
