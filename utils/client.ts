import { default as process } from "node:process"

import { error, info } from "@postfmly/logger"
import { type ILogoServerConfig, LogoServer } from "@postfmly/logoserver"
import { type Nullable } from "@postfmly/types"

import {
  ActivityType,
  type Channel,
  Client as DiscordClient,
  Events,
  GatewayIntentBits,
  type GuildMember,
  type TextChannel
} from "discord.js"

import { showWelcome } from "../events/commands/welcome.ts"
import { loadCommands } from "../events/loadCommands.ts"
import { env } from "./env.ts"

interface IWelcomeBotClient {
  init: (testClient?: DiscordClient) => Promise<void>
  shutdown: (event?: string) => Promise<void>
}

class WelcomeBotClient implements IWelcomeBotClient {
  private CLIENT!: DiscordClient
  private CHANNEL!: TextChannel

  private LOGO_SERVER!: LogoServer

  private isShutdown: boolean = true

  async shutdown(event?: string): Promise<void> {
    if (this.isShutdown) {
      return
    }

    if (event && env.DEBUG) {
      info(`❌ ${event} detected`)
    }

    info("🔴 Shutting down...")

    await this.CLIENT.destroy()

    await this.LOGO_SERVER.stop()

    this.isShutdown = true

    process.exit(0)
  }

  private async login(): Promise<void> {
    await this.CLIENT.login(env.TOKEN)

    if (this.CLIENT.user && env.DEBUG) {
      info(`⚡ Connected as ${this.CLIENT.user.displayName} (${this.CLIENT.user.tag})`)
    }
  }

  async init(testClient?: DiscordClient): Promise<void> {
    this.LOGO_SERVER = new LogoServer({
      DEBUG: env.DEBUG,
      LOGO_NAME: env.LOGO_NAME,
      LOGO_PATH: env.LOGO_PATH,
      LOGO_PORT: env.LOGO_PORT
    } as ILogoServerConfig)

    await this.LOGO_SERVER.start()

    this.CLIENT =
      testClient ??
      new DiscordClient({
        intents: [GatewayIntentBits.Guilds],
        presence: {
          activities: [
            {
              name: `${env.ACTIVITY}...`,
              type: ActivityType.Custom
            }
          ]
        }
      })

    const channel: Nullable<Channel> = await this.CLIENT.channels.fetch(env.CHANNEL_ID)
    if (!channel) {
      throw new Error("Channel not found")
    }

    this.CHANNEL = channel as TextChannel

    this.CLIENT.on(Events.GuildMemberAdd, async (member: GuildMember): Promise<void> => {
      await showWelcome(this.CHANNEL, member.user, member.guild.name)
    })

    for (const event of ["SIGINT", "SIGTERM"]) {
      process.on(event, (e: string): void => {
        this.shutdown(e).catch((err: unknown) => {
          error("❌ Error during shutdown", err)

          process.exit(1)
        })
      })
    }

    await loadCommands(this.CLIENT)

    await this.login()

    this.isShutdown = false
  }
}

const Client: IWelcomeBotClient = new WelcomeBotClient()

export { Client }
