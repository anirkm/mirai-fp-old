"use client"

import Link from "next/link"

import { sha256, sha512 } from "@/lib/utils"
import { Button } from "@/components/ui/button"



const handleVerification = (e: any, props: any) => {
  let enc = Buffer.from(
    `${sha512(`${props.state}-${props.ip}-1337`)}`,
    "utf8"
  ).toString("base64")
  localStorage.setItem("state", enc)
}



export function VerificationButtons(props: any) {
  let enc = Buffer.from(
    `${sha512(`${props.state}-${props.ip}-1337`)}-${props.state}`
  ).toString("base64")

  console.log(`ip: ${props.ip}, state: ${props.state}, enc: ${enc}`)

  return (
    <div className="flex justify-start space-x-4">
      <Button
        className="transition-transform hover:scale-105"
        asChild
        onClick={(e: any) => {
          handleVerification(e, props)
        }}
      >
        <Link
          href={`https://discord.com/api/oauth2/authorize?client_id=1113069673618088008&redirect_uri=http://localhost:3000/verify/callback&response_type=code&scope=identify%20guilds%20email&state=${enc}`}
        >
          Begin verification
        </Link>
      </Button>
      <Button
        className="transition-transform hover:scale-105"
        variant="destructive"
      >
        Cancel verification
      </Button>
    </div>
  )
}
