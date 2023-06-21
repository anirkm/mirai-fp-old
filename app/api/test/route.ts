import { NextRequest } from "next/server"
import { prisma } from "lib/prisma"

export async function GET(req: NextRequest) {
  const verifcation = await prisma.verifications.create({
    data: {
      userId: "490667823392096268",
      guildId: "777271906486976512",
    },
  })

  return new Response(JSON.stringify(verifcation), {
    status: 200,
  })
}
