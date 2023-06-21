import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export function POST(req: NextRequest) {
  return new Response(JSON.stringify({ cookies: cookies().getAll() }), {})
}
