'use client'

interface NoticeFormState {
  title: string
  category: string
  description: string
  fileUrl: string
  isPinned: boolean
  priority: string
  status: string
  publishDate: string
}

interface NoticeEditorFormProps {
  notice: NoticeFormState
  setNotice: React.Dispatch<React.SetStateAction<NoticeFormState>>
}

export function NoticeEditorForm({ notice, setNotice }: NoticeEditorFormProps) {
  return (
    <div className="modal-form">
      <label>
        Notice title *
        <input
          required
          placeholder="e.g. Science Fair Registration Open"
          value={notice.title}
          onChange={(e) =>
            setNotice((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </label>
      <label>
        Description *
        <textarea
          required
          rows={4}
          placeholder="Provide notice instructions, deadlines, and information"
          value={notice.description}
          onChange={(e) =>
            setNotice((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </label>
      <div className="form-grid">
        <label>
          Category
          <select
            value={notice.category}
            onChange={(e) =>
              setNotice((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="General">General</option>
            <option value="Academic">Academic</option>
            <option value="Parents">Parents</option>
            <option value="Examinations">Examinations</option>
            <option value="Admissions">Admissions</option>
          </select>
        </label>
        <label>
          Publish Date
          <input
            type="date"
            value={notice.publishDate}
            onChange={(e) =>
              setNotice((prev) => ({ ...prev, publishDate: e.target.value }))
            }
          />
        </label>
        <label>
          Priority
          <select
            value={notice.priority}
            onChange={(e) =>
              setNotice((prev) => ({ ...prev, priority: e.target.value }))
            }
          >
            <option value="NORMAL">Normal</option>
            <option value="HIGH">High / Urgent</option>
          </select>
        </label>
        <label>
          Pinned Notice
          <select
            value={notice.isPinned ? 'true' : 'false'}
            onChange={(e) =>
              setNotice((prev) => ({
                ...prev,
                isPinned: e.target.value === 'true',
              }))
            }
          >
            <option value="false">No</option>
            <option value="true">Yes (Pin to top)</option>
          </select>
        </label>
      </div>
    </div>
  )
}
