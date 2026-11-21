"use client"

import { useState } from "react"
import type { Course } from "@/app/types/course"
import Button from "@/app/components/atoms/Button"
import CourseTable from "@/app/components/organisms/CourseTable"
import CourseFormModal from "@/app/components/molecules/CourseFormModal"

interface ClientCourseAdminProps {
  courses: Course[]
}

type ModalMode = "create" | "edit" | null

export default function ClientCourseAdmin({ courses: initialCourses }: ClientCourseAdminProps) {
  const [courses, setCourses] = useState<Course[]>(initialCourses)
  const [modalMode, setModalMode] = useState<ModalMode>(null)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleAction(action: { type: string; course: Course }) {
    if (action.type === "edit") {
      setEditingCourse(action.course)
      setModalMode("edit")
    }
  }

  async function handleFormSubmit(data: {
    title: string
    description: string | null
    thumbnail: string | null
    sortOrder: number
    isPublished: boolean
  }) {
    setIsSubmitting(true)
    try {
      if (modalMode === "edit" && editingCourse) {
        const res = await fetch(`/api/admin/courses/${editingCourse.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to update course")
        const json = await res.json()
        setCourses((prev) => prev.map((c) => (c.id === editingCourse.id ? json.data : c)))
      } else {
        const res = await fetch("/api/admin/courses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error("Failed to create course")
        const json = await res.json()
        setCourses((prev) => [...prev, json.data])
      }
      closeModal()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  function closeModal() {
    setModalMode(null)
    setEditingCourse(null)
  }

  return (
    <>
      <div className="mb-4">
        <Button variant="primary" size="md" onClick={() => { setModalMode("create"); setEditingCourse(null) }}>
          Create Course
        </Button>
      </div>

      <CourseTable
        courses={courses}
        isLoading={false}
        onCreateNew={() => { setModalMode("create"); setEditingCourse(null) }}
        onAction={handleAction}
      />

      <CourseFormModal
        isOpen={modalMode !== null}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        initialData={modalMode === "edit" ? editingCourse : null}
      />
    </>
  )
}
