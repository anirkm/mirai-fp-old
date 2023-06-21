import { NextResponse, type NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)

  requestHeaders.set("x-dev-ip", "1.1.1.1")

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/*"
}