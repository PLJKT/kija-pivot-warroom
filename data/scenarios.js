/* Scenarios removed — deck states 140 ha is "a pipeline, not a forecast, not a number to multiply". */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_SCENARIOS = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-27',
    pipeline_ha: 140,
    note: '140 ha of demand in discussion for H2 — pipeline, not forecast. Not yet broken down by area.'
  };
});
