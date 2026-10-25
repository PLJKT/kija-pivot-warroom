# KIJA Pivot War Room

KIJA 转型（园区运营 → 140 ha 工业地产 pipeline）的**决策作战室**：把《KIJA CEO 改革分析与落地方案 v0.9》里的门控、KPI 三态、风险触发器、三情景模型、日历锚点变成一套**可执行、可测试、可部署**的零依赖 Web 应用。

- **口径唯一来源**：`KIJA_CEO_改革分析与落地方案.md` 附录 **A.6 不可变常量**（门控 / KPI / 日历参数）与 **A.4 风险触发器**（R1–R6 + 护栏）。
- **零依赖**：无 npm、无构建步骤。浏览器直接开 `index.html`，Node 直接跑测试。
- **单份规则源**：`engine/core.js` 同时被 Node 测试与浏览器仪表盘加载（UMD 双加载），保证"测试绿的规则 = 页面显示的规则"。

## 目录结构

```
kija-pivot-warroom/
├── index.html          # 仪表盘（纯 HTML/CSS/JS，无框架）
├── data/               # 规则与常量数据层（UMD，浏览器挂 window.KIJA_*）
│   ├── constants.js    #   A.6 不可变常量（deepFreeze，禁覆盖，仅可版本化）
│   ├── kpis.js         #   A.6 KPI 三态：基线 / 目标 / 红线
│   ├── gates.js        #   A.3 门控 G1 / G2 / G3 / D365（含红线、anyOf 组、护栏）
│   ├── risks.js        #   A.4 风险触发器 R1–R6 + 三条护栏
│   ├── scenarios.js    #   A.2 三情景模型（140 ha pipeline 收入上限口径）
│   ├── calendar.js     #   A.5 日历锚点 + 审计规则
│   └── seed.js         #   Phase 0 种子：Top 20 障碍骨架、演示快照
├── engine/
│   └── core.js         # 规则引擎（UMD，浏览器挂 window.KPIJA）
└── tests/
    └── rules.test.js   # 零依赖测试（node tests/rules.test.js）
```

## 快速开始

**看仪表盘**（任选其一）：

- 直接双击 `index.html` 用浏览器打开；或
- 任意静态服务器：`python -m http.server 8080` / `npx serve .` → http://localhost:8080

**跑测试**（Node ≥ 18，无需安装任何包）：

```
node tests/rules.test.js
```

当前基线：**28 组断言全部通过**（门控 go/conditional/no-go、KPI 三态含方向与连续期红线、触发器含 window 未到期不误报、护栏、情景算术、日历锚点/硬时钟过期、审计链、Phase 0 演示快照）。

## 引擎 API（`window.KPIJA` / `require('./engine/core.js')`）

| 成员 | 说明 |
|---|---|
| `version` | 引擎版本（当前 `0.9.0`） |
| `data` | 数据层引用：`constants / kpis / gates / risks / scenarios / calendar / seed` |
| `selfCheck()` | A.6 常量自检：返回 `{ ok, version, issues[] }`，页面 header 展示 PASS/FAIL |
| `demoSnapshot()` | Phase 0 演示快照（1H26 已观测指标 + 未观测留白），仪表盘默认数据源 |
| `kpiEvaluate(metrics, asOf)` | 每个 KPI → 三态（green / amber / red / na / tbd）+ 说明 |
| `gateEvaluate(gateId, metrics, asOf)` | 门控判定：`go` / `conditional` / `no-go`，含红线 pending、anyOf 组、护栏 |
| `riskEvaluate(metrics, asOf)` | R1–R6 + 护栏：`ok` / `watch` / `unobservable` / `fired`（未观测不误报，窗口未到期 → watch） |
| `scenarioCompute()` | 三情景（Bull 50% / Base 30% / Bear 15% 转化）收入与距 3,750 bn 缺口 |
| `calendarUpcoming(asOf)` | A.5 日历锚点倒计时（含周期性项、硬时钟过期标记 `past`） |
| `audit` | 审计日志（seq 递增 + prev 链，只增不改） |

## 判定口径摘要

- **门控**：全部检查项 pass → `go`；任一 fail 且未触发红线 → `conditional`；触发红线（窗口内）或关键项 fail → `no-go`。G2 的"140 ha LOI 覆盖"与"H2 营销销售"为 anyOf 组，组内任一 pass 即整组 pass。
- **KPI 三态**：对照基线 / 目标 / 红线三档给绿黄红；`down` 方向指标（杠杆等）自动反转比较；recurring 增速红线要求**连续 2 期**。
- **风险**：`unobservable` 绝不误报为 ok；`watch` 表示窗口未到期或事件未发生；`fired` 附 A.4 响应动作。
- **情景**：140 ha × 10,000 sqm/ha × 3,600,000 IDR/sqm（Cikarang 单价，Kendal 需单独标定）；季度重估，G 门控月强制。

## 部署

纯静态站点，可直接放到任意静态托管（GitHub Pages / S3 / 内网 Nginx）：把整个目录推上去，入口 `index.html`。无构建、无依赖、无服务端。

## 维护约定

- **常量不可覆盖**：`data/constants.js` 已 `deepFreeze`。改口径 = 改 A.6 文档 + 改数据层 + 升 `version` 字段 + 跑测试 + 走审计（`audit` 只增）。
- **改规则先改测试**：任何判定逻辑变更必须同步 `tests/rules.test.js`，28 组断言是回归基线。
- **数据注入**：Phase 1 起把真实观测值替换 `demoSnapshot()` 的输入即可，仪表盘与测试共用同一引擎，无需改 UI 逻辑。
