import { NextRequest, userAgent } from "next/server"

export function GET(req: NextRequest) {
  return new Response(
    JSON.stringify({
      ip: req.headers.get("cf-connecting-ip") || req.ip,
      userAgent: userAgent({ headers: req.headers }),
    }),
    {
      status: 200,
    }
  )
}
