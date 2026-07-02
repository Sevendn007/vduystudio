'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'

export default function SettingsPage() {
  const [tele, setTele] = useState('')
  const [zalo, setZalo] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    const { data, error } = await supabase.from('settings').select('*')
    if (data) {
      const teleSetting = data.find((s) => s.key === 'contact_tele')
      const zaloSetting = data.find((s) => s.key === 'contact_zalo')
      if (teleSetting) setTele(teleSetting.value)
      if (zaloSetting) setZalo(zaloSetting.value)
    }
    setLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    // Upsert tele
    await supabase.from('settings').upsert({ key: 'contact_tele', value: tele }, { onConflict: 'key' })
    // Upsert zalo
    await supabase.from('settings').upsert({ key: 'contact_zalo', value: zalo }, { onConflict: 'key' })

    setSaving(false)
    setMessage('Đã lưu cấu hình thành công!')
    setTimeout(() => setMessage(''), 3000)
  }

  if (loading) return <div>Đang tải dữ liệu...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cấu hình liên hệ</h2>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Link Telegram</label>
            <input
              type="text"
              value={tele}
              onChange={(e) => setTele(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="https://t.me/yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link Zalo</label>
            <input
              type="text"
              value={zalo}
              onChange={(e) => setZalo(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              placeholder="https://zalo.me/yourphone"
            />
          </div>

          {message && <div className="text-green-600 text-sm">{message}</div>}

          <div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
