import { loadCommands } from "./events/loadCommands.ts"
import { client, login, shutdown } from "./utils/client.ts"
import { error, info } from "./utils/logger.ts"
import { logo } from "./utils/logo.ts"

Bun.env.DEBUG = Bun.env.IS_DEBUG === "true" ? true : false

await loadCommands(await client())
  .then(async (): Promise<void> => await login())
  .then(async (): Promise<void> => await logo())
  .then((): void => info("Running..."))
  // biome-ignore lint/suspicious/noExplicitAny: catch all errors
  .catch(async (e: any): Promise<void> => {
    error(e)
    await shutdown()
  })
