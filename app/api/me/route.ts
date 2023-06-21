import { cookies } from "next/headers"
import { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { sha512 } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const query = await req.json()

  console.log(query)

  const { state, access_token } = query

  if (!state || !access_token) {
    return new Response(JSON.stringify({ error: "invalid query" }), {
      status: 400,
    })
  }

  const [hash, vId] = Buffer.from(`${state}`, "base64")
    .toString("ascii")
    .split("_")

  let sha = await sha512(`${vId}-${req.headers.get("cf-connecting-ip")}-1337`)
  let _hash = Buffer.from(`${sha}_${vId}`, "utf8").toString("base64")

  if (sha !== hash || _hash !== state) {
    return new Response(JSON.stringify({ error: "unauthorized hash" }), {
      status: 400,
    })
  }

  const user = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: {
      revalidate: 0,
    },
  })

  if (!user.ok) {
    return new Response(JSON.stringify({ error: "invalid token" }), {
      status: 400,
    })
  }

  const verification = await prisma.verifications.findUnique({
    where: {
      verificationId: vId || "",
    },
  })

  const { id, username, discriminator, avatar } = await user.json()

  if (!verification) {
    return new Response(JSON.stringify({ error: "invalid vid" }), {
      status: 400,
    })
  }

  if (verification.userId !== id) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 400,
    })
  }

  const cookieStore = cookies()

  cookieStore.set({
    name: "token",
    value: access_token,
    path: "/api/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  })

  cookieStore.set({
    name: "vid",
    value: verification.verificationId,
    path: "/api/",
    sameSite: "strict",
    secure: true,
    httpOnly: true,
  })

  return new Response(JSON.stringify({ _: _hash }), {
    status: 200,
  })
}
