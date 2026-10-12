import { error, info } from "@postfmly/logger"

import { Client } from "./utils/client.ts"
import { env } from "./utils/env.ts"
import { Welcome } from "./utils/welcome.ts"

try {
  await Welcome.init(await Client.init())

  info(`🟢 ${env.ACTIVITY}...`)
} catch (e: unknown) {
  const msg: string = (e as Error).message

  error(`❌ ${msg}`)

  await Client.shutdown(msg)
}
