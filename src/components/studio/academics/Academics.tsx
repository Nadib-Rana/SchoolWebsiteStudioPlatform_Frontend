import { Icon } from '@/components/common/Icon'
import { academicCards } from '@/constants/mock-data'

export function Academics() {
  return (
    <div className="academic-grid">
      {academicCards.map((x, i) => (
        <div className="card academic-card" key={x[0]}>
          <span className={`academic-icon a${i}`}>
            <Icon name={i === 3 ? 'home' : i === 4 ? 'sparkle' : 'file'} />
          </span>
          <div>
            <small>{x[0]}</small>
            <strong>{x[1]}</strong>
            <p>{x[2]}</p>
          </div>
          <button type="button" aria-label={`View ${x[0]}`}>
            <Icon name="arrow" />
          </button>
        </div>
      ))}
    </div>
  )
}
