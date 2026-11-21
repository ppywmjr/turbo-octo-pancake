'use client'

import { useState, useEffect, useRef } from 'react'
import type { Course } from '@/app/types/course'
import Button from '@/app/components/atoms/Button'

interface CourseFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    title: string
    description: string | null
    thumbnail: string | null
    sortOrder: number
    isPublished: boolean
  }) => Promise<void>
  initialData?: Course | null
}

function isValidUrl(value: string): boolean {
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

function CourseFormModalContent({ isOpen, onClose, onSubmit, initialData }: CourseFormModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [sortOrder, setSortOrder] = useState(0)
  const [isPublished, setIsPublished] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const titleRef = useRef<HTMLInputElement>(null)
  const modalTitleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title)
        setDescription(initialData.description ?? '')
        setThumbnail(initialData.thumbnail ?? '')
        setSortOrder(initialData.sortOrder)
        setIsPublished(initialData.isPublished ?? false)
      } else {
        setTitle('')
        setDescription('')
        setThumbnail('')
        setSortOrder(0)
        setIsPublished(false)
      }
      setValidationError(null)
      setIsSubmitting(false)
    }
  }, [isOpen, initialData])

  useEffect(() => {
    if (isOpen && titleRef.current) {
      titleRef.current.focus()
    }
  }, [isOpen])

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  function validate(): boolean {
    const trimmed = title.trim()
    if (!trimmed) {
      setValidationError('Title is required')
      return false
    }
    if (trimmed.length > 200) {
      setValidationError('Title must be 200 characters or less')
      return false
    }
    if (thumbnail && !isValidUrl(thumbnail)) {
      setValidationError('Thumbnail must be a valid URL')
      return false
    }
    if (sortOrder < 0) {
      setValidationError('Sort order must be a non-negative integer')
      return false
    }
    setValidationError(null)
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setValidationError(null)
    setIsSubmitting(true)

    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        thumbnail: thumbnail.trim() || null,
        sortOrder,
        isPublished,
      })
    } catch {
      setValidationError('Failed to save course. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const isEditing = !!initialData

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="course-form-modal-title" onClick={handleOverlayClick}>
      <div className="absolute inset-0 bg-[var(--color-overlay-gradient)]" />
      <div className="relative z-10 w-full max-w-lg rounded-xl bg-[var(--color-white)] p-6 shadow-xl">
        <h2 id="course-form-modal-title" ref={modalTitleRef} className="text-lg font-semibold text-[var(--color-text-primary)]">
          {isEditing ? 'Edit Course' : 'Create Course'}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div>
            <label htmlFor="course-title" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
              Title <span className="text-[var(--color-error-text-light)]">*</span>
            </label>
            <input ref={titleRef} id="course-title" type="text" value={title}
              onChange={(e) => { setTitle(e.target.value); if (validationError) setValidationError(null) }}
              placeholder="e.g. Introduction to Dance" disabled={isSubmitting}
              className={`-w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                validationError && !validationError.includes('Thumbnail') && !validationError.includes('Sort order')
                  ? 'border-[var(--color-error-border-light)] focus:ring-[var(--color-error-focus)]'
                  : 'border-gray-300 focus:ring-[var(--color-brand)]' }}` } />
          </div>

          <div>
            <label htmlFor="course-description" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Description</label>
            <textarea id="course-description" value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the course" rows={3} disabled={isSubmitting}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none" />
          </div>

          <div>
            <label htmlFor="course-thumbnail" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Thumbnail URL</label>
            <input id="course-thumbnail" type="text" value={thumbnail}
              onChange={(e) => { setThumbnail(e.target.value); if (validationError && validationError.includes('Thumbnail')) setValidationError(null) }}
              placeholder="https://example.com/image.jpg" disabled={isSubmitting}
              className={`-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                validationError && validationError.includes('Thumbnail')
                  ? 'border-[var(--color-error-border-light)] focus:ring-[var(--color-error-focus)]'
                  : 'border-gray-300 focus:ring-[var(--color-brand)]' }}` } />
          </div>

          <div>
            <label htmlFor="course-sort-order" className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">Sort Order</label>
            <input id="course-sort-order" type="number" value={sortOrder}
              onChange={(e) => setSortOrder(Math.max(0, parseInt(e.target.value) || 0))} min={0} disabled={isSubmitting}
              className={`-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 ${
                validationError && validationError.includes('Sort order')
                  ? 'border-[var(--color-error-border-light)] focus:ring-[var(--color-error-focus)]'
                  : 'border-gray-300 focus:ring-[var(--color-brand)]' }}` } />
          </div>

          <div className="flex items-center gap-2">
            <input id="course-is-published" type="checkbox" checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)} disabled={isSubmitting}
              className="h-4 w-4 rounded border-gray-300 text-[var(--color-brand)] focus:ring-[var(--color-brand)]" />
            <label htmlFor="course-is-published" className="text-sm text-[var(--color-text-primary)]">Published</label>
          </div>

          {validationError && <p className="text-sm text-[var(--color-error-text-light)]">{validationError}</p>}

          <div className="mt-2 flex items-center justify-end gap-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting || !title.trim()}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Course'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function CourseFormModal(props: CourseFormModalProps) {
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!props.isOpen) setKey(k => k + 1)
  }, [props.isOpen])

  return <CourseFormModalContent key={key} {...props} />
}
