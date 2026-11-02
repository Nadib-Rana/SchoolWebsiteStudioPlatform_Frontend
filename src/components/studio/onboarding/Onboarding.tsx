'use client'

import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { heroImage, templates } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { useState } from 'react'

export function Onboarding() {
  const { setView, notify } = useStudio()
  const [step, setStep] = useState(1)

  const steps = [
    'School information',
    'Website identity',
    'Choose template',
    'Initial content',
    'Preview & publish',
  ]

  return (
    <div className="onboarding-page">
      <div className="onboarding-head">
        <div className="brand-mark">
          <Icon name="layers" />
        </div>
        <strong>Set up Northfield High</strong>
        <Button kind="ghost" onClick={() => setView('overview')}>
          Save and exit
        </Button>
      </div>

      <div className="onboarding-body">
        <aside>
          <span>SETUP PROGRESS</span>
          <h2>Bring your school online</h2>
          <p>
            Complete these steps to create a polished foundation. You can change
            anything later.
          </p>
          {steps.map((x, i) => (
            <button
              key={x}
              type="button"
              className={
                step === i + 1 ? 'active' : step > i + 1 ? 'complete' : ''
              }
              onClick={() => setStep(i + 1)}
            >
              <span>
                {step > i + 1 ? <Icon name="check" size={13} /> : i + 1}
              </span>
              <div>
                <small>STEP 0{i + 1}</small>
                <strong>{x}</strong>
              </div>
            </button>
          ))}
        </aside>

        <main>
          <div className="step-progress">
            <span>Step {step} of 5</span>
            <i>
              <b style={{ width: `${step * 20}%` }} />
            </i>
          </div>

          {step === 1 && (
            <>
              <span className="eyebrow">TELL US ABOUT YOUR SCHOOL</span>
              <h1>Start with the essentials.</h1>
              <p>This information creates the foundation of your website.</p>
              <div className="logo-upload large">
                <div>NH</div>
                <span>
                  <strong>Upload school logo</strong>
                  <small>PNG, JPG or SVG · Recommended 512 × 512</small>
                  <button type="button">Choose image</button>
                </span>
              </div>
              <div className="form-grid">
                <label>
                  School name
                  <input defaultValue="Northfield High School" />
                </label>
                <label>
                  School type
                  <select defaultValue="Secondary School">
                    <option>Secondary School</option>
                  </select>
                </label>
                <label className="full">
                  School address
                  <input defaultValue="27 Lakeview Avenue, Dhanmondi, Dhaka" />
                </label>
                <label>
                  Contact number
                  <input defaultValue="+880 2 555 0142" />
                </label>
                <label>
                  Public email
                  <input defaultValue="hello@northfield.edu" />
                </label>
                <label>
                  Established year
                  <input defaultValue="1983" />
                </label>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <span className="eyebrow">CREATE YOUR IDENTITY</span>
              <h1>Make it unmistakably yours.</h1>
              <p>Choose a name, address, and brand colors for your website.</p>
              <div className="form-grid">
                <label className="full">
                  Website name
                  <input defaultValue="Northfield High School" />
                </label>
                <label className="full">
                  Website address
                  <div className="slug-input">
                    <span>schoolcanvas.app/</span>
                    <input defaultValue="northfield-high" />
                  </div>
                </label>
                <label className="full">
                  Short school description
                  <textarea
                    defaultValue="A vibrant learning community where every student is known, challenged, and inspired."
                  />
                </label>
                <label>
                  Primary color
                  <div className="color-input">
                    <i />
                    <input defaultValue="#163D72" />
                  </div>
                </label>
                <label>
                  Accent color
                  <div className="color-input gold">
                    <i />
                    <input defaultValue="#E3AD3F" />
                  </div>
                </label>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <span className="eyebrow">CHOOSE A STARTING POINT</span>
              <h1>Select your first template.</h1>
              <p>
                Your content is independent from your design, so you can switch
                anytime.
              </p>
              <div className="onboard-templates">
                {templates.slice(0, 3).map((x, i) => (
                  <button
                    key={x.name}
                    type="button"
                    className={i === 0 ? 'active' : ''}
                  >
                    <div style={{ backgroundImage: `url(${x.image})` }}>
                      {i === 0 && (
                        <span>
                          <Icon name="check" size={13} />
                        </span>
                      )}
                    </div>
                    <strong>{x.name}</strong>
                    <small>{x.category}</small>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <span className="eyebrow">ADD THE BASICS</span>
              <h1>Give visitors a warm welcome.</h1>
              <p>Draft the key content people look for first.</p>
              <div className="form-grid">
                <label className="full">
                  About your school
                  <textarea
                    defaultValue="Northfield High School is a caring, ambitious community committed to academic excellence and personal growth."
                  />
                </label>
                <label>
                  Principal name
                  <input defaultValue="Dr. Farhana Noor" />
                </label>
                <label>
                  Principal designation
                  <input defaultValue="Principal" />
                </label>
                <label className="full">
                  Academic overview
                  <textarea
                    defaultValue="Our connected learning journey spans Primary, Middle and Senior School."
                  />
                </label>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <span className="eyebrow">READY TO SHARE</span>
              <h1>Your website is taking shape.</h1>
              <p>
                Review your foundation, then save a draft or publish your first
                version.
              </p>
              <div
                className="onboard-preview"
                style={{
                  backgroundImage: `linear-gradient(90deg,#0f274ddd,transparent),url(${heroImage})`,
                }}
              >
                <span>NORTHFIELD HIGH SCHOOL</span>
                <strong>
                  Shaping thinkers.
                  <br />
                  Building character.
                </strong>
                <small>northfield-high.schoolcanvas.app</small>
              </div>
              <div className="ready-list">
                {[
                  'School profile completed',
                  'Website identity configured',
                  'Aster Academy template selected',
                  'Initial content added',
                ].map((x) => (
                  <span key={x}>
                    <i>
                      <Icon name="check" size={12} />
                    </i>
                    {x}
                  </span>
                ))}
              </div>
            </>
          )}

          <div className="onboard-actions">
            <Button onClick={() => step > 1 && setStep(step - 1)}>
              {step === 1 ? 'Save draft' : 'Back'}
            </Button>
            <Button
              kind="primary"
              onClick={() => {
                if (step < 5) setStep(step + 1)
                else {
                  notify('Your website is now published')
                  setView('overview')
                }
              }}
            >
              {step === 5 ? 'Publish website' : 'Continue'}
              <Icon name="arrow" size={14} />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}
