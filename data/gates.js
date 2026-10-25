/* KIJA Pivot War Room — 门控定义（G1/G2/G3/D365）
 * 权威来源：KIJA_CEO_改革分析与落地方案.md 第二~四部分 Gate 表 + 第九部分里程碑表
 * 判定：全部检查项 pass → go；任一 fail 且未触发 redline → conditional；触发 redline 或关键项 fail → no-go
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_GATES = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-25',
    gates: [
      {
        id: 'G1', name: 'Phase 1 验收：基线 + 租户审计', day: 30,
        checks: [
          { id: 'g1_visits', label: '租户走访完成率', metric: 'tenant_visits_done', op: '>=', value: 80, display: '≥80/100' },
          { id: 'g1_barriers_assigned', label: 'Top 20 障碍清单：每条有责任人+期限', metric: 'barriers_assigned', op: '>=', value: 20, display: '20/20 有主' },
          { id: 'g1_barriers_90d', label: '障碍 90 天内可解决占比', metric: 'barriers_90d_pct', op: '>=', value: 60, display: '≥60%' },
          { id: 'g1_pipeline_sponsor', label: '140 ha 有明确 sponsor 占比', metric: 'pipeline_sponsor_pct', op: '>=', value: 30, display: '≥30%' },
          { id: 'g1_cfo_review', label: '三情景模型 CFO 评审通过', metric: 'scenario_cfo_review', op: '>=', value: 1, display: '已通过' }
        ],
        onNoGo: '不启动 Phase 2 组织调整（服务台编制不批），先补数据——避免组织变革建立在脏数据上'
      },
      {
        id: 'G2', name: 'Phase 2 验收：服务台 + Pipeline 收割', day: 90,
        checks: [
          { id: 'g2_secondment', label: '服务台借调到位率', metric: 'secondment_pct', op: '>=', value: 80, display: '≥80%' },
          { id: 'g2_kpi_bound', label: '借调人员 KPI 100% 挂租户侧指标', metric: 'kpi_bound_pct', op: '>=', value: 100, display: '=100%' },
          { id: 'g2_loi', label: '140 ha LOI 覆盖', metric: 'loi_ha', op: '>=', value: 50, display: '≥50 ha' },
          { id: 'g2_survey_baseline', label: '满意度基线出分（回收率≥60%）', metric: 'survey_baseline_done', op: '>=', value: 1, display: '已出分' },
          { id: 'g2_dc_screening', label: '数据中心地块通过初筛', metric: 'dc_screened', op: '>=', value: 2, display: '≥2 地块' },
          { id: 'g2_forum_terms', label: '论坛项目进入条款谈判', metric: 'forum_term_negotiation', op: '>=', value: 3, display: '≥3 项目' }
        ],
        // 任一满足即视为"收割达标"（LOI 或 H2 营销销售）——g2_loi 与 g2_h2_sales 组内任一 pass 即整组 pass
        anyOf: [[ 'g2_loi', { id: 'g2_h2_sales', label: 'H2 营销销售', metric: 'h2_marketing_sales_bn', op: '>=', value: 1200, display: '≥1,200 bn' } ]],
        redline: { id: 'g2_redline', label: '11 月底 LOI <40 ha', metric: 'loi_ha', op: '<', value: 40, asOf: '2026-11-30',
          action: '定价重置（拆地块/先租后买/floor 内授权）+ 启动 bear 预案 + 向董事会下修 3,750 bn 目标' },
        onNoGo: '回炉 Phase 2：服务台 KPI 重挂 + pipeline 重定价，不释放 Phase 3 融资资源'
      },
      {
        id: 'G3', name: 'Phase 3 验收：资本与融资 + AI', day: 180,
        checks: [
          { id: 'g3_termsheets', label: 'term sheet 签署数（含融资伙伴意向函）', metric: 'term_sheets', op: '>=', value: 3, display: '≥3' },
          { id: 'g3_financing', label: '融资对话机构数', metric: 'financing_dialogues', op: '>=', value: 5, display: '≥5 家' },
          { id: 'g3_jv_termsheet', label: 'JV 进入条款谈判', metric: 'jv_in_termsheet', op: '>=', value: 1, display: '≥1' },
          { id: 'g3_ai_flows', label: 'AI 流程上线数', metric: 'ai_flows_live', op: '>=', value: 3, display: '≥3 条' },
          { id: 'g3_pilots', label: '教育/医疗 pilot 签约数', metric: 'edu_health_pilots', op: '>=', value: 2, display: '≥2' },
          { id: 'g3_cash', label: '护栏：现金', metric: 'cash_bn', op: '>=', value: 2500, display: '≥2,500 bn' },
          { id: 'g3_leverage', label: '护栏：净债务/EBITDA', metric: 'net_leverage', op: '<=', value: 1.0, display: '≤1.0x' },
          { id: 'g3_ebitda_int', label: '护栏：EBITDA/利息', metric: 'ebitda_interest', op: '>=', value: 3.5, display: '≥3.5x' }
        ],
        onNoGo: '暂缓新融资承诺，CFO 30 天补救计划；P2/P3 项目按剩余资源重排'
      },
      {
        id: 'D365', name: '年度验收（D365）', day: 365, date: '2027-03-31',
        checks: [
          { id: 'd365_recurring', label: 'recurring（剔 JV 分红）增速', metric: 'recurring_exjv_growth_pct', op: '>=', value: 10, display: '≥+10%' },
          { id: 'd365_satisfaction', label: '租户满意度', metric: 'tenant_satisfaction', op: '>=', value: 80, display: '≥80%' },
          { id: 'd365_cash', label: '现金', metric: 'cash_bn', op: '>=', value: 2500, display: '≥2,500 bn' },
          { id: 'd365_leverage', label: '净债务/EBITDA', metric: 'net_leverage', op: '<=', value: 1.0, display: '≤1.0x' },
          { id: 'd365_kik', label: 'KIK 分红能见度', metric: 'kik_dividend_visibility_bn', op: '>=', value: 615, display: '≥615 bn' }
        ],
        onNoGo: '向董事会重述目标口径；冻结非必要 capex；启动 FY27 重组计划'
      }
    ]
  };
});
