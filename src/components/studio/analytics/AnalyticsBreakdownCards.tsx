'use client'

interface AnalyticsBreakdownCardsProps {
  popularPages: Array<[string, string, string]>
  trafficSources: Array<[string, string]>
}

export function AnalyticsBreakdownCards({
  popularPages,
  trafficSources,
}: AnalyticsBreakdownCardsProps) {
  return (
    <>
      <div className="card popular-pages">
        <div className="card-title">
          <div>
            <h3>Popular pages</h3>
            <p>Most viewed content</p>
          </div>
        </div>
        {popularPages.map((x, i) => (
          <div key={x[0]}>
            <b>{i + 1}</b>
            <span>
              <strong>{x[0]}</strong>
              <small>{x[1]}</small>
            </span>
            <em>{x[2]} views</em>
          </div>
        ))}
      </div>

      <div className="card traffic-sources">
        <div className="card-title">
          <div>
            <h3>Traffic sources</h3>
            <p>How visitors find you</p>
          </div>
        </div>
        {trafficSources.map((x, i) => (
          <div key={x[0]}>
            <span>
              <i className={`source s${i}`} />
              {x[0]}
            </span>
            <strong>{x[1]}</strong>
          </div>
        ))}
      </div>
    </>
  )
}
