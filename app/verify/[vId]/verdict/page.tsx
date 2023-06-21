import { AlertTriangle, CheckCircle2, Loader, XCircle } from "lucide-react"

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

const getVerification = async (vId: string) => {
  const verification = await prisma.verifications.findUnique({
    where: {
      verificationId: vId,
    },
  })
  return verification
}

enum EVerdict {
  PASSED = "PASSED",
  FAILED = "FAILED",
  FLAGGED = "FLAGGED",
}

export default async function Verdict({ params }: { params: { vId: string } }) {
  const verdict = "FLAGGED"

  const verification = await getVerification(params.vId)

  if (!verification) {
    return (
      <div className="flex h-half items-center justify-center">
        <Alert className="w-5/6 sm:w-1/2">
          <XCircle color="#aa0909" className="mt-1 pl-px" />

          <AlertTitle className="text-lg">
            The verification results you have requested doesnt exist
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
    <div className="flex h-[57vh] items-center justify-center sm:h-[65vh]">
      <Card className="w-5/6 sm:w-1/3">
        <CardHeader>
          <div className="flex justify-start space-x-2">
            <Avatar>
              <AvatarImage
                src="https://cdn.discordapp.com/icons/777271906486976512/a_fc64829bca43cca70d7fb238ccba4da3.png"
                alt="@11pm"
              />
              <AvatarFallback>CN</AvatarFallback>
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
          <div className="flex flex-col items-center justify-center space-y-4">
            {/* @ts-ignore */}
            {verdict === EVerdict.PASSED ? (
              <>
                <CheckCircle2 className="h-auto w-1/4" color="#3eb93c" />
                <AlertDescription className="text-center sm:w-4/6">
                  s <p className="text-lg font-semibold">Verification Passed</p>
                  <p className="text-sm text-slate-400">
                    You have been successfully verified and can now access the
                    server.
                  </p>
                </AlertDescription>
              </>
            ) : /* @ts-ignore */
            verdict === EVerdict.FAILED ? (
              <>
                <XCircle className="h-auto w-1/4" color="#ff0000" />
                <AlertDescription className="text-center sm:w-4/6">
                  <p className="text-lg font-semibold">Verification Failed!</p>
                  <p className="text-sm text-slate-400">
                    We have noticed some irregularities in your account, Try
                    again later or contact a staff member.
                  </p>
                </AlertDescription>
              </>
            ) : /* @ts-ignore */
            ((verdict === EVerdict.FLAGGED) as unknown) ? (
              <>
                <AlertTriangle className="h-auto w-1/4" color="#b9b304" />
                <AlertDescription className="text-center sm:w-4/6">
                  <p className="text-lg font-semibold">
                    Manual Verification is required
                  </p>
                  <p className="text-sm text-slate-400">
                    Please join a verification channel a staff member will
                    assist you.
                  </p>
                </AlertDescription>
              </>
            ) : (
              <>
                <Loader className="h-auto w-1/4 animate-spin" color="#ffffff" />
                <AlertDescription className="text-center sm:w-4/6">
                  <p className="text-lg font-semibold">Pending verification</p>
                  <p className="text-sm text-slate-400">
                    This verification is still pending, if you have already
                    verified please try again (refresh the page).
                  </p>
                </AlertDescription>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
