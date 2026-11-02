import { Icon } from '@/components/common/Icon'

export function SEOManager() {
  return (
    <div className="seo-grid">
      <div className="card seo-form">
        <div className="form-title">
          <div>
            <h3>Homepage search settings</h3>
            <p>Control how the homepage appears in search results.</p>
          </div>
        </div>

        <label>
          Meta title
          <input defaultValue="Northfield High School | Learn, Lead & Serve" />
          <small>51 of 60 characters</small>
        </label>

        <label>
          Meta description
          <textarea
            defaultValue="Northfield High School is a vibrant learning community in Dhaka, inspiring students to learn with purpose and lead with character."
          />
          <small>139 of 160 characters</small>
        </label>

        <label>
          Canonical URL
          <input defaultValue="https://www.northfield.edu/" />
        </label>

        <div className="toggle-row">
          <div>
            <strong>Search engine indexing</strong>
            <small>Allow search engines to show this page</small>
          </div>
          <button type="button" className="toggle on">
            <i />
          </button>
        </div>

        <div className="toggle-row">
          <div>
            <strong>Include in sitemap</strong>
            <small>Help search engines discover this page</small>
          </div>
          <button type="button" className="toggle on">
            <i />
          </button>
        </div>
      </div>

      <div>
        <div className="card google-preview">
          <span>GOOGLE PREVIEW</span>
          <div className="search-result">
            <small>https://www.northfield.edu</small>
            <h3>Northfield High School | Learn, Lead & Serve</h3>
            <p>
              Northfield High School is a vibrant learning community in Dhaka,
              inspiring students to learn with purpose and lead with character.
            </p>
          </div>
        </div>

        <div className="card seo-score">
          <div>
            <span className="score">92</span>
            <div>
              <strong>Excellent SEO health</strong>
              <small>Homepage is ready to be discovered</small>
            </div>
          </div>
          {[
            'Title length is optimal',
            'Description is clear and relevant',
            'Social sharing image added',
            'Canonical URL is valid',
          ].map((x) => (
            <p key={x}>
              <span>
                <Icon name="check" size={13} />
              </span>
              {x}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
