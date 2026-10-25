/* KIJA Pivot War Room — 规则引擎 core.js
 * 权威来源：KIJA_CEO_改革分析与落地方案.md（v0.9，2026-10-25）
 *   附录 A.1 实体模型 / A.2 三情景参数 / A.3 门控 / A.4 风险触发器 / A.5 日历锚点 / A.6 不可变常量
 * 零依赖：Node 与浏览器双环境（UMD）。
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KPIJA = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const isNode = typeof module !== 'undefined' && module.exports;
  /* 浏览器分支：数据文件挂 window.KIJA_*；Node 分支：require 相对路径 */
  const DATA_KEYS = {
    constants: 'KIJA_CONSTANTS', kpis: 'KIJA_KPIS', gates: 'KIJA_GATES',
    risks: 'KIJA_RISKS', scenarios: 'KIJA_SCENARIOS', calendar: 'KIJA_CALENDAR', seed: 'KIJA_SEED'
  };
  const DATA = {};
  Object.keys(DATA_KEYS).forEach((k) => {
    DATA[k] = isNode ? require('../data/' + k + '.js') : globalThis[DATA_KEYS[k]];
  });

  const OPS = {
    '>=': (a, b) => a >= b, '>': (a, b) => a > b,
    '<=': (a, b) => a <= b, '<': (a, b) => a < b,
    '==': (a, b) => a === b, '!=': (a, b) => a !== b
  };
  const OP_LABEL = { '>=': '≥', '>': '>', '<=': '≤', '<': '<', '==': '=', '!=': '≠' };
  const num = (v) => (typeof v === 'number' && isFinite(v) ? v : null);
  const r1 = (x) => Math.round(x * 10) / 10;
  const parseDate = (s) => new Date(s + (s.length === 10 ? 'T00:00:00Z' : ''));
  const daysBetween = (a, b) => Math.round((parseDate(b) - parseDate(a)) / 86400000);

  /* ---------- A.6 不可变基线自检 ---------- */
  // 指纹：[点路径, 期望值]，来自方案文档附录 A.6
  const FINGERPRINT = [
    ['fy25.revenue_bn', 5149.4], ['fy25.parent_net_profit_bn', 423.2],
    ['fy25.cash_bn', 3618.8], ['fy25.infrastructure_bn', 2567],
    ['fy25.infrastructure_share', 0.57], ['fy25.power_bn', 316], ['fy25.services_bn', 458],
    ['fy25.tourism_bn', -30], ['fy25.kik_dividend_bn', 615], ['fy25.kik_stake', 0.51],
    ['fy25.kik_share_bn', 314], ['fy25.marketing_sales_bn', 3601],
    ['h1_2026.revenue_bn', 2436.5], ['h1_2026.consolidated_net_profit_bn', -6.4],
    ['h1_2026.parent_net_profit_bn', -177.9], ['h1_2026.infrastructure_bn', 1398.2],
    ['h1_2026.marketing_sales_bn', 1187.6], ['h1_2026.marketing_sales_target_bn', 3750],
    ['h1_2026.marketing_sales_attainment', 0.314], ['h1_2026.ebitda_bn', 747.7],
    ['h1_2026.cash_bn', 3205.2], ['h1_2026.gross_margin', 0.345],
    ['leverage.net_debt_to_ebitda', 0.6], ['leverage.ebitda_to_interest', 4.4],
    ['leverage.total_debt_bn', 4863], ['leverage.net_debt_bn', 1657.9],
    ['leverage.funding_cost', 0.0716],
    ['valuation.price_idr', 180], ['valuation.market_cap_tn', 3.71],
    ['valuation.fy25_parent_pe', 8.8], ['valuation.land_book_value_per_share', 280.9],
    ['valuation.land_upside', 0.56],
    ['external.ceasefire_deadline', '2027-01-10'],
    ['external.tariff301.cn', 0.125], ['external.tariff301.id', 0.10], ['external.tariff301.vn', 0.125]
  ];
  const dig = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

  function selfCheck() {
    const diffs = [];
    for (const [path, expected] of FINGERPRINT) {
      const actual = dig(DATA.constants, path);
      if (actual !== expected) diffs.push({ path, expected, actual });
    }
    const frozen = Object.isFrozen(DATA.constants);
    return {
      ok: diffs.length === 0 && frozen,
      frozen,
      diffs,
      baselineVersion: DATA.constants.version,
      note: 'A.6 不可变常量自检（引擎启动 + 每次渲染前调用）'
    };
  }

  /* ---------- A.2 三情景 ---------- */
  function scenarioCompute(overrides) {
    const S = Object.assign({}, DATA.scenarios, overrides || {});
    const out = {};
    for (const key of ['bull', 'base', 'bear']) {
      const s = S.conversions[key];
      const revenue_bn = r1((S.pipeline_ha * S.sqm_per_ha * S.price_anchor_idr_per_sqm * s.conv) / 1e9);
      const full_year_bn = r1(S.h1_2026_marketing_sales_bn + revenue_bn);
      const gap_to_target_bn = r1(S.full_year_target_bn - full_year_bn);
      out[key] = {
        key, label: s.label, note: s.note,
        conv: s.conv,
        ha_converted: r1(S.pipeline_ha * s.conv),
        revenue_bn,
        full_year_bn,
        gap_to_target_bn,
        meets_full_year_target: gap_to_target_bn <= 0,
        closes_h2_gap: revenue_bn >= S.h2_gap_bn
      };
    }
    out._params = {
      pipeline_ha: S.pipeline_ha, price_anchor_idr_per_sqm: S.price_anchor_idr_per_sqm,
      price_anchor_source: S.price_anchor_source, h2_gap_bn: S.h2_gap_bn,
      full_year_target_bn: S.full_year_target_bn, revaluation: S.revaluation
    };
    return out;
  }

  /* ---------- KPI 三态（基线 / 目标 / 红线） ---------- */
  function kpiEvaluate(metrics, asOf) {
    const m = metrics || {};
    const streaks = m.__streaks || {};
    const horizon = (asOf || '2026-10-25') < '2027-01-01' ? 'h2_2026_target' : 'fy2027_target';
    const rows = [];
    for (const kpi of DATA.kpis.kpis) {
      const value = num(m[kpi.id]);
      const target = kpi[horizon];
      const refTarget = target == null ? kpi[horizon === 'h2_2026_target' ? 'fy2027_target' : 'h2_2026_target'] : target;
      const targetOf = (t) => (t && typeof t === 'object' ? t.range[0] : t);
      const row = {
        id: kpi.id, name: kpi.name, unit: kpi.unit, growth: !!kpi.growth,
        baseline: kpi.baseline, target, redline: kpi.redline,
        frequency: kpi.frequency, source: kpi.source, value,
        status: 'na', detail: '未填报', action: null
      };
      if (value == null) {
        row.status = kpi.baseline.value == null && target == null && kpi.redline == null ? 'tbd' : 'na';
        row.detail = kpi.baseline.value == null ? '基线待 Phase 1 测定' : '未填报';
        rows.push(row);
        continue;
      }
      const tgtRaw = target != null ? target : refTarget;
      const tgt = targetOf(tgtRaw);
      const red = kpi.redline ? kpi.redline.value : null;
      const streak = (kpi.redline && kpi.redline.streak) ? (streaks[kpi.id] || 1) : 1;
      if (kpi.direction === 'down') {
        // 越低越好（净杠杆）
        if (red != null && value > red) { row.status = 'red'; row.detail = `越过红线 ${OP_LABEL['>']} ${red}${kpi.unit}`; row.action = kpi.redline.action; }
        else if (tgt != null && value <= tgt) { row.status = 'green'; row.detail = `达标（≤${tgt}${kpi.unit}）`; }
        else { row.status = 'amber'; row.detail = `目标 ≤${tgt}${kpi.unit}，未达标但未破线`; }
      } else {
        // 越高越好
        if (red != null && value < red) {
          if (kpi.redline.streak && streak < kpi.redline.streak) {
            row.status = 'amber';
            row.detail = `低于红线 ${red}${kpi.unit}，但未连续 ${kpi.redline.streak} 期（当前连续 ${streak} 期）`;
            row.action = kpi.redline.action + '（连续 ' + kpi.redline.streak + ' 期触发）';
          } else {
            row.status = 'red';
            row.detail = `越过红线 < ${red}${kpi.unit}` + (kpi.redline.streak ? `（连续 ${streak} 期）` : '');
            row.action = kpi.redline.action;
          }
        } else if (tgt != null && value >= (tgtRaw && typeof tgtRaw === 'object' ? tgtRaw.range[0] : tgt)) {
          row.status = 'green';
          row.detail = tgtRaw && typeof tgtRaw === 'object'
            ? `达标（${value}${kpi.unit} ∈ [${tgtRaw.range[0]}, ${tgtRaw.range[1]}]）`
            : `达标（≥${tgt}${kpi.unit}）`;
        } else {
          row.status = 'amber';
          row.detail = tgt != null ? `目标 ${tgt}${kpi.unit}，当前 ${value}${kpi.unit}` : '未达参考目标';
        }
      }
      rows.push(row);
    }
    return rows;
  }

  /* ---------- A.3 门控 ---------- */
  function gateEvaluate(gateId, metrics, asOf) {
    const gate = DATA.gates.gates.find((g) => g.id === gateId);
    if (!gate) throw new Error('unknown gate: ' + gateId);
    const m = metrics || {};
    const evalCheck = (c) => {
      const actual = num(m[c.metric]);
      const pass = actual != null && OPS[c.op](actual, c.value);
      return { id: c.id, label: c.label, metric: c.metric, expected: `${OP_LABEL[c.op]} ${c.value}`, display: c.display, actual, pass, observed: actual != null };
    };
    const results = gate.checks.map(evalCheck);
    // anyOf 组：组内任一 pass 即整组视为满足（不单独 fail 组内成员）
    const anyGroups = gate.anyOf || [];
    for (const group of anyGroups) {
      const [headId, ...rest] = group;
      const head = results.find((r) => r.id === headId);
      const groupPass = group.slice(1).reduce((acc, c) => acc || (num(m[c.metric]) != null && OPS[c.op](num(m[c.metric]), c.value)), !!head && head.pass);
      head.groupLabel = `（任一满足：${[headId, ...group.slice(1).map((c) => c.label)].join(' / ')}）`;
      head.groupPass = groupPass;
    }
    const redline = gate.redline;
    const rlActual = redline ? num(m[redline.metric]) : null;
    const rlDue = redline && (!redline.asOf || (asOf || '0000') >= redline.asOf);
    // 红线与 anyOf 组联动：若红线指标所在 anyOf 组已由其他分支满足（如 H2 营销销售 ≥1,000 bn），
    // 说明转化缺口已被覆盖，不触发红线（R2 风险层仍独立监测）。
    const rlCheckId = redline ? (results.find((r) => r.metric === redline.metric) || {}).id : null;
    const rlGroup = rlCheckId ? anyGroups.find((g) => g.includes(rlCheckId)) : null;
    const rlGroupPass = rlGroup ? !!results.find((r) => r.id === rlGroup[0]).groupPass : false;
    const redlineFired = !!(redline && rlActual != null && rlDue && OPS[redline.op](rlActual, redline.value) && !rlGroupPass);
    const failed = results.filter((r) => !(r.pass || r.groupPass));
    const status = redlineFired ? 'no-go' : failed.length === 0 ? 'go' : 'conditional';
    const actions = [];
    if (redlineFired) actions.push({ type: 'redline', text: redline.action });
    if (status !== 'go') actions.push({ type: 'no-go', text: gate.onNoGo });
    return {
      gate: { id: gate.id, name: gate.name, day: gate.day, date: gate.date || null },
      status, checks: results,
      redline: redline ? { ...redline, actual: rlActual, fired: redlineFired, due: rlDue } : null,
      actions, asOf
    };
  }

  /* ---------- A.4 风险触发器 + 护栏 ---------- */
  function riskEvaluate(metrics, asOf) {
    const m = metrics || {};
    const evalCond = (c) => {
      const actual = num(m[c.metric]);
      const fired = actual != null && OPS[c.op](actual, c.value);
      return { metric: c.metric, label: c.label, actual, fired, observed: actual != null };
    };
    const risks = DATA.risks.risks.map((r) => {
      const conds = r.condition.any ? r.condition.any.map(evalCond) : [evalCond(r.condition)];
      const anyFired = conds.some((c) => c.fired);
      const anyObserved = conds.some((c) => c.observed);
      // window 语义：条件已成立但 asOf 未到窗口期限 → watch（预警，不触发响应）；
      // 未传 asOf 时视为已到期，直接 fired（单元语义）。
      const win = r.condition.window;
      const winISO = win ? (String(win).match(/\d{4}-\d{2}-\d{2}/) || [null])[0] : null;
      const due = !winISO || !asOf || asOf >= winISO;
      return {
        id: r.id, name: r.name, severity: r.severity,
        window: win || null, eventDriven: !!r.eventDriven,
        conditions: conds,
        status: anyFired ? (due ? 'fired' : 'watch') : anyObserved ? 'ok' : 'unobservable',
        response: r.response
      };
    });
    const guardrails = DATA.risks.guardrails.map((g) => {
      const actual = num(m[g.metric]);
      const fired = actual != null && OPS[g.op](actual, g.value);
      return { id: g.id, name: g.name, metric: g.metric, expected: `${OP_LABEL[g.op]} ${g.value}`, actual, fired, observed: actual != null, action: g.action };
    });
    return { asOf, risks, guardrails };
  }

  /* ---------- A.5 日历锚点 ---------- */
  function calendarUpcoming(asOf) {
    const a = asOf || '2026-10-25';
    const items = DATA.calendar.anchors.map((x) => ({
      ...x, days_left: daysBetween(a, x.date), past: daysBetween(a, x.date) < 0
    })).sort((x, y) => (x.date < y.date ? -1 : 1));
    // 下一季度重估（3/6/9/12 月底）
    const d = parseDate(a);
    const y = d.getUTCFullYear();
    const quarters = [[y, 2, 31], [y, 5, 30], [y, 8, 30], [y, 11, 31], [y + 1, 2, 31]];
    for (const [yy, mm, dd] of quarters) {
      const ds = `${yy}-${String(mm + 1).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
      if (ds >= a) {
        items.push({ date: ds, label: '三情景模型季度重估（A.2）', type: 'recurring', note: 'G 门控月强制', days_left: daysBetween(a, ds), past: false, recurring: true });
        break;
      }
    }
    return items;
  }

  /* ---------- 审计日志（只增不改） ---------- */
  const AUDIT_KEY = 'kija_audit_v1';
  let memStore = [];
  const audit = {
    entries() {
      if (isNode) return memStore.slice();
      try { return JSON.parse(window.localStorage.getItem(AUDIT_KEY) || '[]'); } catch (e) { return []; }
    },
    append(entry) {
      const list = isNode ? memStore : audit.entries();
      const seq = list.length + 1;
      const rec = {
        id: 'A-' + String(seq).padStart(4, '0'),
        seq,
        ts: entry.ts || new Date().toISOString(),
        prev: list.length ? list[list.length - 1].id : null,
        actor: entry.actor || 'system',
        action: entry.action,
        payload: entry.payload || null
      };
      list.push(rec);
      if (!isNode) { try { window.localStorage.setItem(AUDIT_KEY, JSON.stringify(list)); } catch (e) { /* 隐私模式降级为内存 */ } }
      return rec;
    },
    reset() { if (isNode) memStore = []; else try { window.localStorage.removeItem(AUDIT_KEY); } catch (e) { } }
  };

  /* ---------- 种子快照（Phase 0 演示态） ---------- */
  const demoSnapshot = {
    asOf: '2026-10-25',
    metrics: {
      // A.6 基线财务（1H26）
      cash_bn: 3205.2, net_leverage: 0.6, ebitda_interest: 4.4,
      cash: 3205.2,
      marketing_sales: 1187.6,
      // Phase 0：审计/服务台/融资均未启动
      tenant_visits_done: 0, barriers_assigned: 0, barriers_90d_pct: null,
      pipeline_sponsor_pct: 0, scenario_cfo_review: 0,
      secondment_pct: 0, kpi_bound_pct: 0, loi_ha: 0, h2_marketing_sales_bn: 0,
      survey_baseline_done: 0, dc_screened: 0, forum_term_negotiation: 0,
      term_sheets: 0, financing_dialogues: 0, jv_in_termsheet: 0,
      ai_flows_live: 0, edu_health_pilots: 0,
      kik_dividend_visibility_bn: null, recurring_exjv_growth_pct: null,
      // 风险观测值
      china_pipeline_paused_ha: 0, kendal_new_tenants: null, kik_dividend_forecast_bn: null
    }
  };

  return {
    version: '0.9.0',
    data: DATA,
    selfCheck,
    scenarioCompute,
    kpiEvaluate,
    gateEvaluate,
    riskEvaluate,
    calendarUpcoming,
    audit,
    demoSnapshot,
    util: { OPS: OP_LABEL, num, r1, daysBetween }
  };
});
