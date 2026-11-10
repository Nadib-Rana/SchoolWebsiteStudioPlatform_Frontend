'use client'

export interface EventFormState {
  title: string
  category: string
  eventDate: string
  time: string
  venue: string
  description: string
  status: string
  registrationUrl: string
}

interface EventEditorFormProps {
  event: EventFormState
  setEvent: React.Dispatch<React.SetStateAction<EventFormState>>
}

export function EventEditorForm({ event, setEvent }: EventEditorFormProps) {
  return (
    <div className="modal-form">
      <label>
        Event title *
        <input
          required
          placeholder="e.g. Annual Interschool Science Fair"
          value={event.title}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, title: e.target.value }))
          }
        />
      </label>
      <label>
        Event description
        <textarea
          rows={3}
          placeholder="Describe the activities, schedule, and attendees"
          value={event.description}
          onChange={(e) =>
            setEvent((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </label>
      <div className="form-grid">
        <label>
          Event Date *
          <input
            required
            type="date"
            value={event.eventDate}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, eventDate: e.target.value }))
            }
          />
        </label>
        <label>
          Time / Hours
          <input
            placeholder="e.g. 9:00 AM - 4:00 PM"
            value={event.time}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, time: e.target.value }))
            }
          />
        </label>
        <label>
          Venue / Location
          <input
            placeholder="e.g. Main Auditorium"
            value={event.venue}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, venue: e.target.value }))
            }
          />
        </label>
        <label>
          Category
          <select
            value={event.category}
            onChange={(e) =>
              setEvent((prev) => ({ ...prev, category: e.target.value }))
            }
          >
            <option value="Academic">Academic</option>
            <option value="Community">Community</option>
            <option value="Arts">Arts</option>
            <option value="Sports">Sports</option>
          </select>
        </label>
      </div>
    </div>
  )
}
