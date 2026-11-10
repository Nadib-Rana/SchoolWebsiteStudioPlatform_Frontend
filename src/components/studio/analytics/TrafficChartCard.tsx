'use client'

export function TrafficChartCard() {
  return (
    <div className="card performance-card">
      <div className="card-title">
        <div>
          <h3>Traffic overview</h3>
          <p>Visitors and page views over time</p>
        </div>
        <span className="legend">
          <i />
          Visitors <i />
          Page views
        </span>
      </div>
      <div className="chart large">
        <div className="grid-line l1" />
        <div className="grid-line l2" />
        <div className="grid-line l3" />
        <svg viewBox="0 0 700 170" preserveAspectRatio="none">
          <path
            className="line"
            d="M0 145 C40 138 55 100 95 112 S155 135 190 94 S245 70 280 89 S335 112 370 67 S430 40 465 58 S525 88 560 48 S625 20 700 30"
          />
          <path
            className="line second"
            d="M0 158 C60 140 85 150 125 120 S180 110 220 105 S280 130 330 100 S390 75 440 90 S500 75 550 62 S630 72 700 50"
          />
        </svg>
      </div>
    </div>
  )
}
