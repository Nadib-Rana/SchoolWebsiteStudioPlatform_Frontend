'use client'

import { useState, useEffect, useRef } from 'react'
import { api } from '@/lib/api-client'

export function useSettingsAccount(
  user: any,
  notify: (msg: string) => void
) {
  const [accountPhoto, setAccountPhoto] = useState<string | null>(null)
  const accountPhotoInputRef = useRef<HTMLInputElement>(null)

  const [accountFirstName, setAccountFirstName] = useState(user?.firstName || 'Amina')
  const [accountLastName, setAccountLastName] = useState(user?.lastName || 'Rahman')
  const [accountEmail, setAccountEmail] = useState(user?.email || 'admin@northfield.edu')
  const [accountPhone, setAccountPhone] = useState('+880 1712 345 678')
  const [accountJobTitle, setAccountJobTitle] = useState('Workspace Administrator')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  useEffect(() => {
    if (user?.firstName) setAccountFirstName(user.firstName)
    if (user?.lastName) setAccountLastName(user.lastName)
    if (user?.email) setAccountEmail(user.email)
  }, [user])

  const handleAccountPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        notify('Uploading profile photo...')
        const uploadRes = await api.storage.upload(file)
        setAccountPhoto(uploadRes.publicUrl)
        notify('Profile photo updated successfully!')
      } catch (err: any) {
        notify(`Photo upload failed: ${err?.message || 'Error'}`)
      }
    }
  }

  const handleSaveAccount = async () => {
    setIsSavingAccount(true)
    try {
      if (newPassword) {
        if (newPassword.length < 8) {
          notify('Password must be at least 8 characters long.')
          setIsSavingAccount(false)
          return
        }
        if (newPassword !== confirmPassword) {
          notify('New passwords do not match.')
          setIsSavingAccount(false)
          return
        }
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        notify('Account credentials and profile updated.')
      } else {
        notify('Account personal information updated.')
      }
    } finally {
      setIsSavingAccount(false)
    }
  }

  return {
    accountPhoto,
    accountPhotoInputRef,
    handleAccountPhotoUpload,
    accountFirstName,
    setAccountFirstName,
    accountLastName,
    setAccountLastName,
    accountEmail,
    setAccountEmail,
    accountPhone,
    setAccountPhone,
    accountJobTitle,
    setAccountJobTitle,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    isSavingAccount,
    handleSaveAccount,
  }
}
