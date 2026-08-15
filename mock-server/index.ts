/**
 * Local mock server for the external "subscription-management" service.
 *
 * Run it alongside the app so you can develop without that backend:
 *   pnpm mock        # starts this server on http://localhost:3011
 *   pnpm dev         # starts the Next.js app on http://localhost:3010
 *
 * It implements every upstream endpoint the app calls (see docs/api-reference.md
 * and app/lib/*), backed by in-memory state seeded from ./data.ts. State is
 * mutated as you use the app (progress updates, activations), and resets on a
 * fresh `pnpm mock`.
 *
 * This is intentionally dependency-free (node:http only) and accepts any request
 * without validating the Clerk Bearer token / internal API key — it's a local
 * dev stub, not a security boundary.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http'
import {
  plans as seedPlans,
  videosByCourse as seedVideos,
  type Course,
  type Plan,
} from './data.ts'

const PORT = Number(process.env.MOCK_PORT ?? 3011)
/** Plan that any activation code subscribes to (local-dev simplification). */
const ACTIVATION_PLAN_ID = 'plan-flutter'

// ── In-memory state (deep-cloned from seed so restarts reset it) ─────────────
const state: {
  plans: Plan[]
  courses: Course[]
  videosByCourse: Record<string, { id: string; title: string; url: string; thumbnail: string; watched: boolean; progressSecs: number }[]>
} = {
  plans: structuredClone(seedPlans),
  courses: [], // starts empty; populated by POST /me/subscriptions
  videosByCourse: structuredClone(seedVideos),
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

function readBody(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    let data = ''
    req.on('data', (chunk: string) => {
      data += chunk
    })
    req.on('end', () => {
      if (!data) return resolve({})
      try {
        resolve(JSON.parse(data))
      } catch {
        resolve({})
      }
    })
  })
}

// ── Handlers ──────────────────────────────────────────────────────────────────
function handlePlans(res: ServerResponse) {
  sendJson(res, 200, { success: true, data: state.plans })
}

function handleMyCourses(url: URL, res: ServerResponse) {
  const limit = Number(url.searchParams.get('limit') ?? 20) || 20
  const offset = Number(url.searchParams.get('offset') ?? 0) || 0
  const total = state.courses.length
  const page = state.courses.slice(offset, offset + limit)
  sendJson(res, 200, {
    success: true,
    data: page,
    pagination: { total, limit, offset, hasMore: offset + limit < total },
  })
}

async function handleSubscriptions(req: IncomingMessage, res: ServerResponse) {
  const body = await readBody(req)
  const code = typeof body.activationCode === 'string' ? body.activationCode : ''
  if (!code) {
    return sendJson(res, 400, { success: false, error: 'Invalid code' })
  }

  const targetPlan = state.plans.find((p) => p.id === ACTIVATION_PLAN_ID) ?? state.plans[0]
  if (!targetPlan) {
    return sendJson(res, 404, { success: false, error: 'No plan available to activate' })
  }

  if (state.courses.some((c) => c.id === targetPlan.id)) {
    return sendJson(res, 409, {
      success: false,
      error: 'You already have a subscription to this plan',
    })
  }

  state.courses.push({
    id: targetPlan.id,
    title: targetPlan.name,
    description: targetPlan.description,
    thumbnail: targetPlan.thumbnail,
    sortOrder: state.courses.length,
  })
  if (!state.videosByCourse[targetPlan.id]) {
    state.videosByCourse[targetPlan.id] = []
  }

  sendJson(res, 201, { success: true })
}

function handleCourse(courseId: string, res: ServerResponse) {
  const course = state.courses.find((c) => c.id === courseId)
  if (!course) {
    return sendJson(res, 404, { success: false, error: 'Course not found' })
  }
  sendJson(res, 200, { success: true, data: course })
}

function handleCourseVideos(courseId: string, res: ServerResponse) {
  const videos = state.videosByCourse[courseId] ?? []
  sendJson(res, 200, { success: true, data: videos })
}

function handleVideo(courseId: string, videoId: string, res: ServerResponse) {
  const videos = state.videosByCourse[courseId] ?? []
  const video = videos.find((v) => v.id === videoId)
  if (!video) {
    return sendJson(res, 404, { success: false, error: 'Video not found' })
  }
  sendJson(res, 200, { success: true, data: video })
}

async function handleProgress(
  req: IncomingMessage,
  courseId: string,
  videoId: string,
  res: ServerResponse,
) {
  const body = await readBody(req)
  const videos = state.videosByCourse[courseId] ?? []
  const video = videos.find((v) => v.id === videoId)
  if (!video) {
    return sendJson(res, 404, { success: false, error: 'Video not found' })
  }
  if (typeof body.progressSecs === 'number') video.progressSecs = body.progressSecs
  if (typeof body.watched === 'boolean') video.watched = body.watched
  res.writeHead(204).end()
}

function handleSubscribe(planId: string, res: ServerResponse) {
  const plan = state.plans.find((p) => p.id === planId)
  if (!plan) {
    return sendJson(res, 404, { success: false, error: 'Plan not found' })
  }
  sendJson(res, 200, { checkoutUrl: `https://checkout.example.com/mock/${planId}` })
}

function handleSignup(_req: IncomingMessage, res: ServerResponse) {
  // The app only cares that this returns a 2xx (it expects 202).
  res.writeHead(202).end()
}

// ── Router ────────────────────────────────────────────────────────────────────
async function route(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url ?? '/', `http://localhost:${PORT}`)
  const path = url.pathname.replace(/\/+$/, '') || '/'
  const method = (req.method ?? 'GET').toUpperCase()
  const segments = path.split('/').filter(Boolean)

  console.log(`[mock] ${method} ${path}`)

  if (method === 'GET' && segments.join('/') === 'plans') return handlePlans(res)
  if (method === 'GET' && segments.join('/') === 'me/courses') return handleMyCourses(url, res)
  if (method === 'POST' && segments.join('/') === 'me/subscriptions')
    return handleSubscriptions(req, res)

  if (method === 'GET' && segments.length === 2 && segments[0] === 'courses')
    return handleCourse(segments[1], res)

  if (method === 'GET' && segments.length === 4 && segments[0] === 'me' && segments[1] === 'courses' && segments[3] === 'videos')
    return handleCourseVideos(segments[2], res)

  if (method === 'GET' && segments.length === 5 && segments[0] === 'me' && segments[1] === 'courses' && segments[3] === 'videos')
    return handleVideo(segments[2], segments[4], res)

  if (method === 'POST' && segments.length === 6 && segments[0] === 'me' && segments[1] === 'courses' && segments[3] === 'videos' && segments[5] === 'progress')
    return handleProgress(req, segments[2], segments[4], res)

  if (method === 'POST' && segments.length === 3 && segments[0] === 'plans' && segments[2] === 'subscribe')
    return handleSubscribe(segments[1], res)

  if (method === 'POST' && segments.join('/') === 'signup') return handleSignup(req, res)

  sendJson(res, 404, { success: false, error: `No mock route for ${method} ${path}` })
}

// ── Server ────────────────────────────────────────────────────────────────────
const server = createServer((req, res) => {
  route(req, res).catch((err) => {
    console.error('[mock] error handling request:', err)
    if (!res.headersSent) {
      sendJson(res, 500, { success: false, error: 'Internal mock server error' })
    }
  })
})

server.listen(PORT, () => {
  console.log(`[mock] Subscription-management mock server listening on http://localhost:${PORT}`)
  console.log(`[mock] Seeded ${state.plans.length} plans, ${state.courses.length} courses.`)
  console.log(`[mock] Tip: any activation code subscribes to plan "${ACTIVATION_PLAN_ID}".`)
})