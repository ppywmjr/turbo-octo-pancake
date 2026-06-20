# Data Model & Type System

This document provides a detailed overview of the core data models and type definitions used throughout the application. These types ensure type safety and consistency across the frontend, backend (BFF), and external service interactions.

## Core Entities

The application's data model is centered around three primary entities: `Plan`, `Course`, and `Video`.

### 1. Plan
A `Plan` represents a subscription tier offered by the service. It defines access levels and pricing.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | A unique identifier for the plan. |
| `name` | `string` | The display name of the subscription plan. |
| `description` | `string` | A brief description of what the plan includes. |
| `isFree` | `boolean` | Indicates if the plan is a free tier. |
| `billingInterval` | `'monthly' \| 'yearly'` | The billing cycle of the plan. |
| `pricePence` | `number` | The price of the plan in pence (to avoid floating-point issues). |
| `isActive` | `boolean` | Indicates if the plan is currently available for subscription. |

**Example Usage:**
```typescript
import type { Plan } from '@/app/types/plan'

const myPlan: Plan = {
  id: 'plan-123',
  name: 'Premium Access',
  description: 'Full access to all courses.',
  isFree: false,
  billingInterval: 'monthly',
  pricePence: 1999,
  isActive: true,
}
```

### 2. Course
A `Course` is a collection of educational content (videos) organized under a specific topic.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | A unique identifier for the course. |
| `title` | `string` | The title of the course. |
| `description` | `string` | A detailed description of the course content. |
| `thumbnail` | `string \| null` | A URL to the course's thumbnail image. |
| `videos` | `Video[]` | An array of videos included in the course. |

**Example Usage:**
```typescript
import type { Course } from '@/app/types/course'

const myCourse: Course = {
  id: 'course-abc',
  title: 'Mastering TypeScript',
  description: 'A deep dive into advanced TS features.',
  thumbnail: 'https://example.com/thumb.jpg',
  videos: [] // Populated with Video objects
}
```

### 3. Video
A `Video` represents an individual piece of content within a course.

| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | A unique identifier for the video. |
| `title` | `string` | The title of the video. |
| `description` | `string` | A brief description of the video content. |
| `youtubeId` | `string` | The unique ID for the YouTube video. |
| `durationSeconds` | `number` | The length of the video in seconds. |

**Example Usage:**
```typescript
import type { Video } from '@/app/types/video'

const myVideo: Video = {
  id: 'vid-001',
  title: 'Introduction to Types',
  description: 'Learn the basics of TypeScript types.',
  youtubeId: 'dQw4w9WgXcQ',
  durationSeconds: 300,
}
```

---

## Type Relationships & Hierarchy

The data model is hierarchical: **Plan $\rightarrow$ Course $\rightarrow$ Video**.

*   **Subscription Access**: A user's subscription to a `Plan` typically grants them access to one or more `Courses`.
*   **Content Consumption**: A user accesses content through the `Course` structure, which contains multiple `Videos`.

### Type Safety Best Practices
*   **Always use explicit types**: Avoid using `any` at all costs. Use the defined types in `app/types/` for all function parameters, return values, and component props.
*   **Interface vs Type**: While both are used, prefer `type` for defining data structures and `interface` when you need to extend them.
*   **Centralized Definitions**: Keep all core entity types in their respective files within `app/types/` to maintain a single source of truth.
