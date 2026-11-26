import type {
  AdmissionFormData,
  SubmissionResult,
  TrackResult,
} from './admission-form.types'

export interface SchoolReceiptMeta {
  schoolName: string
  logoUrl?: string
  address?: string
  phone?: string
  email?: string
  schoolSlug?: string
}

export function escapeHtml(value: string | undefined | null): string {
  if (!value) return '—'
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function resolveAbsoluteUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined
  if (/^(javascript|vbscript|file):/i.test(trimmed)) {
    return undefined
  }
  if (
    trimmed.startsWith('data:image/') ||
    trimmed.startsWith('blob:') ||
    /^https?:\/\//i.test(trimmed)
  ) {
    return trimmed
  }
  if (trimmed.startsWith('data:')) {
    return undefined
  }
  if (typeof window !== 'undefined') {
    try {
      return new URL(trimmed, window.location.origin).toString()
    } catch {
      return trimmed
    }
  }
  return trimmed
}

function formatShortDate(value: string | Date | undefined | null): string {
  if (!value) return '—'
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' && value.trim() ? value : '—'
  }
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatFeeValue(amount?: number | string | null, currency = 'BDT'): string {
  const num = Number(amount ?? 0)
  if (!num || Number.isNaN(num) || num <= 0) return 'Free'
  return `${num} ${(currency || 'BDT').toUpperCase()}`
}

function getPaymentStatusMeta(
  paymentStatus?: string | null,
  feeAmount?: number | string | null,
  isStatusSlip = false,
): { stampLabel: string; stampClass: string; subtitle: string } {
  const status = (paymentStatus || '').toUpperCase()
  const fee = Number(feeAmount ?? 0)

  if (status === 'PAID') {
    return {
      stampLabel: 'PAID',
      stampClass: 'stamp-paid',
      subtitle: isStatusSlip
        ? 'Official Admission Status Slip (Paid)'
        : 'Official Admission Application Slip (Paid)',
    }
  }
  if (status === 'UNDER_VERIFICATION') {
    return {
      stampLabel: 'VERIFYING',
      stampClass: 'stamp-verifying',
      subtitle: isStatusSlip
        ? 'Provisional Admission Status Slip (Under Verification)'
        : 'Provisional Admission Application Slip (Under Verification)',
    }
  }
  if (status === 'PENDING' || status === 'FAILED' || (fee > 0 && status !== 'NOT_REQUIRED')) {
    return {
      stampLabel: 'UNPAID',
      stampClass: 'stamp-unpaid',
      subtitle: isStatusSlip
        ? 'Provisional Admission Status Slip (Payment Pending)'
        : 'Provisional Admission Application Slip (Payment Pending)',
    }
  }
  return {
    stampLabel: 'CONFIRMED',
    stampClass: 'stamp-confirmed',
    subtitle: isStatusSlip
      ? 'Official Admission Status Slip'
      : 'Official Admission Application Slip',
  }
}

export function renderLogoBox(
  logoUrl: string | undefined,
  schoolName: string,
  initial: string,
): string {
  const resolved = resolveAbsoluteUrl(logoUrl)
  if (!resolved) {
    return `<div class="header-logo">${escapeHtml(initial)}</div>`
  }
  return `<div class="header-logo"><img src="${escapeHtml(resolved)}" alt="${escapeHtml(schoolName)}" data-initial="${escapeHtml(initial)}" onerror="this.style.display='none';if(this.parentNode){this.parentNode.textContent=this.getAttribute('data-initial')||'S';}" /></div>`
}

function renderApplicantPhotoHtml(
  photoUrl: string | undefined | null,
  studentName: string,
): string {
  const resolved = resolveAbsoluteUrl(photoUrl)
  if (!resolved) return ''
  return `<div class="summary-photo"><img src="${escapeHtml(resolved)}" alt="${escapeHtml(studentName || 'Applicant Photo')}" onerror="this.parentNode.style.display='none';" /></div>`
}

function renderField(
  label: string,
  value: string | undefined | null,
  options?: { mono?: boolean; full?: boolean },
): string {
  const cls = [
    'field',
    options?.full ? 'field-full' : '',
    options?.mono ? 'field-mono' : '',
  ]
    .filter(Boolean)
    .join(' ')
  return `<div class="${cls}">
    <div class="field-label">${escapeHtml(label)}</div>
    <div class="field-value">${escapeHtml(value)}</div>
  </div>`
}

function renderHeaderAndSummary(params: {
  schoolName: string
  logoUrl?: string
  initial: string
  contactLine: string
  subtitle: string
  stampLabel: string
  stampClass: string
  applicationNumber: string
  submissionDate: string
  appliedClass: string
  applicationStatus: string
  photoUrl?: string | null
  studentName: string
}): string {
  const photoHtml = renderApplicantPhotoHtml(params.photoUrl, params.studentName)
  return `
    <div class="doc-header">
      <div class="header-left">
        ${renderLogoBox(params.logoUrl, params.schoolName, params.initial)}
        <div>
          <h1 class="school-name">${escapeHtml(params.schoolName)}</h1>
          <div class="doc-subtitle">${escapeHtml(params.subtitle)}</div>
          ${params.contactLine ? `<div class="school-contact">${escapeHtml(params.contactLine)}</div>` : ''}
        </div>
      </div>
      <div class="stamp ${params.stampClass}">${escapeHtml(params.stampLabel)}</div>
    </div>

    <div class="summary-card">
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">Application Number</div>
          <div class="summary-value summary-mono">${escapeHtml(params.applicationNumber)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Submission Date</div>
          <div class="summary-value">${escapeHtml(params.submissionDate)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Applied Class</div>
          <div class="summary-value">${escapeHtml(params.appliedClass)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">Application Status</div>
          <div class="summary-value">${escapeHtml((params.applicationStatus || 'SUBMITTED').toUpperCase())}</div>
        </div>
      </div>
      ${photoHtml}
    </div>`
}

function renderPaymentCard(
  sectionNumber: number,
  payment: {
    feeAmount?: number | null
    currency?: string
    paymentStatus?: string | null
    paymentMethod?: string | null
    transactionId?: string | null
  },
): string {
  const statusUpper = (payment.paymentStatus || 'NOT_REQUIRED').toUpperCase()
  const methodDisplay =
    payment.paymentMethod ||
    (statusUpper === 'PAID'
      ? 'Online'
      : statusUpper === 'NOT_REQUIRED'
        ? 'N/A'
        : 'Pending')

  return `
    <div class="section-card">
      <div class="section-bar">${sectionNumber}. Admission Form Fee &amp; Payment Receipt</div>
      <div class="section-body grid-4">
        ${renderField('Fee Amount', formatFeeValue(payment.feeAmount, payment.currency))}
        ${renderField('Payment Status', statusUpper)}
        ${renderField('Method', methodDisplay)}
        ${renderField('TrxID / Reference', payment.transactionId || '—', { mono: true })}
      </div>
    </div>`
}

function renderSignaturesAndFooter(): string {
  return `
    <div class="signatures">
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Applicant / Guardian Signature</div>
      </div>
      <div class="sig-box">
        <div class="sig-line"></div>
        <div class="sig-label">Admissions Office / Authorized Signature</div>
      </div>
    </div>
    <div class="doc-footer">
      Computer-generated admission document · Generated on ${escapeHtml(new Date().toLocaleString())}
    </div>`
}

function openPrintDocument(title: string, bodyHtml: string) {
  if (typeof window === 'undefined') return
  const printWin = window.open('', '_blank', 'width=860,height=980')
  if (!printWin) {
    window.print()
    return
  }

  const baseHref = escapeHtml(window.location.origin + '/')

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <base href="${baseHref}" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 12mm 14mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      color: #0f172a;
      background: #f1f5f9;
      padding: 20px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .actions {
      max-width: 780px;
      margin: 0 auto 14px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 9px 16px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-primary {
      background: #0f172a;
      color: #ffffff;
      border-color: #0f172a;
    }
    .sheet {
      max-width: 780px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 26px 30px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    }
    .doc-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      padding-bottom: 12px;
      margin-bottom: 14px;
      border-bottom: 2px solid #0f172a;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .header-logo {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      overflow: hidden;
      flex-shrink: 0;
    }
    .header-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 2px;
      background: #ffffff;
    }
    .school-name {
      margin: 0;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      color: #0f172a;
      line-height: 1.2;
    }
    .doc-subtitle {
      font-size: 12px;
      color: #475569;
      margin-top: 3px;
      font-weight: 500;
    }
    .school-contact {
      font-size: 10.5px;
      color: #64748b;
      margin-top: 2px;
    }
    .stamp {
      padding: 6px 15px;
      border-radius: 7px;
      border: 2px solid #be123c;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      white-space: nowrap;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .stamp-unpaid { border-color: #be123c; color: #be123c; background: #fff1f2; }
    .stamp-paid { border-color: #15803d; color: #15803d; background: #f0fdf4; }
    .stamp-verifying { border-color: #b45309; color: #b45309; background: #fffbeb; }
    .stamp-confirmed { border-color: #0f766e; color: #0f766e; background: #f0fdfa; }

    .summary-card {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 13px 18px;
      margin-bottom: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: #ffffff;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.04);
      break-inside: avoid;
    }
    .summary-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 11px 24px;
    }
    .summary-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #64748b;
      margin-bottom: 2px;
    }
    .summary-value {
      font-size: 13.5px;
      font-weight: 800;
      color: #0f172a;
      word-break: break-word;
    }
    .summary-mono {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 14.5px;
    }
    .summary-photo {
      width: 78px;
      height: 92px;
      border-radius: 8px;
      border: 1px solid #cbd5e1;
      overflow: hidden;
      flex-shrink: 0;
      background: #f8fafc;
    }
    .summary-photo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .section-card {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      margin-bottom: 12px;
      background: #ffffff;
      break-inside: avoid;
    }
    .section-bar {
      background: #0f172a;
      color: #ffffff;
      padding: 7px 14px;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .section-body {
      padding: 11px 14px;
      display: grid;
      gap: 9px 22px;
    }
    .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .field-full { grid-column: 1 / -1; }
    .field-label {
      font-size: 10.5px;
      color: #64748b;
      font-weight: 500;
      margin-bottom: 1px;
    }
    .field-value {
      font-size: 12.5px;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      word-break: break-word;
    }
    .field-mono .field-value {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .note-box {
      padding: 10px 14px;
      font-size: 12px;
      color: #334155;
      line-height: 1.5;
    }

    .signatures {
      display: flex;
      justify-content: space-between;
      gap: 44px;
      margin-top: 34px;
      padding: 0 18px;
      break-inside: avoid;
    }
    .sig-box { flex: 1; text-align: center; }
    .sig-line {
      border-top: 1.5px solid #334155;
      margin-bottom: 6px;
    }
    .sig-label {
      font-size: 11px;
      color: #475569;
      font-weight: 600;
    }
    .doc-footer {
      margin-top: 18px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 10.5px;
      color: #94a3b8;
    }

    @media print {
      body { background: #ffffff; padding: 0; }
      .actions { display: none !important; }
      .sheet {
        box-shadow: none;
        border: none;
        border-radius: 0;
        padding: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" onclick="window.close()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="sheet">
    ${bodyHtml}
  </div>
  <script>
    (function() {
      var printed = false;
      function triggerPrint() {
        if (printed) return;
        printed = true;
        window.print();
      }
      function waitForImagesAndPrint() {
        var imgs = Array.prototype.slice.call(document.images || []);
        if (imgs.length === 0) {
          setTimeout(triggerPrint, 120);
          return;
        }
        var pending = imgs.length;
        var doneOne = function() {
          pending -= 1;
          if (pending <= 0) {
            setTimeout(triggerPrint, 120);
          }
        };
        imgs.forEach(function(img) {
          if (img.complete) {
            if (typeof img.decode === 'function') {
              img.decode().then(doneOne, doneOne);
            } else {
              doneOne();
            }
          } else {
            img.addEventListener('load', doneOne, { once: true });
            img.addEventListener('error', doneOne, { once: true });
          }
        });
        setTimeout(triggerPrint, 3000);
      }
      if (document.readyState === 'complete') {
        waitForImagesAndPrint();
      } else {
        window.addEventListener('load', waitForImagesAndPrint, { once: true });
      }
    })();
  </script>
</body>
</html>`

  printWin.document.open()
  printWin.document.write(html)
  printWin.document.close()
}

export function printAdmissionReceipt(
  school: SchoolReceiptMeta,
  submission: SubmissionResult,
  formData: AdmissionFormData,
) {
  const initial = (school.schoolName || 'S').charAt(0).toUpperCase()
  const submissionDate = formatShortDate(new Date())
  const fullStudentName =
    submission.studentName ||
    [formData.firstName, formData.lastName].filter(Boolean).join(' ') ||
    formData.studentName
  const contactLine = [school.address, school.phone, school.email]
    .filter(Boolean)
    .join(' · ')

  const { stampLabel, stampClass, subtitle } = getPaymentStatusMeta(
    submission.paymentStatus,
    submission.feeAmount,
    false,
  )

  const permanentAddr = formData.sameAsPresentAddress
    ? formData.presentAddress || formData.address
    : formData.permanentAddress

  const body = `
    ${renderHeaderAndSummary({
      schoolName: school.schoolName,
      logoUrl: school.logoUrl,
      initial,
      contactLine,
      subtitle,
      stampLabel,
      stampClass,
      applicationNumber: submission.applicationNumber,
      submissionDate,
      appliedClass: formData.applyingForGrade,
      applicationStatus: submission.status || 'SUBMITTED',
      photoUrl: formData.photoUrl || submission.photoUrl,
      studentName: fullStudentName,
    })}

    <div class="section-card">
      <div class="section-bar">1. Student Information</div>
      <div class="section-body grid-2">
        ${renderField('Full Name', fullStudentName)}
        ${renderField('Date of Birth', formatShortDate(formData.dateOfBirth))}
        ${renderField('Gender', formData.gender)}
        ${renderField('Blood Group', formData.bloodGroup)}
        ${renderField('Birth Registration Number', formData.birthRegistrationNo, { mono: true })}
        ${renderField('Applicant Mobile Phone', formData.phone)}
        ${renderField('Applicant Email', formData.email, { full: true })}
      </div>
    </div>

    <div class="section-card">
      <div class="section-bar">2. Parent &amp; Guardian Information</div>
      <div class="section-body grid-2">
        ${renderField("Father's Name", formData.fatherName)}
        ${renderField("Mother's Name", formData.motherName)}
        ${renderField('Guardian Name', formData.guardianName)}
        ${renderField('Relationship', formData.guardianRelationship)}
        ${renderField('Guardian Phone', formData.guardianPhone)}
        ${renderField('Guardian Email', formData.guardianEmail)}
      </div>
    </div>

    <div class="section-card">
      <div class="section-bar">3. Address &amp; Previous Schooling</div>
      <div class="section-body grid-2">
        ${renderField('Present Address', formData.presentAddress || formData.address)}
        ${renderField('Permanent Address', permanentAddr)}
        ${renderField('Previous School', formData.previousSchool, { full: true })}
      </div>
    </div>

    ${renderPaymentCard(4, {
      feeAmount: submission.feeAmount,
      currency: submission.currency,
      paymentStatus: submission.paymentStatus,
      paymentMethod: submission.paymentMethod,
      transactionId: submission.transactionId,
    })}

    ${renderSignaturesAndFooter()}`

  openPrintDocument(
    `Admission Confirmation - ${submission.applicationNumber}`,
    body,
  )
}

export function printTrackStatusSlip(
  school: SchoolReceiptMeta,
  track: TrackResult,
) {
  const resolvedSchoolName = track.schoolName || school.schoolName
  const initial = (resolvedSchoolName || 'S').charAt(0).toUpperCase()
  const submissionDate = formatShortDate(track.submittedAt)
  const interviewDate = track.interviewDate
    ? new Date(track.interviewDate).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—'
  const contactLine = [school.address, school.phone, school.email]
    .filter(Boolean)
    .join(' · ')

  const { stampLabel, stampClass, subtitle } = getPaymentStatusMeta(
    track.paymentStatus,
    track.feeAmount,
    true,
  )

  const body = `
    ${renderHeaderAndSummary({
      schoolName: resolvedSchoolName,
      logoUrl: school.logoUrl,
      initial,
      contactLine,
      subtitle,
      stampLabel,
      stampClass,
      applicationNumber: track.applicationNumber,
      submissionDate,
      appliedClass: track.applyingForGrade,
      applicationStatus: track.status || 'SUBMITTED',
      photoUrl: track.photoUrl,
      studentName: track.studentName,
    })}

    <div class="section-card">
      <div class="section-bar">1. Application Summary</div>
      <div class="section-body grid-2">
        ${renderField('Applicant Name', track.studentName)}
        ${renderField('Applied Class / Grade', track.applyingForGrade)}
        ${renderField('Submitted On', submissionDate)}
        ${renderField('Interview Schedule', interviewDate)}
      </div>
    </div>

    ${renderPaymentCard(2, {
      feeAmount: track.feeAmount,
      currency: track.currency,
      paymentStatus: track.paymentStatus,
      paymentMethod: track.paymentMethod,
      transactionId: track.transactionId,
    })}

    ${
      track.notes
        ? `<div class="section-card">
            <div class="section-bar">3. Admissions Committee Note</div>
            <div class="note-box">${escapeHtml(track.notes)}</div>
          </div>`
        : ''
    }

    ${renderSignaturesAndFooter()}`

  openPrintDocument(
    `Admission Status - ${track.applicationNumber}`,
    body,
  )
}
