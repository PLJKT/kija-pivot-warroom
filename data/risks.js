/* KIJA Pivot War Room — 风险触发器 + 财务护栏
 * 权威来源：KIJA_CEO_改革分析与落地方案.md 附录 A.4 风险触发器表
 * 判定语义：
 *   condition.metric 为 null → 未观测（unobservable），不误报；
 *   any: [conds] → 任一条件满足即 fired；
 *   eventDriven → 事件驱动，仅由人工录入（审计留痕）触发。
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_RISKS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-25',
    risks: [
      {
        id: 'R1', name: '美中停火到期 / China+1 叙事受损', severity: 'red',
        condition: { metric: 'china_pipeline_paused_ha', op: '>=', value: 20, window: 'by 2026-12-31' },
        response: '话术已切换（Phase 2）；受影响 pipeline 重定价/重排期；非中投资者 pipeline 提权'
      },
      {
        id: 'R2', name: 'H2 pipeline 转化不及格', severity: 'red',
        condition: { metric: 'loi_ha', op: '<', value: 40, window: '2026-11-30' },
        response: '定价重置（拆地块/先租后买/floor 内授权）+ 启动 bear 预案 + 向董事会下修 3,750 bn 目标'
      },
      {
        id: 'R3', name: '1H26 亏损非纯一次性', severity: 'red',
        condition: { metric: 'h2_parent_net_loss_bn', op: '>', value: 100, window: 'H2 2026' },
        response: '冻结 P2/P3 capex（Morotai/Tanjung Lesung），recurring 项目保优先级'
      },
      {
        id: 'R4', name: 'KIK 分红下滑', severity: 'amber',
        condition: { any: [
          { metric: 'kik_dividend_forecast_bn', op: '<', value: 500, label: 'KIK 分红预测 <500 bn' },
          { metric: 'kendal_new_tenants', op: '<', value: 2000, label: 'Kendal 新租户 <80%（2,500 目标）' }
        ]},
        response: '加速电力/服务自有分部（2025 合计 774 bn）稀释集中度'
      },
      {
        id: 'R5', name: '治理/关联交易质疑（YPUP）', severity: 'amber', eventDriven: true,
        condition: { metric: 'ypup_inquiry_open', op: '>=', value: 1, label: 'YPUP 相关问询/媒体调查进行中' },
        response: '所有 YPUP 系合同独立定价 + 委员会备案（Phase 3 机制随时可指）'
      },
      {
        id: 'R6', name: '服务台整合失败（KPI 被 BU 口径吞并）', severity: 'red',
        condition: { any: [
          { metric: 'cross_sell_improvement', op: '<', value: 0, label: 'Day 120 交叉渗透率无改善（Δ<0）' },
          { metric: 'satisfaction_vs_baseline', op: '<', value: 0, label: '满意度低于基线（Δ<0）' }
        ]},
        response: 'CEO 直线下级汇报线复查；借调人员考核 100% 挂服务台 KPI'
      }
    ],
    guardrails: [
      { id: 'GL_cash', name: '现金护栏', metric: 'cash_bn', op: '<', value: 2000, action: '冻结 P2/P3 capex' },
      { id: 'GL_leverage', name: '净杠杆护栏', metric: 'net_leverage', op: '>', value: 1.0, action: 'JV 担保冻结' },
      { id: 'GL_ebitda_int', name: 'EBITDA/利息护栏', metric: 'ebitda_interest', op: '<', value: 3.0, action: '重议 capex' }
    ]
  };
});
