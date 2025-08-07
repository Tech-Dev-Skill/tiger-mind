'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Category {
  id: string
  name: string
  slug: string
}

interface CourseFormProps {
  categories: Category[]
}

export default function CourseForm({ categories }: CourseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    long_description: '',
    price: '',
    category_id: '',
    thumbnail_url: '',
    video_url: '',
    is_published: false,
    duration_hours: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          duration_hours: formData.duration_hours ? parseInt(formData.duration_hours) : null,
          is_published: formData.is_published
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear el curso')
      }

      router.push('/admin/courses')
    } catch (error: any) {
      setError(error.message || 'Error al crear el curso')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Información Básica</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300">
              Título del Curso *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: Curso Completo de Desarrollo Web"
            />
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-300">
              URL Amigable *
            </label>
            <input
              type="text"
              name="slug"
              id="slug"
              required
              value={formData.slug}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Ej: curso-desarrollo-web"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">
              Descripción *
            </label>
            <textarea
              name="description"
              id="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Describe brevemente el curso y sus beneficios"
            />
          </div>

          <div>
            <label htmlFor="long_description" className="block text-sm font-medium text-gray-300">
              Descripción Detallada
            </label>
            <textarea
              name="long_description"
              id="long_description"
              rows={6}
              value={formData.long_description}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="Descripción completa del curso, incluyendo temas cubiertos y resultados esperados"
            />
          </div>
        </div>
      </div>

      {/* Pricing and Category */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Precio y Categoría</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-300">
              Precio (USD) *
            </label>
            <input
              type="number"
              name="price"
              id="price"
              min="0"
              step="0.01"
              required
              value={formData.price}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="99.99"
            />
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-300">
              Categoría *
            </label>
            <select
              name="category_id"
              id="category_id"
              required
              value={formData.category_id}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Media */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Imágenes y Videos</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="thumbnail_url" className="block text-sm font-medium text-gray-300">
              URL de Miniatura
            </label>
            <input
              type="url"
              name="thumbnail_url"
              id="thumbnail_url"
              value={formData.thumbnail_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          <div>
            <label htmlFor="video_url" className="block text-sm font-medium text-gray-300">
              URL del Video Promocional
            </label>
            <input
              type="url"
              name="video_url"
              id="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-bold text-white mb-4">Configuración</h2>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="is_published"
              id="is_published"
              checked={formData.is_published}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 bg-gray-700 border-gray-600 rounded focus:ring-orange-500"
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-300">
              Publicar inmediatamente
            </label>
          </div>

          <div>
            <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-300">
              Duración Estimada (horas)
            </label>
            <input
              type="number"
              name="duration_hours"
              id="duration_hours"
              min="0"
              value={formData.duration_hours}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
              placeholder="2"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end space-x-4">
        <Link
          href="/admin/courses"
          className="px-4 py-2 border border-gray-600 rounded-md text-gray-300 hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creando...' : 'Crear Curso'}
        </button>
      </div>
    </form>
  )
}