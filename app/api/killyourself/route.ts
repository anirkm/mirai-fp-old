import { NextRequest } from "next/server"

import { prisma } from "@/lib/prisma"
import { fromBase64, sha512 } from "@/lib/utils"

export async function POST(req: NextRequest) {
  let { awjs0ksj, sk9Sskd, wsjdj0, ssll0 } = await req.json()

  if (!awjs0ksj || !sk9Sskd || !wsjdj0 || !ssll0) {
    return new Response(
      JSON.stringify({ status: "error", message: "invalid query" }),
      {
        status: 400,
      }
    )
  }

  let [hash, state, email, username] = [
    fromBase64(awjs0ksj),
    fromBase64(sk9Sskd),
    fromBase64(wsjdj0),
    fromBase64(ssll0),
  ]

  const [stateHash, vId] = Buffer.from(`${state}`, "base64")
    .toString("ascii")
    .split("_")

  let enc = Buffer.from(
    `${await sha512(
      `${vId}-${req.headers.get("cf-connecting-ip")}-1337`
    )}_${vId}`,
    "utf8"
  ).toString("base64")

  if (enc !== state) {
    return new Response(
      JSON.stringify({ status: "error", message: "invalid state" }),
      {
        status: 400,
      }
    )
  }

  const fingerprint = await prisma.verifications.findFirst({
    where: {
      verificationId: vId,
    },
  })

  if (!fingerprint) {
    return new Response(
      JSON.stringify({ status: "error", message: "invalid state" }),
      {
        status: 400,
      }
    )
  }

  const seon = await fetch(
    "https://api.seon.io/SeonRestService/fraud-api/v2.0/",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.SEON!,
      },
      body: JSON.stringify({
        config: {
          ip: {
            include: "flags,history,id",
            timeout: 5000,
            version: "v1.1",
          },
          email: {
            include: "flags,history,id",
            timeout: 5000,
            version: "v2.2",
          },
          ip_api: true,
          email_api: true,
          device_fingerprinting: true,
          ignore_velocity_rules: false,
          response_fields:
            "id,state,fraud_score,ip_details,email_details,applied_rules,device_details,calculation_time,seon_id",
        },
        ip: req.ip,
        email: email,
        user_name: username,
        session: hash,
      }),
    }
  )

  if (!seon.ok) {
    return new Response(
      JSON.stringify({
        status: "api-error",
        message: "something went wrong contact an admin.",
      }),
      {
        status: 400,
      }
    )
  }

  const seonData = await seon.json()

  if (!seonData.success) {
    return new Response(
      JSON.stringify({
        status: "api-error",
        message: "something went wrong contact an admin.",
      }),
      {
        status: 400,
      }
    )
  }


  console.log(seonData)

  return new Response(
    JSON.stringify({
      state: seonData.data.state,
      score: seonData.data.fraud_score,
      email:
        !seonData.data.email_details.domain_details.suspicious_tld &&
        !seonData.data.email_details.domain_details.disposable,
      uwu: "uwu",
    }),
    {
      status: 200,
    }
  )
}
