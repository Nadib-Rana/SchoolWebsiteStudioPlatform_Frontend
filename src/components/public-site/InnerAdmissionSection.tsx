'use client'

import { Icon } from '@/components/common/Icon'

export function InnerAdmissionSection() {
  return (
    <section className="admission-content">
      <div>
        <span className="section-kicker">APPLICATION PROCESS</span>
        <h2>Four clear steps to apply.</h2>
        {[
          ['01', 'Review eligibility', 'Check age, grade placement, and required documents.'],
          ['02', 'Prepare documents', 'Gather academic records, identification, and photographs.'],
          ['03', 'Apply securely', 'Continue to our approved Admission API portal.'],
          ['04', 'Track your application', 'Use your reference number for status updates.'],
        ].map((x) => (
          <article key={x[0]}>
            <b>{x[0]}</b>
            <div>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </div>
          </article>
        ))}
      </div>
      <aside>
        <span>APPLICATIONS CLOSE</span>
        <strong>30 June 2025</strong>
        <p>Applications for Grades 1–9 are currently open, subject to available places.</p>
        <button
          type="button"
          onClick={() => {
            alert(
              'Admissions portal: Please contact admissions@northfield.edu or visit the campus office Sunday–Thursday (8:00 AM–4:00 PM) to submit application materials.',
            )
          }}
        >
          Continue to application <Icon name="external" size={15} />
        </button>
        <small>Securely opens the existing admissions system</small>
      </aside>
    </section>
  )
}
