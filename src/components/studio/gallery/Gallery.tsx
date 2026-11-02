import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { albumItems } from '@/constants/mock-data'

export function Gallery() {
  return (
    <>
      <div className="storage-strip">
        <Icon name="image" />
        <div>
          <strong>Media storage</strong>
          <span>
            <i />
          </span>
        </div>
        <b>4.8 GB of 10 GB used</b>
        <Button>Manage storage</Button>
      </div>

      <div className="album-grid">
        {albumItems.map((x, i) => (
          <div className="card album" key={x[0]}>
            <div style={{ backgroundImage: `url(${x[1]})` }}>
              <span>{i === 0 ? 'Featured' : 'Published'}</span>
            </div>
            <section>
              <h3>{x[0]}</h3>
              <p>
                {x[2]} · Updated {i + 1} days ago
              </p>
              <button type="button" aria-label={`Options for ${x[0]}`}>
                <Icon name="more" />
              </button>
            </section>
          </div>
        ))}
      </div>
    </>
  )
}
