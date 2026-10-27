/* KIJA Pivot War Room — KPI 三态表（基线 / 方向 / 护栏）
 * 与 Board Discussion deck (Oct 2026) 对齐：只有方向，不做承诺。
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_KPIS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const kpis = [
    {
      id: 'marketing_sales', name: 'Marketing sales signings', unit: 'bn', direction: 'up',
      baseline: { value: 1187.6, note: '1H2026 actual; FY2026 target Rp3,750 bn' },
      h2_2026_target: 2562, fy2027_target: null,
      redline: { value: 1000, asOf: '2026-11-30', action: 'Restate target basis to the Board' },
      frequency: 'weekly', source: 'CRM'
    },
    {
      id: 'infra_revenue_growth', name: 'Infrastructure (recurring) revenue growth', unit: '%', direction: 'up', growth: true,
      baseline: { value: null, note: 'FY25 base Rp2,567 bn (49.8% of revenue); Phase 1 sets growth baseline' },
      h2_2026_target: null, fy2027_target: { range: [10, 15] },
      redline: { value: 8, streak: 2, action: 'Review the 10–15% direction' },
      frequency: 'monthly', source: 'Segment reports'
    },
    {
      id: 'tenant_satisfaction', name: 'Tenant satisfaction', unit: '%', direction: 'up',
      baseline: { value: null, note: 'First survey in Phase 1 (response rate ≥60%)' },
      h2_2026_target: null, fy2027_target: 80,
      redline: { value: 70, action: 'Rebind service-desk KPIs' },
      frequency: 'quarterly', source: 'Survey'
    },
    {
      id: 'cash', name: 'Cash', unit: 'bn', direction: 'up',
      baseline: { value: 3205.2, note: '30 Jun 2026' },
      h2_2026_target: 2500, fy2027_target: 2500,
      redline: { value: 2000, action: 'Hold new capex' },
      frequency: 'weekly', source: 'Treasury'
    },
    {
      id: 'net_leverage', name: 'Net debt / EBITDA', unit: 'x', direction: 'down',
      baseline: { value: 0.6, note: 'FY2025 audited (987.7 / 1,735.5)' },
      h2_2026_target: 0.8, fy2027_target: 1.0,
      redline: { value: 1.0, action: 'Freeze JV guarantees' },
      frequency: 'monthly', source: 'Treasury'
    },
    {
      id: 'ebitda_interest', name: 'EBITDA / Interest', unit: 'x', direction: 'up',
      baseline: { value: 4.4, note: 'FY2025' },
      h2_2026_target: 4.0, fy2027_target: 3.5,
      redline: { value: 3.0, action: 'Renegotiate capex' },
      frequency: 'quarterly', source: 'Finance'
    }
  ];
  return { version: '2026-10-27', kpis };
});
