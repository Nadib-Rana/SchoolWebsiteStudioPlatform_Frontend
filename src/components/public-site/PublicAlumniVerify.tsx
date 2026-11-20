'use client'

import { useState } from 'react'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'

interface PublicAlumniVerifyProps {
  schoolSlug: string
  schoolName: string
}

export function PublicAlumniVerify({ schoolSlug, schoolName }: PublicAlumniVerifyProps) {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('Please enter an Admission Number or Alumni Code.')
      return
    }
    setIsLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await api.admissions.verifyAlumni(schoolSlug, code.trim())
      setResult(res?.data ?? res)
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to verify alumni record. Please check the code and try again.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isVerified = Boolean(
    result && (result.verified === true || result.valid === true || result.alumni || result.studentName || result.name),
  )

  const alumniInfo = result?.alumni || result?.student || result

  return (
    <div className="w-full max-w-2xl mx-auto my-10 bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-10">
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
          Official Alumni Registry
        </span>
        <h2 className="text-2xl font-bold text-slate-900 mt-1">
          Verify {schoolName} Alumni
        </h2>
        <p className="text-slate-600 text-sm mt-1">
          Enter the official admission number or alumni code to verify graduation and academic records in real time.
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Admission Number / Alumni Code *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. ADM-2020-0142"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono uppercase"
          />
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
            <Icon name="close" size={15} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying Record...
            </>
          ) : (
            <>
              Verify Alumni <Icon name="search" size={15} />
            </>
          )}
        </button>
      </form>

      {result && (
        <div
          className={`mt-8 p-6 rounded-2xl border ${
            isVerified
              ? 'bg-emerald-50/70 border-emerald-200'
              : 'bg-amber-50/70 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-slate-500">
                Verification Result
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-0.5">
                {alumniInfo?.name ||
                  alumniInfo?.studentName ||
                  [alumniInfo?.firstName, alumniInfo?.lastName].filter(Boolean).join(' ') ||
                  code.toUpperCase()}
              </h4>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                isVerified
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border-amber-300'
              }`}
            >
              <Icon name={isVerified ? 'check' : 'close'} size={12} />
              {isVerified ? 'Verified Alumni' : 'Not Verified'}
            </span>
          </div>

          <div className="pt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Institution:</span>
              <span className="font-semibold text-slate-900">{result.schoolName || schoolName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Admission / Code:</span>
              <span className="font-mono font-semibold text-slate-900">{result.code || code}</span>
            </div>
            {alumniInfo?.graduationYear && (
              <div className="flex justify-between">
                <span className="text-slate-500">Graduation Year:</span>
                <span className="font-semibold text-slate-900">{alumniInfo.graduationYear}</span>
              </div>
            )}
            {alumniInfo?.batch && (
              <div className="flex justify-between">
                <span className="text-slate-500">Batch:</span>
                <span className="font-semibold text-slate-900">{alumniInfo.batch}</span>
              </div>
            )}
            {alumniInfo?.className && (
              <div className="flex justify-between">
                <span className="text-slate-500">Last Class:</span>
                <span className="font-semibold text-slate-900">{alumniInfo.className}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

