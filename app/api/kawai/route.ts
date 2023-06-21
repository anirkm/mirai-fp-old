import { cookies } from "next/headers"
import { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const { vid, code } = await req.json()

  if (!vid || !code) {
    return new Response(JSON.stringify({ error: "invalid query" }), {
      status: 400,
    })
  }

  const verification = await prisma.verifications.findUnique({
    where: {
      verificationId: vid || "",
    },
  })

  if (!verification) {
    return new Response(JSON.stringify({ error: "invalid query" }), {
      status: 400,
    })
  }

  let token = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: "https://mirai.satanic.world/verify/callback",
    }),
    next: {
      revalidate: 120,
    },
  })

  if (!token.ok) {
    return new Response(JSON.stringify({ error: "invalid code" }), {
      status: 400,
    })
  }

  const { access_token } = await token.json()

  const user = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 0,
    },
  })

  if (!user.ok) {
    return new Response(JSON.stringify({ error: "invalid access token" }), {
      status: 400,
    })
  }

  const userJson = await user.json()

  return new Response(JSON.stringify({ user: userJson, token: access_token }), {
    status: 200,
  })
}
