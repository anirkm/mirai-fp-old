"use client"

import { use, useEffect, useState } from "react"
import { headers } from "next/headers"
import Script from "next/script"
import { CheckCircle, Loader, XCircle } from "lucide-react"
import Confetti from "react-confetti"

import { sha512, toBase64 } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface failedType {
  state: {
    isFailed: boolean
    message: string
  }
  browser: {
    isFailed: boolean
    message: string
  }
  account: {
    isFailed: boolean
    message: string
  }
}

const verifyUser = async (state: string, hash: string) => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
}

export default function Fingerprint(props: any) {
  const [progress, setProgress] = useState(0)
  const [isFpReady, setIsFpReady] = useState(false)
  const [isVerified, setIsVerified] = useState<boolean | undefined>(undefined)
  const [steps, setSteps] = useState({
    state: undefined,
    browser: undefined,
    account: undefined,
  } as any)
  const [failed, setFailed] = useState<any>({
    state: {
      isFailed: false,
      message: "",
    },
    browser: {
      isFailed: false,
      message: "",
    },
    account: {
      isFailed: false,
      message: "",
    },
  })

  useEffect(() => {
    const [hash, vId] = Buffer.from(`${props.state}`, "base64")
      .toString("ascii")
      .split("_")

    const getIp = async () => {
      const reponse = await fetch("https://mirai.satanic.world/api/session", {
        cache: "no-cache",
      })
      if (!reponse.ok) return ""
      const { ip } = await reponse.json()
      return ip
    }

    const getHash = async () => {
      let sha = await sha512(`${vId}-${await getIp()}-1337`)
      let hash = Buffer.from(`${sha}_${vId}`, "utf8").toString("base64")
      console.log("inside", sha, hash)
      return hash
    }

    const checkState = async () => {
      const state = await getHash()
      const serverState = await fetch("https://mirai.satanic.world/api/me", {
        method: "POST",
        body: JSON.stringify({
          state,
          access_token: props.token,
        }),
      })

      let _hash = null

      if (serverState.ok) {
        _hash = (await serverState.json())._
      }

      console.log("state", state)

      if (state == props.state && state == _hash && _hash == props.state) {
        setFailed({
          ...failed,
          state: { isFailed: false, message: "" },
        })
      } else {
        setFailed({
          ...failed,
          state: {
            isFailed: true,
            message: "Client state verification failed.",
          },
        })
      }

      setSteps({ ...steps, state: true })
    }

    checkState()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.state])

  useEffect(() => {
    if (!isFpReady || steps.state === undefined) return

    console.log("cookie", document.cookie)

    const agent = (window as any).seon
    agent.config({
      host: "getdeviceinf.com",
      session_id: props.state,
      audio_fingerprint: true,
      canvas_fingerprint: true,
      webgl_fingerprint: true,
      onSuccess: async function () {
        let hash = await agent.getBase64Session()
        if (hash) {
          let fp = await fetch("https://mirai.satanic.world/api/killyourself", {
            method: "POST",
            body: JSON.stringify({
              fsddd: toBase64(`${props.state}-1`),
              //
              sk9Sskd: toBase64(props.state),
              awjs0ksj: toBase64(hash),
              wsjdj0: toBase64(props.email),
              ssll0: toBase64(props.username),
              //
              ppdkks: toBase64(`s1df-${props.email}-2`),
              wgffsq: toBase64(`sdf-${props.username}-3`),
              fsdazdddd: toBase64(`sdfsdf-${props.state}-4`),
            }),
            cache: "no-store",
          })

          if (!fp.ok) {
            let reason = await fp.json()
            setFailed({
              ...failed,
              browser: { isFailed: true, message: reason.message },
              account: { isFailed: true, message: reason.message },
            })
            setSteps({ ...steps, browser: true, account: true })

            return
          }

          const { state, score, email } = await fp.json()
          console.log(state, score, email)

          setFailed({
            ...failed,
            account: {
              isFailed: !email,
              message: "We can't accept temporary emails.",
            },
            browser: {
              isFailed: !fp.ok,
              message: "Browser verification failed.",
            },
          })
        } else {
          setFailed({
            ...failed,
            browser: {
              isFailed: true,
              message:
                "Something went wrong while verifying your browser. (Refresh the page an try again)",
            },
            account: {
              isFailed: true,
              message:
                "Something went wrong while verifying your browser. (Refresh the page an try again)",
            },
          })
        }

        setSteps({ ...steps, browser: true, account: true })
      },
      onError: function (message: any) {
        setSteps({ ...steps, browser: true, account: true })
        setFailed({
          ...failed,
          browser: {
            isFailed: true,
            message:
              "Something went wrong while verifying your browser. (Refresh the page an try again)",
          },
          account: {
            isFailed: true,
            message:
              "Something went wrong while verifying your browser. (Refresh the page an try again)",
          },
        })
      },
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.state, props.email, props.username, isFpReady, steps.state])

  useEffect(() => {
    let i = 0
    Object.values(steps).forEach((step: any) => {
      if (step) i++
    })
    if (isVerified) i++
    setProgress(i * 25)
  }, [steps, isVerified])

  useEffect(() => {
    const verifyEffect = async () => {
      if (
        !failed.browser.isFailed &&
        !failed.account.isFailed &&
        !failed.state.isFailed &&
        steps.browser &&
        steps.account &&
        steps.state
      ) {
        const test = await fetch(
          "https://mirai.satanic.world/api/finaldestination",
          {
            method: "POST",
          }
        )

        if (!test.ok) {
          setIsVerified(false)
        }

        console.log("test", await test.json())

        setIsVerified(true)
      }

      if (
        (failed.browser.isFailed ||
          failed.account.isFailed ||
          failed.state.isFailed) &&
        steps.browser &&
        steps.account &&
        steps.state
      ) {
        setIsVerified(false)
      }
    }

    verifyEffect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed])

  useEffect(() => {
    console.log("failed", failed)
  }, [failed])

  useEffect(() => {
    console.log("steps", steps)
  }, [steps])

  return (
    <div className="flex flex-col space-y-8">
      <Progress value={progress} className={`w-[100%]`} />
      {isVerified ? <Confetti numberOfPieces={337} recycle={false} /> : null}
      {Object.keys(steps).map((step, i) => {
        return (
          <div key={step}>
            {step === "browser" && !steps[step] ? (
              <Script
                src="https://cdn.getdeviceinf.com/js/v5/agent.js"
                onLoad={() => {
                  setIsFpReady(true)
                }}
                onError={() => {
                  setSteps({ ...steps, browser: true })
                  setFailed({
                    ...failed,
                    browser: {
                      isFailed: true,
                      message:
                        "Something went wrong while verifying your browser. (Refresh the page an try again)",
                    },
                    account: {
                      isFailed: true,
                      message:
                        "Something went wrong while verifying your browser. (Refresh the page an try again)",
                    },
                  })
                }}
              ></Script>
            ) : null}
            <Alert className="flex flex-col space-x-2 transition-transform hover:scale-[1.02]">
              {steps[step] ? (
                !failed[step].isFailed ? (
                  <CheckCircle color="#0de711" />
                ) : (
                  <XCircle color="#ff0000" />
                )
              ) : (
                <Loader className="animate-spin" />
              )}
              <AlertTitle className="flex justify-start space-x-2">
                <p className="mt-1 font-bold">{`Checking your ${step}`}</p>
              </AlertTitle>
              <AlertDescription>
                {steps[step] && failed[step].isFailed ? (
                  <p>{failed[step].message}</p>
                ) : null}
              </AlertDescription>
            </Alert>
          </div>
        )
      })}
      <div>
        <Alert className="flex flex-col space-x-2 transition-transform hover:scale-[1.02]">
          {isVerified !== undefined ? (
            isVerified ? (
              <CheckCircle color="#0de711" />
            ) : (
              <XCircle color="#ff0000" />
            )
          ) : (
            <Loader className="animate-spin" />
          )}
          <AlertTitle className="flex justify-start space-x-2">
            <p className="mt-1 font-bold">
              {isVerified !== undefined
                ? isVerified
                  ? "Redirecting you..."
                  : "Verification Failed"
                : "You are being verified"}
            </p>
          </AlertTitle>
          <AlertDescription>
            {isVerified !== undefined && !isVerified ? (
              <p>
                You have failed the verifications check the errors below
                (refresh the page after you fixed the errors)
              </p>
            ) : null}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
