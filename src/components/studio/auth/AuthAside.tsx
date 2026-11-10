'use client'

import { Icon } from '@/components/common/Icon'

export function AuthAside() {
  return (
    <div className="auth-aside">
      <div className="brand auth-brand">
        <div className="brand-mark">
          <Icon name="layers" size={20} />
        </div>
        <div>
          <strong>SchoolCanvas</strong>
          <small>Website Studio</small>
        </div>
      </div>
      <div>
        <span>WEBSITES THAT INSPIRE TRUST</span>
        <h1>Build a school website your community is proud of.</h1>
        <p>
          Create, manage, and publish an exceptional digital home for your
          school—without writing code.
        </p>
        <div className="auth-quote">
          <p>
            “Our new website finally reflects the quality and warmth of our
            school.”
          </p>
          <span>Farhana Noor · Principal, Northfield High</span>
        </div>
      </div>
      <small>Trusted by growing school communities</small>
    </div>
  )
}
