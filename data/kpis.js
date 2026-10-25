/* KIJA Pivot War Room — KPI 三态表（基线 / 目标 / 红线）
 * 权威来源：KIJA_CEO_改革分析与落地方案.md 第六部分「KPI 仪表盘」表
 * 单位：bn = 十亿印尼盾；x = 倍数；% = 百分比数值（80 表示 80%）
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_KPIS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const kpis = [
    {
      id: 'marketing_sales', name: '营销销售签约', unit: 'bn', direction: 'up',
      baseline: { value: 1187.6, note: 'H1 26 实际（全年目标 3,750 bn）' },
      h2_2026_target: 2000, fy2027_target: null,
      redline: { value: 1000, asOf: '2026-11-30', action: '下修全年 3,750 bn 目标' },
      frequency: 'weekly', source: 'CRM'
    },
    {
      id: 'pipeline_conversion', name: '140 ha Pipeline 转化（LOI）', unit: 'ha', direction: 'up',
      baseline: { value: 0, note: 'Phase 1 重分级前' },
      h2_2026_target: 50, fy2027_target: null,
      targetNote: 'G2 门控 ≥50 ha LOI；D365 ≥50% closed',
      redline: { value: 40, asOf: '2026-11-30', action: '定价重置（拆地块/先租后买/floor 内授权）+ bear 预案 + 向董事会下修 3,750 bn' },
      frequency: 'weekly', source: 'Pipeline'
    },
    {
      id: 'infra_revenue_growth', name: '基建（recurring）收入增速', unit: '%', direction: 'up', growth: true,
      baseline: { value: null, note: 'FY25 基数 2,567 bn（占比 57%）；Phase 1 测增速基线' },
      h2_2026_target: null, fy2027_target: { range: [10, 15] },
      redline: { value: 8, streak: 2, action: '重审 +10–15% 目标' },
      frequency: 'monthly', source: '分部报表'
    },
    {
      id: 'power_revenue_growth', name: '电力分部收入增速', unit: '%', direction: 'up', growth: true,
      baseline: { value: null, note: 'FY25 基数 316 bn' },
      h2_2026_target: null, fy2027_target: { range: [15, 15] },
      redline: null,
      frequency: 'monthly', source: '分部报表'
    },
    {
      id: 'services_revenue_growth', name: '服务分部收入增速', unit: '%', direction: 'up', growth: true,
      baseline: { value: null, note: 'FY25 基数 458 bn（电力+服务 2025 合计 774 bn）' },
      h2_2026_target: null, fy2027_target: { range: [10, 15] },
      redline: null,
      frequency: 'monthly', source: '分部报表'
    },
    {
      id: 'tenant_satisfaction', name: '租户满意度', unit: '%', direction: 'up',
      baseline: { value: null, note: 'Phase 1 首次调查（目标回收率 ≥60%）' },
      h2_2026_target: 80, fy2027_target: 85,
      redline: { value: 70, action: '服务台 KPI 重设' },
      frequency: 'quarterly', source: '调查'
    },
    {
      id: 'cash', name: '现金', unit: 'bn', direction: 'up',
      baseline: { value: 3205.2, note: '1H26（6/26）' },
      h2_2026_target: 2500, fy2027_target: 2500,
      redline: { value: 2000, action: '冻结 P2/P3 capex' },
      frequency: 'weekly', source: '司库'
    },
    {
      id: 'net_leverage', name: '净债务/EBITDA', unit: 'x', direction: 'down',
      baseline: { value: 0.6, note: 'A.6 杠杆' },
      h2_2026_target: 0.8, fy2027_target: 1.0,
      redline: { value: 1.0, action: 'JV 担保冻结' },
      frequency: 'monthly', source: '司库'
    },
    {
      id: 'ebitda_interest', name: 'EBITDA/利息', unit: 'x', direction: 'up',
      baseline: { value: 4.4, note: 'A.6 杠杆' },
      h2_2026_target: 4.0, fy2027_target: 3.5,
      redline: { value: 3.0, action: '重议 capex' },
      frequency: 'quarterly', source: '财务'
    },
    {
      id: 'automation', name: '行政流程自动化', unit: '%', direction: 'up',
      baseline: { value: null, note: 'Phase 3 测定' },
      h2_2026_target: null, fy2027_target: null,
      targetNote: '2028 达 50%',
      redline: null,
      frequency: 'quarterly', source: 'AI/IT'
    },
    {
      id: 'kik_dividend', name: 'KIK 分红能见度', unit: 'bn', direction: 'up',
      baseline: { value: 615, note: 'FY25（51% ≈ 314）；跟踪能否重覆' },
      h2_2026_target: null, fy2027_target: 615,
      targetNote: '结构去集中化（占母公司净利 ~74%）',
      redline: { value: 500, action: '加速自有 utilities 增长（电力/服务）' },
      frequency: 'quarterly', source: 'JV 报告'
    },
    {
      id: 'recurring_exjv_growth', name: '剔除 JV 分红的 recurring 增速', unit: '%', direction: 'up', growth: true,
      baseline: { value: null, note: 'Phase 1 测定' },
      h2_2026_target: 8, fy2027_target: { range: [10, 15] },
      redline: { value: 8, streak: 2, action: '向董事会重述目标口径' },
      frequency: 'quarterly', source: '财务'
    }
  ];
  return { version: '2026-10-25', kpis };
});
