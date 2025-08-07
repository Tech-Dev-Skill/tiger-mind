'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Module {
  id: string
  title: string
  order_index: number
}

interface Props {
  courseId: string
  modules: Module[]
}

export default function VideoUploadForm({ courseId, modules }: Props) {
  const router = useRouter()
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsUploading(true)
    setError('')
    setUploadProgress(0)

    const formData = new FormData(e.currentTarget)
    formData.append('courseId', courseId)

    try {
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100
          setUploadProgress(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText)
          if (response.success) {
            router.push(`/admin/courses/${courseId}/videos`)
          } else {
            setError(response.error || 'Error al subir el video')
            setIsUploading(false)
          }
        } else {
          setError('Error al subir el video')
          setIsUploading(false)
        }
      })

      xhr.addEventListener('error', () => {
        console.error('Upload error:', xhr.status, xhr.statusText)
        setError('Error de conexión')
        setIsUploading(false)
      })

      xhr.open('POST', '/api/upload/video')
      xhr.withCredentials = true
      xhr.send(formData)

    } catch (err) {
      setError('Error al procesar la solicitud')
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-md p-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300">
          Título del video
        </label>
        <input
          type="text"
          name="title"
          id="title"
          required
          disabled={isUploading}
          className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
          placeholder="Ej: Introducción al curso"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
          Descripción
        </label>
        <textarea
          name="description"
          id="description"
          rows={3}
          disabled={isUploading}
          className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
          placeholder="Breve descripción del contenido del video"
        />
      </div>

      <div>
        <label htmlFor="moduleId" className="block text-sm font-medium text-gray-300">
          Módulo
        </label>
        <select
          name="moduleId"
          id="moduleId"
          required
          disabled={isUploading}
          className="mt-1 block w-full border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
        >
          <option value="" className="bg-gray-700 text-gray-300">Selecciona un módulo</option>
          {modules?.map((module) => (
            <option key={module.id} value={module.id} className="bg-gray-700 text-white">
              {module.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="orderIndex" className="block text-sm font-medium text-gray-300">
          Orden
        </label>
        <input
          type="number"
          name="orderIndex"
          id="orderIndex"
          min="1"
          defaultValue="1"
          required
          disabled={isUploading}
          className="mt-1 block w-32 border border-gray-600 bg-gray-700 text-white rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-800 disabled:text-gray-400"
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          name="isFreePreview"
          id="isFreePreview"
          disabled={isUploading}
          className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-600 rounded"
        />
        <label htmlFor="isFreePreview" className="ml-2 block text-sm text-gray-300">
          Permitir vista previa gratuita
        </label>
      </div>

      <div>
        <label htmlFor="video" className="block text-sm font-medium text-gray-300">
          Archivo de video
        </label>
        <input
          type="file"
          name="video"
          id="video"
          accept="video/*"
          required
          disabled={isUploading}
          className="mt-1 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-orange-400 hover:file:bg-gray-600 disabled:opacity-50"
        />
        <p className="mt-2 text-sm text-gray-400">
          Formatos permitidos: MP4, MKV, AVI, WebM, MOV. Tamaño máximo: 100MB
        </p>
      </div>

      {isUploading && (
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div 
            className="bg-orange-500 h-2.5 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          ></div>
          <p className="text-sm text-gray-300 mt-2 text-center">
            Subiendo... {Math.round(uploadProgress)}%
          </p>
        </div>
      )}

      <div className="flex items-center justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          disabled={isUploading}
          className="inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 transition-colors"
        >
          Subir Video
        </button>
      </div>
    </form>
  )
}