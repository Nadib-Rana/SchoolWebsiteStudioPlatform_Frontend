'use client'

import { useState, useRef } from 'react'
import { templates } from '@/config/templates'
import { useStudio } from '@/context/StudioContext'
import { api } from '@/lib/api-client'
import type { CreatedSchoolInfo } from './onboarding.types'

export function useOnboardingForm() {
  const { setView, notify, refreshSchools } = useStudio()
  const [step, setStep] = useState(1)
  const [isPublishing, setIsPublishing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const [isSuccess, setIsSuccess] = useState(false)
  const [createdSchool, setCreatedSchool] = useState<CreatedSchoolInfo | null>(null)

  const [schoolName, setSchoolName] = useState('Riverside Academy')
  const [schoolType, setSchoolType] = useState('Secondary School')
  const [schoolAddress, setSchoolAddress] = useState('27 Lakeview Avenue, Dhanmondi, Dhaka')
  const [contactPhone, setContactPhone] = useState('+880 1712 998 877')
  const [contactEmail, setContactEmail] = useState('info@riverside.edu')
  const [establishedYear, setEstablishedYear] = useState('1995')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string | null>(null)

  const [slug, setSlug] = useState('riverside-academy')
  const [description, setDescription] = useState(
    'A vibrant learning community where every student is known, challenged, and inspired.'
  )
  const [primaryColor, setPrimaryColor] = useState('#163D72')
  const [accentColor, setAccentColor] = useState('#E3AD3F')
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0)

  const [principalName, setPrincipalName] = useState('Dr. Arthur Pendelton')
  const [principalDesignation, setPrincipalDesignation] = useState('Principal')
  const [academicOverview, setAcademicOverview] = useState(
    'Our connected learning journey spans Primary, Middle and Senior School.'
  )

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => setLogoPreview(reader.result as string)
      reader.readAsDataURL(file)
      try {
        const uploadRes = await api.storage.upload(file)
        setUploadedLogoUrl(uploadRes.publicUrl)
        notify(`Logo "${file.name}" uploaded to storage`)
      } catch {
        notify('Logo preview active')
      }
    }
  }

  const handleExit = () => {
    if (typeof window !== 'undefined' && window.location.pathname.includes('/onboarding')) {
      window.location.href = '/'
    } else {
      setView('overview')
    }
  }

  const handleSchoolNameChange = (val: string) => {
    setSchoolName(val)
    if (fieldErrors.schoolName) setFieldErrors((prev) => ({ ...prev, schoolName: '' }))
    const autoSlug = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    if (autoSlug) {
      setSlug(autoSlug)
      if (fieldErrors.slug) setFieldErrors((prev) => ({ ...prev, slug: '' }))
    }
  }

  const validateStep = (currentStep: number): boolean => {
    setErrorMessage('')
    const errors: Record<string, string> = {}
    const details: string[] = []

    if (currentStep === 1) {
      if (!schoolName.trim()) {
        errors.schoolName = 'School name is required.'
        details.push('Step 1 (School Info) → School name is required.')
      }
      if (!contactEmail.trim()) {
        errors.contactEmail = 'Public email is required.'
        details.push('Step 1 (School Info) → Public email is required.')
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) {
        errors.contactEmail = 'Please enter a valid email address (e.g. info@school.edu).'
        details.push(`Step 1 (School Info) → Invalid Public Email "${contactEmail.trim()}".`)
      }
      if (!contactPhone.trim()) {
        errors.contactPhone = 'Contact phone number is required.'
        details.push('Step 1 (School Info) → Contact number is required.')
      }
    }

    if (currentStep === 2) {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '')
      if (!cleanSlug) {
        errors.slug = 'Website address (slug) is required.'
        details.push('Step 2 (Identity) → Website address (Slug) is required.')
      } else if (cleanSlug.length < 3) {
        errors.slug = 'Website address must be at least 3 characters long.'
        details.push(`Step 2 (Identity) → Website address "${cleanSlug}" must be at least 3 characters.`)
      } else if (cleanSlug !== slug) {
        errors.slug = 'Only lowercase letters, numbers, and hyphens are allowed.'
        details.push('Step 2 (Identity) → Website address (Slug) can only contain lowercase letters, numbers, and hyphens.')
      }
    }

    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) {
      setErrorMessage(details.join(' '))
      return false
    }
    return true
  }

  const handlePublish = async () => {
    setErrorMessage('')
    if (!api.getAuthToken()) {
      setErrorMessage('You must be signed in to provision a school. Please log in first.')
      return
    }
    if (!validateStep(1)) {
      setStep(1)
      return
    }
    if (!validateStep(2)) {
      setStep(2)
      return
    }

    setIsPublishing(true)
    try {
      const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const selectedTpl = templates[selectedTemplateIndex] || templates[0]
      const themePreset = `theme-${selectedTpl.theme || 'modern'}`

      const payload = {
        name: schoolName.trim(),
        slug: cleanSlug,
        templateId: selectedTpl.name || 'Aster Academy',
        themePreset,
        primaryColor,
        principalName: principalName.trim() || 'Principal',
        contactEmail: contactEmail.trim().toLowerCase(),
        contactPhone: contactPhone.trim(),
        selectedPages: [
          'home',
          'about',
          'academics',
          'admissions',
          'teachers',
          'notices',
          'events',
          'gallery',
          'contact',
        ],
      }
      const res = await api.schools.onboarding(payload)
      const data = (res as any)?.data || res
      const newSchoolId = data?.id
      const newSchoolSlug = data?.slug || cleanSlug

      if (newSchoolId) {
        api.setActiveSchoolId(newSchoolId)
        api.setActiveSchoolSlug(newSchoolSlug)

        const estNum = parseInt(establishedYear, 10) || 1995
        await Promise.allSettled([
          ...(uploadedLogoUrl
            ? [api.schools.update(newSchoolId, { logoUrl: uploadedLogoUrl })]
            : []),
          api.content.update(
            {
              schoolName: schoolName.trim(),
              schoolType,
              logoUrl: uploadedLogoUrl || undefined,
              address: schoolAddress.trim(),
              phone: contactPhone.trim(),
              email: contactEmail.trim().toLowerCase(),
              established: estNum,
              establishedYear: estNum,
              shortBio: description.trim(),
              principalName: principalName.trim() || 'Principal',
              principalTitle: principalDesignation.trim() || 'Principal',
              academics: {
                curriculum: academicOverview.trim(),
              },
            },
            newSchoolId,
          ),
          api.theme
            .saveDraft(
              {
                activeTheme: themePreset,
                selectedTemplate: selectedTpl.name || 'Aster Academy',
                primaryColor,
                secondaryColor: accentColor,
                accentColor,
              },
              newSchoolId,
            )
            .then(() => api.theme.publish(newSchoolId)),
        ])

        await refreshSchools(newSchoolId)
      }
      setCreatedSchool({ id: newSchoolId, name: schoolName, slug: newSchoolSlug })
      setIsSuccess(true)
      notify(`Congratulations! School "${schoolName}" has been created and published!`)
    } catch (err: any) {
      const msg = err?.message || ''
      const valErrors: Array<{ field?: string; errors?: string[] }> = Array.isArray(err?.validationErrors)
        ? err.validationErrors
        : []

      if (msg.includes('already exists') || err?.status === 409) {
        setStep(2)
        setFieldErrors((prev) => ({
          ...prev,
          slug: `The website address "${slug}" is already taken. Please choose another slug.`,
        }))
        setErrorMessage(`⚠️ Step 2 (Identity) → The website address "${slug}" is already taken. Please choose a different slug.`)
      } else if (valErrors.length > 0) {
        const mappedFieldErrors: Record<string, string> = {}
        const humanDetails: string[] = []
        let targetStep = step

        for (const ve of valErrors) {
          const f = ve.field || ''
          const reason = Array.isArray(ve.errors) && ve.errors.length > 0 ? ve.errors[0] : 'Invalid value'
          if (f === 'name') {
            mappedFieldErrors.schoolName = reason
            humanDetails.push(`Step 1 (School Name): ${reason}`)
            targetStep = 1
          } else if (f === 'contactEmail') {
            mappedFieldErrors.contactEmail = 'Please enter a valid email address (e.g. info@school.edu.bd).'
            humanDetails.push(`Step 1 (Public Email "${contactEmail}"): ${reason}`)
            targetStep = 1
          } else if (f === 'contactPhone') {
            mappedFieldErrors.contactPhone = reason
            humanDetails.push(`Step 1 (Contact Number): ${reason}`)
            targetStep = 1
          } else if (f === 'slug') {
            mappedFieldErrors.slug = reason
            humanDetails.push(`Step 2 (Website Address / Slug): ${reason}`)
            if (targetStep !== 1) targetStep = 2
          } else {
            humanDetails.push(`${f || 'Field'}: ${reason}`)
          }
        }

        setFieldErrors((prev) => ({ ...prev, ...mappedFieldErrors }))
        setStep(targetStep)
        setErrorMessage(`⚠️ Validation Error — ${humanDetails.join(' | ')}`)
      } else {
        setErrorMessage(`⚠️ Registration failed: ${msg || 'Please check your connection and try again.'}`)
      }
    } finally {
      setIsPublishing(false)
    }
  }

  return {
    step,
    setStep,
    isPublishing,
    errorMessage,
    setErrorMessage,
    fieldErrors,
    setFieldErrors,
    isSuccess,
    createdSchool,
    schoolName,
    schoolType,
    setSchoolType,
    schoolAddress,
    setSchoolAddress,
    contactPhone,
    setContactPhone,
    contactEmail,
    setContactEmail,
    establishedYear,
    setEstablishedYear,
    logoPreview,
    handleLogoUpload,
    slug,
    setSlug,
    description,
    setDescription,
    primaryColor,
    setPrimaryColor,
    accentColor,
    setAccentColor,
    selectedTemplateIndex,
    setSelectedTemplateIndex,
    principalName,
    setPrincipalName,
    principalDesignation,
    setPrincipalDesignation,
    academicOverview,
    setAcademicOverview,
    handleExit,
    handleSchoolNameChange,
    validateStep,
    handlePublish,
  }
}
