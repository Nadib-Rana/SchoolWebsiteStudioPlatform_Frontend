export interface ContentFormData {
  // Tab 0: School Information
  schoolName: string
  schoolType: string
  address: string
  phone: string
  email: string
  establishedYear: string
  schoolCode: string
  officeHours: string
  logoUrl: string
  faviconUrl: string
  coverUrl: string

  // Tab 1: About School
  motto: string
  shortBio: string
  missionStatement: string
  visionStatement: string

  // Tab 2: Principal Message
  principalName: string
  principalTitle: string
  principalBio: string
  principalPhotoUrl: string

  // Tab 3: Academics
  curriculum: string
  academicLevels: string

  // Tab 4: Classes & Grades
  gradesOffered: string
  classSize: string

  // Tab 5: Subjects
  subjectsSummary: string

  // Tab 6: Facilities
  facilitiesOverview: string

  // Tab 7: Achievements
  achievementsText: string
}

export const INITIAL_CONTENT_FORM_DATA: ContentFormData = {
  schoolName: 'Northfield High School',
  schoolType: 'Secondary school',
  address: '27 Lakeview Avenue, Dhanmondi, Dhaka 1209',
  phone: '+880 2 555 0142',
  email: 'hello@northfield.edu',
  establishedYear: '1983',
  schoolCode: 'NHS-1042',
  officeHours: 'Monday - Friday: 8:00 AM - 4:30 PM',
  logoUrl: '',
  faviconUrl: '',
  coverUrl: '',

  motto: 'Excellence in Education, Leadership in Character',
  shortBio:
    'Northfield High School has provided excellence in secondary education for over four decades.',
  missionStatement:
    'To provide an inclusive, inspiring environment where curiosity is celebrated and students are prepared for purposeful lives.',
  visionStatement:
    'To cultivate empathetic, forward-thinking scholars and leaders who contribute meaningfully to society.',

  principalName: 'Dr. Farhana Noor',
  principalTitle: 'Principal & Head Administrator',
  principalBio:
    'At Northfield, we pair high expectations with genuine care. Our students learn to think deeply, act with integrity, and use their gifts in service of others.',
  principalPhotoUrl: '',

  curriculum: 'National Curriculum & Cambridge International',
  academicLevels:
    'Primary (Grades 1-5), Middle (Grades 6-8), Senior (Grades 9-12)',

  gradesOffered: 'Grades 1 through 12',
  classSize: '24-28 students per section',

  subjectsSummary:
    'Core: Mathematics, Sciences, English Literature, History, ICT. Electives: Robotics, Studio Art, Music, French.',

  facilitiesOverview:
    'Modern Science Laboratories, Digital Media Library, Sports Complex, Auditorium, Visual Arts Wing.',

  achievementsText:
    'Top 1% National STEM Competition, Regional Debate Champions 2025, Eco-School Green Flag Award.',
}
