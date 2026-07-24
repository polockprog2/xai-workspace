export const mockData = {
  dashboard: {
    overview: {
      volumeMonitored: "$41.8M/hr",
      anomaliesEscalated: 142,
      mitigationRate: "94.8%",
    },
    activityData: [
      {
        id: 1,
        name: "Multi-hop loop: Node CC-4902 to CC-9082",
        status: "mitigated",
        action: "Escalated + destination hold applied",
        time: "1m ago",
        confidence: 98.4,
      },
      {
        id: 2,
        name: "Card velocity anomaly: Terminal LN-22",
        status: "mitigated",
        action: "Device locked + card temporarily held",
        time: "8m ago",
        confidence: 91.2,
      },
      {
        id: 3,
        name: "Account takeover probe: IP-Geo mismatch check",
        status: "processing",
        action: "Verifying browser fingerprinting",
        time: "32s ago",
        confidence: 86.5,
      },
      {
        id: 4,
        name: "High-frequency cash-out routing attempt",
        status: "escalated",
        action: "Re-routed to manual compliance queue",
        time: "18m ago",
        confidence: 94.7,
      },
      {
        id: 5,
        name: "Structured deposit pattern detection",
        status: "cleared",
        action: "False positive: verified business payroll",
        time: "35m ago",
        confidence: 14.2,
      },
    ],
    sparkline: [18, 22, 19, 32, 28, 42, 38, 55, 48, 64, 52, 71],
    models: [
      { name: "Multi-Hop Path Finder v3.8", accuracy: 98.6, latency: "14ms", status: "active" },
      { name: "Terminal Velocity Monitor v2.4", accuracy: 96.1, latency: "9ms", status: "active" },
      { name: "Geo-Discrepancy Engine v1.2", accuracy: 92.3, latency: "6ms", status: "active" },
    ],
  },
  stages: [
    {
      step: "01",
      label: "Ingest Transactions",
      description: "Millions of transaction logs stream from APIs, payment gateways, and clearing networks into a unified real-time ledger.",
      detail: "Ledger Pipeline: Stripe · Adyen · SWIFT · FedNow",
      color: "#C2410C", // Rust
    },
    {
      step: "02",
      label: "Analyze Multi-Hop Paths",
      description: "Neural pathfinders instantly map high-dimensional transfer paths, scanning for shell accounts and velocity circular loops.",
      detail: "Depth: 6-Hop Circular Analysis (14ms)",
      color: "#C2410C", // Rust
    },
    {
      step: "03",
      label: "Isolate & Mitigate Anomaly",
      description: "High-confidence fraud rings are isolated on the transaction network, auto-applying holds and notifying destination nodes.",
      detail: "Mitigation Latency: 420ms (Autonomous)",
      color: "#C2410C", // Rust
    },
  ]
};
