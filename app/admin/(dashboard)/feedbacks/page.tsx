'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Trash2 } from 'lucide-react'

type Feedback = {
  id: string
  name: string
  company?: string
  quote: string
  rating: number
}

export default function FeedbacksPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Form state
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [quote, setQuote] = useState('')

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    const { data } = await supabase.from('feedbacks').select('*').order('created_at', { ascending: false })
    if (data) setFeedbacks(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from('feedbacks').insert([
      { name, avatar: company, description: quote } // mapping company to avatar field and quote to description temporarily based on schema
    ]).select()
    
    if (data) {
      setFeedbacks([data[0], ...feedbacks])
      setName('')
      setCompany('')
      setQuote('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return
    await supabase.from('feedbacks').delete().eq('id', id)
    setFeedbacks(feedbacks.filter(f => f.id !== id))
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá khách hàng (Feedbacks)</h2>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Thêm đánh giá mới</h3>
        <form onSubmit={handleAdd} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên khách hàng</label>
            <input required type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Chức vụ / Công ty</label>
            <input type="text" value={company} onChange={e => setCompany(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nội dung đánh giá</label>
            <textarea required value={quote} onChange={e => setQuote(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" rows={3}></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Thêm mới</button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Công ty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {feedbacks.map(f => (
              <tr key={f.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{f.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{f.company || (f as any).avatar}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{f.quote || (f as any).description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
