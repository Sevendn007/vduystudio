'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Trash2 } from 'lucide-react'

type Pricing = {
  id: string
  title: string
  price: string
  description: string
  features: string[]
}

export default function PricingPage() {
  const [pricings, setPricings] = useState<Pricing[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [features, setFeatures] = useState('') // comma separated for now

  useEffect(() => {
    fetchPricings()
  }, [])

  const fetchPricings = async () => {
    const { data } = await supabase.from('pricing').select('*').order('created_at', { ascending: false })
    if (data) setPricings(data)
    setLoading(false)
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    const featureArray = features.split(',').map(f => f.trim()).filter(f => f !== '')
    
    const { data, error } = await supabase.from('pricing').insert([
      { title, price, description, features: featureArray }
    ]).select()
    
    if (data) {
      setPricings([data[0], ...pricings])
      setTitle('')
      setPrice('')
      setDescription('')
      setFeatures('')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa?')) return
    await supabase.from('pricing').delete().eq('id', id)
    setPricings(pricings.filter(p => p.id !== id))
  }

  if (loading) return <div>Đang tải...</div>

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Bảng giá (Pricing)</h2>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4">Thêm gói mới</h3>
        <form onSubmit={handleAdd} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên gói</label>
            <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mức giá</label>
            <input required type="text" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mô tả ngắn</label>
            <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tính năng (cách nhau bởi dấu phẩy)</label>
            <textarea value={features} onChange={e => setFeatures(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" rows={2} placeholder="Tích xanh, Bảo hành 1 tháng, Hỗ trợ 24/7"></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Thêm mới</button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên gói</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pricings.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{p.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">
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
