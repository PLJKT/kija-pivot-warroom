/* KIJA Pivot War Room — 三情景模型参数
 * 权威来源：KIJA_CEO_改革分析与落地方案.md 附录 A.2
 * 收入上限 = 140 ha × 10,000 sqm/ha × 价格锚 × 转化率 / 1e9（bn IDR）
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_SCENARIOS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-25',
    pipeline_ha: 140,
    sqm_per_ha: 10000,
    price_anchor_idr_per_sqm: 3600000,          // CBRE 2026Q2 Cikarang；Kendal 需单独标定
    price_anchor_source: 'CBRE 2026Q2 Cikarang（Kendal 需单独标定）',
    conversions: {
      bull:  { label: 'Bull',  conv: 0.50, note: '50 ha 转化' },
      base:  { label: 'Base',  conv: 0.30, note: '30 ha 转化' },
      bear:  { label: 'Bear',  conv: 0.15, note: '15 ha 转化' }
    },
    h1_2026_marketing_sales_bn: 1187.6,
    full_year_target_bn: 3750,
    h2_gap_bn: 2562,                             // 3,750 − 1,188
    revenue_ceiling_note: '收入上限 50% 转化 ≈ 2.5 tn ≈ H2 缺口 2,562 bn',
    revaluation: '季度（G 门控月强制重估）'
  };
});
