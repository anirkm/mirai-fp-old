/* eslint-disable tailwindcss/classnames-order */
import { headers } from "next/headers"
import Link from "next/link"
import { NextRequest } from "next/server"
import { UserCheck, XCircle, BellPlus, Bell } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { sha512 } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface Props {
  params: {
    vId: string
  }
}

const getVerification = async (vId: string) => {
  const verification = await prisma.verifications.findUnique({
    where: {
      verificationId: vId,
    },
  })
  return verification
}

export default async function Verify({ params }: Props) {
  let enc = Buffer.from(
    `${await sha512(
      `${params.vId}-${headers().get("cf-connecting-ip")}-1337`
    )}_${params.vId}`,
    "utf8"
  ).toString("base64")

  const verification = await getVerification(params.vId)

  if (!verification) {
    return (
      <div className="h-half flex items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            The verification you have requested doesnt exist
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
      <div className="h-half flex items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            The verification you have requested is no longer valid
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

  return (
    <div className="mt-5 flex items-center justify-center sm:h-half">
      <Card className="w-5/6 sm:w-1/2">
        <CardHeader>
          <div className="flex justify-start space-x-2">
            <Avatar>
              <AvatarImage
                src="https://cdn.discordapp.com/icons/777271906486976512/a_fc64829bca43cca70d7fb238ccba4da3.png"
                alt="@shadcn"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <CardTitle className="flex items-center justify-center bg-gradient-to-r from-white to-purple-400 bg-clip-text text-lg font-bold text-transparent">
              11pm&apos;s World #WeLoveYou.
            </CardTitle>
          </div>
          <Separator />
          <CardDescription className="text-slate-300">
            You can start the verification proccess by clicking the button you
            will be redirected to discord to link your account with the server.
          </CardDescription>
          <CardDescription className="text-slate-300">
            Make sure you are not using any VPN or Proxy, if you are using a
            private broswer you might need to disable it.
          </CardDescription>
          <CardDescription className="text-slate-300">
            Using a temporary email provider with your discord account will
            result in a failed verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="transition-transform hover:scale-[1.02]">
            <AlertDescription>
              <div className="flex justify-start space-x-2">
                <Avatar>
                  <AvatarImage
                    src="https://cdn.discordapp.com/avatars/490667823392096268/a_afad35cc47f411b98be2c32a754e3265.gif?size=1024"
                    alt="@yatsuki"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-semibold">Yatsuki</p>
                  <p className="text-xs text-slate-400">Yatsuki#1337</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <div className="flex justify-start space-x-4">
            <Button className="transition-transform hover:scale-105" asChild>
              <Link
                href={`https://discord.com/api/oauth2/authorize?client_id=1113069673618088008&redirect_uri=https://mirai.satanic.world/verify/callback&response_type=code&scope=identify%20guilds%20email&state=${enc}`}
              >
                <div className="flex space-x-1">
                  <UserCheck size={18} />
                  <p className="font-semibold">Begin Verification</p>
                </div>
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
