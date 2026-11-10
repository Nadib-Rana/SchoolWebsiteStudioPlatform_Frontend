'use client'

import { Icon } from '@/components/common/Icon'
import type { TeacherData } from '@/lib/public-site'

interface InnerFacultyGridProps {
  teachers?: TeacherData[]
  onSelectTeacher: () => void
}

export function InnerFacultyGrid({ teachers, onSelectTeacher }: InnerFacultyGridProps) {
  const list =
    teachers && teachers.length > 0
      ? teachers
      : [
          { id: '1', name: 'Mahmud Karim', designation: 'HEAD OF SCIENCE', photoUrl: null, bio: null },
          { id: '2', name: 'Sara Jahan', designation: 'SENIOR ENGLISH TEACHER', photoUrl: null, bio: null },
          { id: '3', name: 'Nabil Chowdhury', designation: 'FACULTY MEMBER', photoUrl: null, bio: null },
          { id: '4', name: 'Nusrat Ahmed', designation: 'FACULTY MEMBER', photoUrl: null, bio: null },
          { id: '5', name: 'Tanvir Islam', designation: 'FACULTY MEMBER', photoUrl: null, bio: null },
          { id: '6', name: 'Lamia Haque', designation: 'FACULTY MEMBER', photoUrl: null, bio: null },
        ]

  return (
    <section className="faculty-grid">
      {list.map((x, i) => (
        <article key={x.id || x.name}>
          {x.photoUrl ? (
            <div
              className="faculty-photo"
              style={{
                backgroundImage: `url(${x.photoUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
              }}
            />
          ) : (
            <div className={`faculty-photo fp${i % 6}`}>
              {x.name
                .split(' ')
                .map((v: string) => v[0])
                .join('')}
            </div>
          )}
          <small>
            {x.designation ||
              (i === 0
                ? 'HEAD OF SCIENCE'
                : i === 1
                ? 'SENIOR ENGLISH TEACHER'
                : 'FACULTY MEMBER')}
          </small>
          <h3>{x.name}</h3>
          <p>
            {x.bio ||
              'Committed to thoughtful teaching, meaningful relationships, and confident learners.'}
          </p>
          <button
            type="button"
            onClick={onSelectTeacher}
          >
            View profile <Icon name="arrow" size={13} />
          </button>
        </article>
      ))}
    </section>
  )
}
