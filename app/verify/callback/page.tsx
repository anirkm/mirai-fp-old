/* eslint-disable tailwindcss/classnames-order */

import { access } from "fs"
import { XCircle } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import Fingerprint from "../components/Fingerprint"

const getUser = async (code: string, vid: string) => {
  const user = await fetch("https://mirai.satanic.world/api/kawai", {
    method: "POST",
    body: JSON.stringify({
      code,
      vid,
    }),
  })

  if (!user.ok) return null

  const data = await user.json()

  return data
}

const verifyState = async (state: string) => {
  const verification = await prisma.verifications.findUnique({
    where: {
      verificationId: state || "",
    },
  })

  return verification
}
export default async function VerificationCallback({
  searchParams,
}: {
  searchParams: { code: string; state: string; error: string }
}) {
  console.log()

  if (searchParams.error === "access_denied") {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            You have declined the Authorization request
          </AlertTitle>
          <AlertDescription className="text-sm">
            {" "}
            If you&apos;re not verified yet you can request a verification link
            using the discord bot
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!searchParams.code || !searchParams.state) {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            Invalid verification callback query params
          </AlertTitle>
          <AlertDescription className="text-sm">
            {" "}
            If you&apos;re not verified yet you can request a verification link
            using the discord bot
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const [hash, vId] = Buffer.from(`${searchParams.state}`, "base64")
    .toString("ascii")
    .split("_")

  let verification = await verifyState(vId)

  if (!verification) {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            The verification callback you have requested doesnt exist
          </AlertTitle>
          <AlertDescription className="text-sm">
            {" "}
            If you&apos;re not verified yet you can request a verification link
            using the discord bot
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (verification.status === "PASSED" || verification.status === "EXPIRED") {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            The verification callback you have requested
          </AlertTitle>
          <AlertDescription className="text-sm">
            {" "}
            If you&apos;re not verified yet you can request a verification link
            using the discord bot
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const user = await getUser(searchParams.code, vId)

  console.log(user?.user)

  if (!user?.user) {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            An error occured while trying to fetch your user data
          </AlertTitle>
          <AlertDescription className="text-sm">
            {" "}
            Try to refresh the page if the error persists please try to generate
            a new verification link using the bot if the error still persists
            please contact support!
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (user.user.id !== verification.userId) {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            The user you are trying to verify is not the same as the user who
            requested the verification
          </AlertTitle>
          <AlertDescription className="text-sm">
            {" "}
            Authorize with the account who requested the verification and try
            again.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  console.log("user", user)

  return (
    <div className="mt-4 flex h-auto items-center justify-center sm:h-80vh">
      <Card className="w-11/12 sm:w-3/6">
        <CardHeader>
          <div className="flex justify-start space-x-2">
            <Avatar>
              <AvatarImage
                src="https://cdn.discordapp.com/icons/777271906486976512/a_fc64829bca43cca70d7fb238ccba4da3.png"
                alt="@guild"
              />
              <AvatarFallback>
                <Skeleton className="rounded-full" />
              </AvatarFallback>
            </Avatar>
            <CardTitle className="flex items-center justify-center bg-gradient-to-r from-white to-purple-400 bg-clip-text text-lg font-bold text-transparent">
              11pm&apos;s World #WeLoveYou.
            </CardTitle>
          </div>
          <Separator />
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Alert className="transition-transform hover:scale-[1.02]">
            <AlertDescription>
              <div className="flex justify-start space-x-2">
                <Avatar>
                  <AvatarImage
                    src={`https://cdn.discordapp.com/avatars/${user.user.id}/${
                      user.user.avatar
                    }.png?v=${Date.now()}`}
                    alt="@yatsuki"
                  />
                  <AvatarFallback>
                    <Skeleton className="rounded-full" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold">{user.user.username}</p>
                  <p className="text-xs text-slate-400">{`${user.user.username}#${user.user.discriminator}`}</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
          <Fingerprint
            state={searchParams.state}
            email={user.user.email}
            username={user.user.username}
            token={user.token}
          />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  )
}
