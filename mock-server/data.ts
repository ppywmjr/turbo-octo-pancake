/**
 * Seed data for the local subscription-management mock server.
 *
 * Shapes mirror the real upstream service responses consumed by this app:
 *  - Plan   -> app/types/plan.ts
 *  - Course -> app/types/course.ts
 *  - Video  -> app/types/video.ts
 *
 * The mock server deep-clones this on startup and mutates it in memory, so a
 * fresh `pnpm mock` always starts from this baseline.
 */

export interface Plan {
  id: string
  name: string
  description: string | null
  isFree: boolean
  billingInterval: 'daily' | 'weekly' | 'monthly' | 'yearly' | null
  pricePence: number | null
  isActive: boolean
  thumbnail: string | null
}

export interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  sortOrder: number
}

export interface Video {
  id: string
  title: string
  url: string
  thumbnail: string
  watched: boolean
  progressSecs: number
}

/**
 * Plans. The home page features the plan named exactly
 * "Flutters Online Training Programme" when present, so we keep that name.
 */
export const plans: Plan[] = [
  {
    id: 'plan-flutter',
    name: 'Flutters Online Training Programme',
    description: 'Master Flutter development from scratch with hands-on projects.',
    isFree: false,
    billingInterval: 'monthly',
    pricePence: 1999,
    isActive: true,
    thumbnail: null,
  },
  {
    id: 'plan-free',
    name: 'Free Starter Plan',
    description: 'A free plan to explore the platform.',
    isFree: true,
    billingInterval: null,
    pricePence: null,
    isActive: true,
    thumbnail: null,
  },
]

/**
 * Courses. A course id that matches a plan id is treated as "subscribed" by the
 * home page (it compares course ids against plan ids), so `plan-flutter` doubles
 * as the subscribed course for that plan.
 */
export const courses: Course[] = [
  {
    id: 'plan-flutter',
    title: 'Flutters Online Training Programme',
    description: 'Master Flutter development from scratch with hands-on projects.',
    thumbnail: null,
    sortOrder: 0,
  },
]

/**
 * Videos grouped by course id. A mix of watched / in-progress / untouched so the
 * status badges render meaningfully.
 */
export const videosByCourse: Record<string, Video[]> = {
  'plan-flutter': [
    {
      id: 'vid-1',
      title: 'Flutter Basics — Getting Started',
      url: 'https://www.youtube.com/watch?v=bjgqwBQ8-7g',
      thumbnail: 'https://i.ytimg.com/vi/bjgqwBQ8-7g/hqdefault.jpg',
      watched: true,
      progressSecs: 0,
    },
    {
      id: 'vid-2',
      title: 'Flutter Basics — Widgets & Layouts',
      url: 'https://www.youtube.com/watch?v=DN22xptfnes',
      thumbnail: 'https://i.ytimg.com/vi/DN22xptfnes/hqdefault.jpg',
      watched: false,
      progressSecs: 81,
    },
    {
      id: 'vid-3',
      title: 'Flutter Basics — State Management',
      url: 'https://www.youtube.com/watch?v=BMkwmQmUa_g',
      thumbnail: 'https://i.ytimg.com/vi/BMkwmQmUa_g/hqdefault.jpg',
      watched: false,
      progressSecs: 0,
    },
  ],
}