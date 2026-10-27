/* Calendar anchors — only what the deck implies; no fabricated hard dates. */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_CALENDAR = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-27',
    anchors: [
      { date: '2026-11-30', label: 'End-Nov: H2 conversion check', type: 'gate', note: 'LOI coverage check; if <40 ha, restate target basis' },
      { date: '2027-03-31', label: 'Annual review (D365)', type: 'gate', note: 'Recurring growth, satisfaction, cash, leverage' }
    ],
    recurring: []
  };
});
