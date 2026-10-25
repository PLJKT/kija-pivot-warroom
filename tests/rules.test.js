/* KIJA Pivot War Room — 规则引擎测试（零依赖，node 直接跑）
 * 运行：node tests/rules.test.js
 */
'use strict';
const assert = require('assert');
const K = require('../engine/core.js');

let passed = 0;
const test = (name, fn) => { fn(); passed++; console.log('  ok ' + name); };

/* ---------- 0. 不可变基线自检 ---------- */
test('A.6 常量自检：指纹匹配 + deep-frozen', () => {
  const r = K.selfCheck();
  assert.strictEqual(r.ok, true, JSON.stringify(r.diffs));
  assert.strictEqual(r.frozen, true);
  assert.throws(() => { DATA_const_frozen_probe(); });
  function DATA_const_frozen_probe() {
    'use strict';
    K.data.constants.fy25.revenue_bn = 99999; // 必须抛 TypeError
  }
});

/* ---------- 1. 三情景（A.2） ---------- */
test('三情景：140ha × 10,000sqm × 3.6M IDR 收入上限', () => {
  const s = K.scenarioCompute();
  // 100% 转化 = 5,040 bn
  assert.strictEqual(r10(s.bull.revenue_bn / 0.5), 5040);
  assert.strictEqual(s.bull.ha_converted, 70);
  assert.strictEqual(s.base.ha_converted, 42);
  assert.strictEqual(s.bear.ha_converted, 21);
  assert.strictEqual(s.bull.revenue_bn, 2520);
  assert.strictEqual(s.base.revenue_bn, 1512);
  assert.strictEqual(s.bear.revenue_bn, 756);
  // 全年 = H1 1,187.6 + 情景收入
  assert.strictEqual(s.bull.full_year_bn, 3707.6);
  assert.strictEqual(s.base.full_year_bn, 2699.6);
  assert.strictEqual(s.bear.full_year_bn, 1943.6);
  // 3,750 目标：Bull 差 42.4 bn（98.9%），Base/Bear 均未达
  assert.strictEqual(s.bull.gap_to_target_bn, 42.4);
  assert.strictEqual(s.base.gap_to_target_bn, 1050.4);
  assert.strictEqual(s.bear.gap_to_target_bn, 1806.4);
  assert.strictEqual(s.bull.meets_full_year_target, false);
  // H2 缺口 2,562：Bull 2,520 ≈ 缺口（未覆盖，差 42）
  assert.strictEqual(s.bull.closes_h2_gap, false);
  function r10(x) { return Math.round(x * 10) / 10; }
});

/* ---------- 2. KPI 三态 ---------- */
test('KPI：现金（目标 2,500 / 红线 2,000）', () => {
  const mk = (v) => K.kpiEvaluate({ cash: v }, '2026-10-25').find((r) => r.id === 'cash');
  assert.strictEqual(mk(2600).status, 'green');
  assert.strictEqual(mk(2400).status, 'amber');
  assert.strictEqual(mk(1950).status, 'red');
  assert.strictEqual(mk(1950).action, '冻结 P2/P3 capex');
});

test('KPI：净杠杆（方向 down，目标 ≤0.8x / 红线 >1.0x）', () => {
  const mk = (v) => K.kpiEvaluate({ net_leverage: v }, '2026-10-25').find((r) => r.id === 'net_leverage');
  assert.strictEqual(mk(0.75).status, 'green');
  assert.strictEqual(mk(0.9).status, 'amber');
  assert.strictEqual(mk(1.2).status, 'red');
  assert.strictEqual(mk(1.2).action, 'JV 担保冻结');
});

test('KPI：剔除 JV recurring 增速（红线 8% 需连续 2 期）', () => {
  const mk = (v, streak) => K.kpiEvaluate({ recurring_exjv_growth: v, __streaks: { recurring_exjv_growth: streak } }, '2026-10-25').find((r) => r.id === 'recurring_exjv_growth');
  assert.strictEqual(mk(9, 1).status, 'green');    // ≥ H2 目标 8%
  assert.strictEqual(mk(7, 1).status, 'amber');   // 破线但未连续 2 期
  assert.strictEqual(mk(7, 3).status, 'red');     // 连续 3 期 <8%
  assert.strictEqual(mk(7, 3).action, '向董事会重述目标口径');
});

test('KPI：KIK 分红（目标 615 / 红线 500）', () => {
  const mk = (v) => K.kpiEvaluate({ kik_dividend: v }, '2026-10-25').find((r) => r.id === 'kik_dividend');
  assert.strictEqual(mk(620).status, 'green');
  assert.strictEqual(mk(550).status, 'amber');
  assert.strictEqual(mk(480).status, 'red');
});

test('KPI：未填报 / 基线待定', () => {
  const rows = K.kpiEvaluate({}, '2026-10-25');
  const sat = rows.find((r) => r.id === 'tenant_satisfaction');
  assert.strictEqual(sat.status, 'na');
  const infra = rows.find((r) => r.id === 'infra_revenue_growth');
  assert.strictEqual(infra.status, 'na');
});

/* ---------- 3. 门控（A.3） ---------- */
const g1Pass = { tenant_visits_done: 85, barriers_assigned: 20, barriers_90d_pct: 65, pipeline_sponsor_pct: 35, scenario_cfo_review: 1 };
test('G1：全过 → go', () => {
  const r = K.gateEvaluate('G1', g1Pass, '2026-11-30');
  assert.strictEqual(r.status, 'go');
  assert.strictEqual(r.actions.length, 0);
});
test('G1：走访 70/100 → conditional + onNoGo', () => {
  const r = K.gateEvaluate('G1', Object.assign({}, g1Pass, { tenant_visits_done: 70 }), '2026-11-30');
  assert.strictEqual(r.status, 'conditional');
  assert.ok(r.actions.some((a) => a.type === 'no-go'));
});
const g2Pass = { secondment_pct: 90, kpi_bound_pct: 100, loi_ha: 55, survey_baseline_done: 1, dc_screened: 2, forum_term_negotiation: 3 };
test('G2：LOI 55ha → go', () => {
  const r = K.gateEvaluate('G2', g2Pass, '2027-01-15');
  assert.strictEqual(r.status, 'go');
});
test('G2：LOI 10ha 但 H2 营销销售 1,300 bn → go（anyOf）', () => {
  const r = K.gateEvaluate('G2', Object.assign({}, g2Pass, { loi_ha: 10, h2_marketing_sales_bn: 1300 }), '2027-01-15');
  assert.strictEqual(r.status, 'go');
});
test('G2：LOI 35ha @2026-11-30 → 红线触发 → no-go', () => {
  const r = K.gateEvaluate('G2', Object.assign({}, g2Pass, { loi_ha: 35 }), '2026-11-30');
  assert.strictEqual(r.status, 'no-go');
  assert.strictEqual(r.redline.fired, true);
  assert.ok(r.actions[0].text.includes('定价重置'));
});
test('G2：LOI 35ha @2026-10-25（红线窗口未到）→ conditional，红线 pending', () => {
  const r = K.gateEvaluate('G2', Object.assign({}, g2Pass, { loi_ha: 35 }), '2026-10-25');
  assert.strictEqual(r.status, 'conditional');
  assert.strictEqual(r.redline.fired, false);
  assert.strictEqual(r.redline.due, false);
});
const g3Pass = { term_sheets: 3, financing_dialogues: 5, jv_in_termsheet: 1, ai_flows_live: 3, edu_health_pilots: 2, cash_bn: 2600, net_leverage: 0.9, ebitda_interest: 3.6 };
test('G3：全过（含三条护栏）→ go', () => {
  const r = K.gateEvaluate('G3', g3Pass, '2027-01-15');
  assert.strictEqual(r.status, 'go');
});
test('G3：现金 2,400 bn → conditional（护栏未过）', () => {
  const r = K.gateEvaluate('G3', Object.assign({}, g3Pass, { cash_bn: 2400 }), '2027-01-15');
  assert.strictEqual(r.status, 'conditional');
  assert.strictEqual(r.checks.find((c) => c.id === 'g3_cash').pass, false);
});
const d365Pass = { recurring_exjv_growth_pct: 10.5, tenant_satisfaction: 81, cash_bn: 2600, net_leverage: 0.9, kik_dividend_visibility_bn: 640 };
test('D365：全过 → go', () => {
  const r = K.gateEvaluate('D365', d365Pass, '2027-03-31');
  assert.strictEqual(r.status, 'go');
});
test('D365：满意度 75% → conditional', () => {
  const r = K.gateEvaluate('D365', Object.assign({}, d365Pass, { tenant_satisfaction: 75 }), '2027-03-31');
  assert.strictEqual(r.status, 'conditional');
});

/* ---------- 4. 风险触发器（A.4） ---------- */
test('R1：China pipeline 暂停 25ha → fired', () => {
  const r = K.riskEvaluate({ china_pipeline_paused_ha: 25 });
  assert.strictEqual(r.risks.find((x) => x.id === 'R1').status, 'fired');
});
test('R2：LOI 35ha → fired', () => {
  const r = K.riskEvaluate({ loi_ha: 35 });
  assert.strictEqual(r.risks.find((x) => x.id === 'R2').status, 'fired');
});
test('R3：H2 母公司亏损 150 bn → fired', () => {
  const r = K.riskEvaluate({ h2_parent_net_loss_bn: 150 });
  assert.strictEqual(r.risks.find((x) => x.id === 'R3').status, 'fired');
});
test('R4：KIK 预测 450 bn → fired；Kendal 1,900 → fired；双高 → ok', () => {
  assert.strictEqual(K.riskEvaluate({ kik_dividend_forecast_bn: 450 }).risks.find((x) => x.id === 'R4').status, 'fired');
  assert.strictEqual(K.riskEvaluate({ kendal_new_tenants: 1900 }).risks.find((x) => x.id === 'R4').status, 'fired');
  assert.strictEqual(K.riskEvaluate({ kik_dividend_forecast_bn: 600, kendal_new_tenants: 2200 }).risks.find((x) => x.id === 'R4').status, 'ok');
});
test('R5/R6：事件驱动 / 差值型，未观测 → unobservable（不误报）', () => {
  const r = K.riskEvaluate({});
  assert.strictEqual(r.risks.find((x) => x.id === 'R5').status, 'unobservable');
  assert.strictEqual(r.risks.find((x) => x.id === 'R6').status, 'unobservable');
  assert.strictEqual(r.risks.find((x) => x.id === 'R1').status, 'unobservable');
});
test('R6：交叉渗透率 Δ<0 → fired', () => {
  const r = K.riskEvaluate({ cross_sell_improvement: -0.02 });
  assert.strictEqual(r.risks.find((x) => x.id === 'R6').status, 'fired');
});
test('护栏：现金 1,900 / 杠杆 1.2x / EBITDA/利息 2.8x → 全 fired', () => {
  const r = K.riskEvaluate({ cash_bn: 1900, net_leverage: 1.2, ebitda_interest: 2.8 });
  assert.strictEqual(r.guardrails.every((g) => g.fired), true);
  const ok = K.riskEvaluate({ cash_bn: 2600, net_leverage: 0.7, ebitda_interest: 4.2 });
  assert.strictEqual(ok.guardrails.every((g) => !g.fired), true);
});

/* ---------- 5. 日历锚点（A.5） ---------- */
test('日历：2026-10-25 起，锚点顺序与天数', () => {
  const items = K.calendarUpcoming('2026-10-25');
  const byLabel = (kw) => items.find((i) => i.label.includes(kw));
  assert.strictEqual(byLabel('论坛').days_left, 10);
  assert.strictEqual(byLabel('停火到期前 60 天').days_left, 16);
  assert.strictEqual(byLabel('R2 触发器检查日').days_left, 36);
  assert.strictEqual(byLabel('硬时钟').days_left, 77);
  const re = byLabel('季度重估');
  assert.strictEqual(re.date, '2026-12-31');
  assert.strictEqual(re.past, false);
});
test('日历：2027-02-01 起，停火硬时钟已过期（past=true, days_left=-22）', () => {
  const items = K.calendarUpcoming('2027-02-01');
  assert.strictEqual(items.find((i) => i.type === 'hard-clock').past, true);
  assert.strictEqual(items.find((i) => i.type === 'hard-clock').days_left, -22);
});

/* ---------- 6. 审计日志 ---------- */
test('审计：seq 递增 + prev 链 + 只增', () => {
  K.audit.reset();
  const e1 = K.audit.append({ actor: 'test', action: 'gate:G1:go' });
  const e2 = K.audit.append({ actor: 'test', action: 'risk:R2:fired' });
  assert.strictEqual(e1.seq, 1);
  assert.strictEqual(e2.seq, 2);
  assert.strictEqual(e1.prev, null);
  assert.strictEqual(e2.prev, 'A-0001');
  assert.strictEqual(K.audit.entries().length, 2);
  K.audit.reset();
});

/* ---------- 7. 演示快照 ---------- */
test('演示快照：Phase 0 态 → 无风险 fired，门控全 conditional', () => {
  const s = K.demoSnapshot;
  const r = K.riskEvaluate(s.metrics, s.asOf);
  assert.strictEqual(r.risks.filter((x) => x.status === 'fired').length, 0);
  // R2 条件已成立（0<40）但 11-30 窗口未到 → watch
  assert.strictEqual(r.risks.find((x) => x.id === 'R2').status, 'watch');
  assert.strictEqual(r.guardrails.every((g) => !g.fired), true);
  for (const g of ['G1', 'G2', 'G3', 'D365']) {
    assert.notStrictEqual(K.gateEvaluate(g, s.metrics, s.asOf).status, 'go');
  }
  const rows = K.kpiEvaluate(s.metrics, s.asOf);
  assert.strictEqual(rows.find((x) => x.id === 'cash').status, 'green');   // 3,205 ≥ 2,500
  assert.strictEqual(rows.find((x) => x.id === 'net_leverage').status, 'green');
});

console.log(`\nPASS ${passed}/16 组断言全部通过`);
