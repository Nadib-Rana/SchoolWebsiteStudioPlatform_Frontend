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

function escapeHtml(value: string | undefined | null): string {
  if (!value) return '—'
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function openPrintDocument(title: string, bodyHtml: string) {
  if (typeof window === 'undefined') return
  const printWin = window.open('', '_blank', 'width=860,height=980')
  if (!printWin) {
    window.print()
    return
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      padding: 24px;
    }
    .sheet {
      max-width: 760px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    }
    .header {
      background: #102f58;
      color: #ffffff;
      padding: 24px 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }
    .brand { display: flex; align-items: center; gap: 14px; }
    .logo {
      width: 54px; height: 54px; border-radius: 10px;
      background: rgba(255,255,255,0.14);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; font-weight: 800; color: #fff; overflow: hidden;
    }
    .logo img { width: 100%; height: 100%; object-fit: contain; background: #fff; padding: 3px; }
    .school-title { font-size: 20px; font-weight: 800; margin: 0; }
    .school-meta { font-size: 12px; color: #cbd5e1; margin-top: 4px; }
    .badge {
      background: #e3ad3f;
      color: #0f172a;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 6px 12px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .content { padding: 26px 28px; }
    .ref-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 22px;
    }
    .ref-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; }
    .ref-code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 2px; }
    .status-pill {
      display: inline-block;
      background: #dcfce7;
      color: #166534;
      border: 1px solid #86efac;
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
    }
    h3 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #475569;
      margin: 20px 0 10px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    td { padding: 8px 10px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
    td.label { width: 34%; color: #64748b; font-weight: 600; }
    td.val { color: #0f172a; font-weight: 600; }
    .notes {
      margin-top: 20px;
      padding: 14px 16px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 10px;
      font-size: 12px;
      color: #78350f;
      line-height: 1.55;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      gap: 32px;
      margin-top: 42px;
      padding-top: 12px;
    }
    .sig-box { flex: 1; text-align: center; }
    .sig-line { border-top: 1px dashed #94a3b8; margin-bottom: 6px; }
    .sig-label { font-size: 11px; color: #64748b; font-weight: 600; }
    .footer-bar {
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      padding: 12px 28px;
      font-size: 11px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .actions {
      max-width: 760px;
      margin: 0 auto 16px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 10px 18px;
      border-radius: 10px;
      border: 1px solid #cbd5e1;
      background: #fff;
      color: #0f172a;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    .btn-primary { background: #102f58; color: #fff; border-color: #102f58; }
    @media print {
      body { background: #fff; padding: 0; }
      .actions { display: none !important; }
      .sheet { box-shadow: none; border: none; border-radius: 0; max-width: 100%; }
      .header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .badge, .status-pill, .ref-bar, .notes { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" onclick="window.close()">Close</button>
    <button class="btn btn-primary" onclick="window.print()">Print / Save as PDF</button>
  </div>
  ${bodyHtml}
  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 250);
    });
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
  const session = `${new Date().getFullYear()}–${new Date().getFullYear() + 1}`
  const submittedDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const fullStudentName =
    submission.studentName ||
    [formData.firstName, formData.lastName].filter(Boolean).join(' ') ||
    formData.studentName

  const contactLine = [school.address, school.phone, school.email]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' · ')

  const body = `
  <div class="sheet">
    <div class="header">
      <div class="brand">
        <div class="logo">
          ${school.logoUrl ? `<img src="${escapeHtml(school.logoUrl)}" alt="${escapeHtml(school.schoolName)}" />` : escapeHtml(initial)}
        </div>
        <div>
          <h1 class="school-title">${escapeHtml(school.schoolName)}</h1>
          <div class="school-meta">${contactLine || 'Official Admissions Registry'}</div>
        </div>
      </div>
      <span class="badge">Admission Receipt</span>
    </div>

    <div class="content">
      <div class="ref-bar">
        <div>
          <div class="ref-label">Application Reference Number</div>
          <div class="ref-code">${escapeHtml(submission.applicationNumber)}</div>
        </div>
        <div style="text-align:right">
          <span class="status-pill">${escapeHtml(submission.status || 'SUBMITTED')}</span>
          <div class="ref-label" style="margin-top:6px">Session ${escapeHtml(session)} · ${escapeHtml(submittedDate)}</div>
        </div>
      </div>

      <h3>Student Information</h3>
      <table>
        <tr><td class="label">Full Name</td><td class="val">${escapeHtml(fullStudentName)}</td></tr>
        <tr><td class="label">Applying For Class / Grade</td><td class="val">${escapeHtml(formData.applyingForGrade)}</td></tr>
        <tr><td class="label">Date of Birth</td><td class="val">${escapeHtml(formData.dateOfBirth)}</td></tr>
        <tr><td class="label">Gender</td><td class="val">${escapeHtml(formData.gender)}</td></tr>
        <tr><td class="label">Student Phone</td><td class="val">${escapeHtml(formData.phone)}</td></tr>
        ${formData.email ? `<tr><td class="label">Student Email</td><td class="val">${escapeHtml(formData.email)}</td></tr>` : ''}
        ${formData.bloodGroup ? `<tr><td class="label">Blood Group</td><td class="val">${escapeHtml(formData.bloodGroup)}</td></tr>` : ''}
        ${formData.previousSchool ? `<tr><td class="label">Previous School</td><td class="val">${escapeHtml(formData.previousSchool)}</td></tr>` : ''}
      </table>

      <h3>Parent / Guardian Information</h3>
      <table>
        <tr><td class="label">Guardian Name</td><td class="val">${escapeHtml(formData.guardianName)}</td></tr>
        <tr><td class="label">Relationship</td><td class="val">${escapeHtml(formData.guardianRelationship)}</td></tr>
        <tr><td class="label">Guardian Phone</td><td class="val">${escapeHtml(formData.guardianPhone)}</td></tr>
        ${formData.guardianEmail ? `<tr><td class="label">Guardian Email</td><td class="val">${escapeHtml(formData.guardianEmail)}</td></tr>` : ''}
        <tr><td class="label">Residential Address</td><td class="val">${escapeHtml(formData.address)}</td></tr>
      </table>

      <div class="notes">
        <strong>Important Instructions:</strong> Please keep this receipt safe and bring a printed or digital copy during the campus interaction / interview along with original academic records, birth certificate, and applicant photographs. You can track live status anytime using your Application Reference Number on the school website.
      </div>

      <div class="signatures">
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="sig-label">Applicant / Guardian Signature</div>
        </div>
        <div class="sig-box">
          <div class="sig-line"></div>
          <div class="sig-label">Admissions Office Verification</div>
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <span>Generated from ${escapeHtml(school.schoolName)} Online Admissions Portal</span>
      <span>Ref: ${escapeHtml(submission.applicationNumber)}</span>
    </div>
  </div>`

  openPrintDocument(
    `Admission Receipt - ${submission.applicationNumber}`,
    body,
  )
}

export function printTrackStatusSlip(
  school: SchoolReceiptMeta,
  track: TrackResult,
) {
  const initial = (school.schoolName || track.schoolName || 'S')
    .charAt(0)
    .toUpperCase()
  const submittedDate = track.submittedAt
    ? new Date(track.submittedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—'
  const interviewDate = track.interviewDate
    ? new Date(track.interviewDate).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  const contactLine = [school.address, school.phone, school.email]
    .filter(Boolean)
    .map(escapeHtml)
    .join(' · ')

  const body = `
  <div class="sheet">
    <div class="header">
      <div class="brand">
        <div class="logo">
          ${school.logoUrl ? `<img src="${escapeHtml(school.logoUrl)}" alt="${escapeHtml(school.schoolName)}" />` : escapeHtml(initial)}
        </div>
        <div>
          <h1 class="school-title">${escapeHtml(track.schoolName || school.schoolName)}</h1>
          <div class="school-meta">${contactLine || 'Official Admissions Status Slip'}</div>
        </div>
      </div>
      <span class="badge">Status Slip</span>
    </div>

    <div class="content">
      <div class="ref-bar">
        <div>
          <div class="ref-label">Application Reference Number</div>
          <div class="ref-code">${escapeHtml(track.applicationNumber)}</div>
        </div>
        <div style="text-align:right">
          <span class="status-pill">${escapeHtml(track.status)}</span>
          <div class="ref-label" style="margin-top:6px">Printed on ${escapeHtml(new Date().toLocaleDateString())}</div>
        </div>
      </div>

      <h3>Application Summary</h3>
      <table>
        <tr><td class="label">Applicant Name</td><td class="val">${escapeHtml(track.studentName)}</td></tr>
        <tr><td class="label">Class / Grade</td><td class="val">${escapeHtml(track.applyingForGrade)}</td></tr>
        <tr><td class="label">Submitted On</td><td class="val">${escapeHtml(submittedDate)}</td></tr>
        ${interviewDate ? `<tr><td class="label">Interview Schedule</td><td class="val">${escapeHtml(interviewDate)}</td></tr>` : ''}
      </table>

      ${
        track.notes
          ? `<div class="notes"><strong>Admissions Committee Note:</strong> ${escapeHtml(track.notes)}</div>`
          : ''
      }
    </div>

    <div class="footer-bar">
      <span>Official Status Verification · ${escapeHtml(track.schoolName || school.schoolName)}</span>
      <span>Ref: ${escapeHtml(track.applicationNumber)}</span>
    </div>
  </div>`

  openPrintDocument(`Admission Status - ${track.applicationNumber}`, body)
}

