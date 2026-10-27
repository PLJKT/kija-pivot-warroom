/* Seed data — only what the deck actually describes. */
(function (root, factory) {
  const mod = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = mod;
  root.KIJA_SEED = mod;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';
  return {
    version: '2026-10-27',
    workstreams: [
      { id: 'WS1', name: 'Establish the facts', owner: 'To be confirmed', focus: 'Capex register, cash forecast, tenant survey, sales ranking' },
      { id: 'WS2', name: 'Open the tenant door', owner: 'To be confirmed', focus: 'Tenant desk, service pricing, cooperation agreement, green-city group' },
      { id: 'WS3', name: 'Prepare investment and reporting', owner: 'To be confirmed', focus: 'Infrastructure projects to Board, project finance, AI pilot, monthly reporting' }
    ],
    pipeline: {
      total_ha: 140,
      note: 'About 140 ha of demand in discussion for H2 — a pipeline, not a forecast. Cikarang vs Kendal split not yet known.'
    },
    areas: [
      { id: 'CIKARANG', name: 'Cikarang', status: 'Full package', note: 'Mature estate; convert existing tenants to recurring services' },
      { id: 'KENDAL', name: 'Kendal', status: 'Export industry', note: 'Demand-funded with JV partner; 71% of 1H26 sales' },
      { id: 'MOROTAI', name: 'Morotai', status: 'Conditional', note: 'Only with a committed investor' },
      { id: 'TANJUNG_LESUNG', name: 'Tanjung Lesung', status: 'Conditional', note: 'With operators' }
    ]
  };
});
