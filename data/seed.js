/* KIJA Pivot War Room — Phase 0 种子数据（结构先行，Phase 1 填数）
 * 权威来源：KIJA_CEO_改革分析与落地方案.md 附录 A.1 实体模型 + 第五/七/八部分
 * 说明：owner/due 等字段 Phase 1 租户审计后回填；此处只给结构与类目。
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_SEED = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  const barrier = (no, category, name) => ({ no, category, name, owner: null, due: null, status: 'open', resolvable_90d: null });
  return {
    version: '2026-10-25',
    // 2.1 Top 20 成本障碍（租户访谈 + 内部复盘提炼；责任人/期限 Phase 1 回填）
    cost_barriers: [
      barrier(1, '能源电力', '电力电价/容量'),
      barrier(2, '水务', '水费'),
      barrier(3, '能源电力', '燃气供应'),
      barrier(4, '道路物流', '道路连接'),
      barrier(5, '水务', '排水'),
      barrier(6, '消防', '消防系统'),
      barrier(7, '安保', '安保'),
      barrier(8, '环保合规', '废物处理'),
      barrier(9, '道路物流', '旱港物流连接'),
      barrier(10, '水务', '污水'),
      barrier(11, '网络', '网络基础设施'),
      barrier(12, '道路物流', '停车'),
      barrier(13, '通关', '海关便利化'),
      barrier(14, '人才培训', '人力资源/培训'),
      barrier(15, '税务', '税务事务'),
      barrier(16, '法务', '法务合规'),
      barrier(17, '通关', '许可/审批便利化'),
      barrier(18, '保险', '保险'),
      barrier(19, '法务', '法律纠纷'),
      barrier(20, '环保合规', '环保合规')
    ],
    // 140 ha pipeline 骨架（Phase 1 按 LOI/MOU/口头/未接触 重分级）
    pipeline: {
      total_ha: 140,
      by_stage: { loi: 0, mou: 0, verbal: 0, uncontacted: 140 },
      china_bg_ha: null,           // Phase 1 标注
      with_sponsor_ha: 0,
      parcels: [
        { id: 'DC-1', tag: '数据中心', status: '初筛中', note: '数据中心 2 地块（G2：≥2 通过初筛）' },
        { id: 'DC-2', tag: '数据中心', status: '初筛中', note: 'G2 检查项' }
      ]
    },
    // JV 组合
    jvs: [
      { id: 'KENDAL', name: 'Kendal（KIK 51% JV）', stake: 0.51, dividend_bn: 615, guarantee_bn: null, status: '运营', note: '占母公司净利 ~74%；D365 分红能见度 ≥615 bn' },
      { id: 'MOROTAI', name: 'Morotai（P3）', stake: null, dividend_bn: null, guarantee_bn: null, status: 'P3 项目', note: 'R3 触发时冻结 capex' },
      { id: 'TANJUNG_LESUNG', name: 'Tanjung Lesung（P3）', stake: null, dividend_bn: null, guarantee_bn: null, status: 'P3 项目', note: 'R3 触发时冻结 capex' }
    ],
    // 项目跟踪（Phase 3）
    projects: [
      { id: 'FORUM', name: 'Cikarang 论坛项目', target: '≥3 进条款谈判（G2）', metric: 'forum_term_negotiation', value: 0 },
      { id: 'AI-FLOWS', name: 'AI 三条流程', target: '≥3 上线（G3）', metric: 'ai_flows_live', value: 0 },
      { id: 'EDU-HEALTH', name: '教育/医疗 pilot', target: '≥2 签约（G3）', metric: 'edu_health_pilots', value: 0 },
      { id: 'CIKARANG_BARU', name: 'Cikarang Baru 政府备忘录', target: '2027 H1 落地', metric: null, value: null }
    ],
    // 四个 Squad（Week 1 任命 Lead）
    squads: [
      { id: 'A', name: '租户增长', lead: 'VP Tenant Growth', focus: '走访 100 家 / 障碍清单 / pipeline 重分级' },
      { id: 'B', name: '基建增长', lead: 'Infra BU', focus: 'recurring 收入 + 数据中心初筛' },
      { id: 'C', name: '资本与融资', lead: 'CFO', focus: '三情景模型 / 融资对话 / JV 条款' },
      { id: 'D', name: '生态与创新', lead: 'CEO 特使', focus: 'AI 流程 / 教育医疗 pilot / 论坛' }
    ]
  };
});
