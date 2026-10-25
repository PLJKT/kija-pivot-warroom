/* KIJA Pivot War Room — A.6 不可变常量
 * 唯一权威来源：KIJA_CEO_改革分析与落地方案.md 附录 A.6
 * 规则：系统基线，禁止覆盖，只能版本化（改 version + 走审计）。
 * UMD：Node (module.exports) 与浏览器 (window.KIJA_CONSTANTS) 双加载。
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_CONSTANTS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const deepFreeze = (o) => {
    Object.freeze(o);
    Object.values(o).forEach((v) => (v && typeof v === 'object' && !Object.isFrozen(v)) && deepFreeze(v));
    return o;
  };
  const c = {
    version: '2026-10-25',
    source: 'KIJA_CEO_改革分析与落地方案.md 附录 A.6',
    fy25: {
      revenue_bn: 5149.4,            // FY25 收入
      parent_net_profit_bn: 423.2,    // 母公司净利
      cash_bn: 3618.8,                // 现金
      infrastructure_bn: 2567,        // 基建收入
      infrastructure_share: 0.57,     // 占比 57%（1H26 口径）
      power_bn: 316,                  // 电力
      services_bn: 458,               // 服务
      tourism_bn: -30,                // 旅游
      kik_dividend_bn: 615,           // KIK 分红
      kik_stake: 0.51,                // KIJA 持股 51%
      kik_share_bn: 314,              // 51% ≈ 314
      marketing_sales_bn: 3601        // 营销销售
    },
    h1_2026: {
      revenue_bn: 2436.5,
      consolidated_net_profit_bn: -6.4,
      parent_net_profit_bn: -177.9,
      infrastructure_bn: 1398.2,
      marketing_sales_bn: 1187.6,          // H1 26 营销销售
      marketing_sales_target_bn: 3750,     // 全年目标
      marketing_sales_attainment: 0.314,   // 31.4% 达标
      ebitda_bn: 747.7,
      cash_bn: 3205.2,
      gross_margin: 0.345
    },
    leverage: {
      net_debt_to_ebitda: 0.6,
      ebitda_to_interest: 4.4,
      total_debt_bn: 4863,
      net_debt_bn: 1657.9,
      funding_cost: 0.0716
    },
    valuation: {
      price_idr: 180,
      market_cap_tn: 3.71,
      fy25_parent_pe: 8.8,
      land_book_value_per_share: 280.9,    // 100% 口径
      land_upside: 0.56
    },
    external: {
      tariff301: { cn: 0.125, id: 0.10, vn: 0.125 },
      ceasefire_deadline: '2027-01-10',   // 美中停火硬时钟
      big_survey: 'BIG 调查五指标（75.86% 监管不确定性 / 77.19% 靠内部现金）'
    }
  };
  return deepFreeze(c);
});
