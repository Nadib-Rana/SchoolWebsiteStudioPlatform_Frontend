'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/common/Button'
import { Icon } from '@/components/common/Icon'
import { api } from '@/lib/api-client'

interface RolePermissionModalProps {
  onClose: () => void
}

const DEFAULT_CAPABILITIES = [
  { cap: 'Page & Visual Builder', cat: 'Design', roles: [true, true, true, true, false] },
  { cap: 'Publish Releases & Rollbacks', cat: 'Releases', roles: [true, true, false, false, false] },
  { cap: 'Theme Customization', cat: 'Design', roles: [true, true, true, false, false] },
  { cap: 'Notices, Events & Gallery', cat: 'Content', roles: [true, true, true, true, false] },
  { cap: 'Admissions CRM & Inquiries', cat: 'Operations', roles: [true, true, true, true, false] },
  { cap: 'Custom Domains & DNS Engine', cat: 'DevOps', roles: [true, true, false, false, false] },
  { cap: 'Invite Staff & Manage Roles', cat: 'Admin', roles: [true, true, false, false, false] },
  { cap: 'View Analytics & Audit Logs', cat: 'Reports', roles: [true, true, true, true, true] },
]

export function RolePermissionModal({ onClose }: RolePermissionModalProps) {
  const [capabilities, setCapabilities] = useState(DEFAULT_CAPABILITIES)

  useEffect(() => {
    let mounted = true
    const loadMatrix = async () => {
      try {
        const res = await api.schools.getPermissionMatrix()
        const data = (res as any)?.data || res
        if (mounted && Array.isArray(data?.capabilities)) {
          setCapabilities(
            data.capabilities.map((c: any) => ({
              cap: c.capability,
              cat: c.category,
              roles: [
                Boolean(c.roles?.OWNER),
                Boolean(c.roles?.ADMIN),
                Boolean(c.roles?.EDITOR),
                Boolean(c.roles?.CONTENT_MANAGER),
                Boolean(c.roles?.ANALYST),
              ],
            }))
          )
        }
      } catch {
        // Fallback default
      }
    }
    void loadMatrix()
    return () => { mounted = false }
  }, [])

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm grid place-items-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <h3 className="text-base font-bold text-slate-900">Fine-Grained Role Permissions Matrix</h3>
            <p className="text-xs text-slate-500">Access control and capabilities by workspace role</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <Icon name="close" size={16} />
          </button>
        </div>

        <div className="p-6 overflow-x-auto text-xs">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-600">
                <th className="py-2.5 px-3">Capability</th>
                <th className="py-2.5 px-2 text-center text-purple-700">Owner</th>
                <th className="py-2.5 px-2 text-center text-blue-700">Admin</th>
                <th className="py-2.5 px-2 text-center text-emerald-700">Editor</th>
                <th className="py-2.5 px-2 text-center text-amber-700">Content</th>
                <th className="py-2.5 px-2 text-center text-slate-700">Analyst</th>
              </tr>
            </thead>
            <tbody>
              {capabilities.map((row, idx) => (
                <tr
                  key={row.cap}
                  className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}`}
                >
                  <td className="py-2.5 px-3">
                    <strong className="block text-slate-800 text-xs font-semibold">{row.cap}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">{row.cat}</span>
                  </td>
                  {row.roles.map((hasAccess, rIdx) => (
                    <td key={rIdx} className="py-2.5 px-2 text-center font-bold">
                      {hasAccess ? (
                        <span className="inline-flex w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 items-center justify-center text-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="text-slate-300 font-normal">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-5 flex justify-end pt-3 border-t border-slate-100">
            <Button kind="secondary" onClick={onClose}>
              Close Matrix
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
