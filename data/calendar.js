/* KIJA Pivot War Room — 日历锚点（A.5 日历锚点表）
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_CALENDAR = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-25',
    anchors: [
      { date: '2026-11-04', label: 'Cikarang ASEAN–China 论坛', type: 'event', note: '论坛项目 ≥3 进条款谈判（G2 检查项）' },
      { date: '2026-11-10', label: '停火到期前 60 天', type: 'trigger', note: '激活中国 pipeline 重估预案（R1）' },
      { date: '2026-11-30', label: 'R2 触发器检查日 + G1 门控', type: 'gate', note: 'LOI 覆盖 <40 ha？→ 定价重置 + 下修 3,750 bn' },
      { date: '2027-01-10', label: '美中停火到期（硬时钟）', type: 'hard-clock', note: 'R1 全面重估；bear 预案就位' },
      { date: '2027-03-31', label: 'D365 年度验收', type: 'gate', note: 'recurring +10% / 满意度 80% / 现金 2,500 / 杠杆 1.0x / KIK 615 bn' },
      { date: '2028-12-31', label: '行政流程自动化 50% 目标年', type: 'horizon', note: 'Phase 3 AI 成果验收' }
    ],
    recurring: [
      { cadence: 'quarterly', label: '三情景模型重估（G 门控月强制）', source: 'A.2' }
    ]
  };
});
