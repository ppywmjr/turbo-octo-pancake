import 'server-only'
import fs from 'fs/promises'
import path from 'path'

export async function handleMockFetch(url: string): Promise<Response | null> {
  if (process.env.NEXT_PUBLIC_USE_MOCKS !== 'true') {
    return null
  }

  const urlObj = new URL(url, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3010')
  const pathname = urlObj.pathname.replace(/^\/api/, '').replace(/^\/me\//, '')
  const segments = pathname.split('/').filter(Boolean)

  console.log('DEBUG serverFetch: Processing URL', { url, pathname, segments })

  // Define a list of possible mock files to check
  const mockFiles = ['courses.json', 'videos.json', 'plans.json']

  // Determine which resource we're fetching based on the path pattern
  let targetResource: string | null = null

  // Check for nested patterns like courses/{id}/videos
  const courseIndex = segments.indexOf('courses')
  if (courseIndex !== -1 && courseIndex < segments.length - 1 && segments[courseIndex + 1] === 'videos') {
    // Pattern: courses/{id}/videos -> we want videos
    targetResource = 'videos'
  } else if (segments.includes('videos')) {
    // Pattern: videos or videos/{id} -> we want videos
    targetResource = 'videos'
  } else if (segments.includes('courses')) {
    // Pattern: courses or courses/{id} -> we want courses
    targetResource = 'courses'
  } else if (segments.includes('plans')) {
    // Pattern: plans or plans/{id} -> we want plans
    targetResource = 'plans'
  }

  // Try each mock file in order of preference based on our target
  const preferredMockFiles = targetResource
    ? [`${targetResource}.json`, ...mockFiles.filter(f => f !== `${targetResource}.json`)]
    : mockFiles

  for (const mockFile of preferredMockFiles) {
    const resource = mockFile.replace('.json', '')
    // Check if the resource name is in the path segments
    if (segments.includes(resource)) {
      try {
        const data = await fs.readFile(path.join(process.cwd(), 'app', 'lib', 'mocks', mockFile), 'utf-8')
        const json = JSON.parse(data)

        let responseData: any = json

        // Handle nested structure like { success: true, data: [...], pagination: {...} }
        const dataArray = json.data || (Array.isArray(json) ? json : null)

        if (dataArray) {
          // If it's an array, try to find the item with a matching ID in the segments
          if (Array.isArray(dataArray)) {
            // Look for an ID in the segments that matches an item's ID
            const idSegment = segments.find(segment => {
              // This is a bit naive, but works for /courses/1 or /videos/v1
              // We check if the segment matches any ID in the array
              return dataArray.some((item: any) => item.id === segment)
            })

            console.log('DEBUG serverFetch:', { pathname, segments, idSegment, dataArrayLength: dataArray.length })

            if (idSegment) {
              const found = dataArray.find((item: any) => item.id === idSegment)
              responseData = found
              console.log('DEBUG serverFetch: Found specific item', { idSegment })
            } else if (json.pagination) {
              // If no specific ID matched but pagination exists, return full response
              console.log('DEBUG serverFetch: No ID match, returning full response with pagination')
              responseData = json
            } else {
              // If no specific ID matched, return the whole array wrapped in data
              console.log('DEBUG serverFetch: No ID match, returning array')
              responseData = { data: dataArray }
            }
          } else {
            // If not an array, use the data object directly
            responseData = dataArray
          }
        }

        console.log('DEBUG serverFetch: Final response', pathname, responseData)

        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } catch (e) {
        // If file not found or error reading, continue to next mock file or real fetch
      }
    }
  }

  return null
}