import { readdir } from "node:fs/promises"
import { default as path } from "node:path"

import { describe, expect, jest, test } from "bun:test"

import { type Optional } from "@postfmly/types"

import { fakerEN_US as fake } from "@faker-js/faker"
import {
  type ChatInputCommandInteraction,
  type Guild,
  type GuildChannelManager,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  type TextChannel,
  type User
} from "discord.js"
import { match } from "ts-pattern"

import { author, version } from "../../package.json" with { type: "json" }
import { env, MAX_ID_LEN, MIN_ID_LEN } from "../../utils/env.ts"

interface ICommandFile {
  create: () => RESTPostAPIChatInputApplicationCommandsJSONBody
  invoke: (interaction: ChatInputCommandInteraction) => Promise<void>
}

const HEX_BASE: number = 16
const COLOR_LEN: number = 6
const decimalToHex = (c: Optional<number>): string => (c ? `#${c.toString(HEX_BASE).padStart(COLOR_LEN, "0")}` : "N/A")

const dir: string = "events/commands"

const commands: string[] = (await readdir(dir)).filter((file: string): boolean => file.endsWith(".ts"))

await Promise.all(
  commands.map(async (command: string): Promise<void> => {
    const { create, invoke } = (await import(`${path.join("../..", dir)}/${command}`)) satisfies ICommandFile

    const name: string = path.basename(command, ".ts")

    describe(`/${name}`, (): void => {
      test("create", (): void => {
        const c: RESTPostAPIChatInputApplicationCommandsJSONBody = create()

        expect(c.name).toBe(name)
        expect(c.description).not.toBeEmpty()
        expect(c.contexts ?? []).not.toBeEmpty()
      })

      test("invoke", async (): Promise<void> => {
        const user: User = {
          displayAvatarURL: jest.fn().mockReturnValue(env.LOGO_URL),
          displayName: fake.internet.displayName(),
          id: fake.helpers.fromRegExp(`[0-9]{${MIN_ID_LEN},${MAX_ID_LEN}}`),
          username: fake.internet.username()
        } as unknown as User

        const interaction: ChatInputCommandInteraction = {
          createdTimestamp: fake.date.past().getTime(),
          deferReply: jest.fn().mockResolvedValue(undefined),
          editReply: jest.fn().mockResolvedValue(undefined),
          guild: {
            channels: {
              fetch: jest.fn().mockResolvedValue({
                send: jest.fn().mockResolvedValue(undefined)
              } as unknown as TextChannel)
            } as unknown as GuildChannelManager,
            name: fake.lorem.word()
          } as Guild,
          user,
          options: {
            getUser: jest.fn().mockReturnValue(user)
          }
        } as unknown as ChatInputCommandInteraction

        expect(await invoke(interaction)).toBeUndefined()

        expect(interaction.deferReply).toHaveBeenCalled()
        expect(interaction.editReply).toHaveBeenCalled()

        const mockEditReply = interaction.editReply as ReturnType<typeof jest.fn>
        const firstCallArgs = mockEditReply.mock.calls
        const payload = firstCallArgs[0]?.[0]
        if (!payload) {
          throw new Error("Payload not found")
        }

        match<string, void>(name)
          .with("info", (): void => {
            const data = payload.embeds?.[0].data

            expect(decimalToHex(data.color)).toBe(env.COLOR)
            expect(data.author.icon_url).toBe(env.LOGO_URL)
            expect(data.author.name).toBe(`${env.NAME} v${version}`)
            expect(data.thumbnail.url).toBe(env.LOGO_URL)
            expect(data.description).not.toBeEmpty()
            expect(data.footer.text).toEndWith(author.name)
          })
          .with("ping", (): void => expect(payload.content).toInclude("Pong"))
          .with("welcome", (): void => expect(payload.content).toInclude("Welcomed"))
          .otherwise((): never => {
            throw new Error(`Payload tests not found for /${name}`)
          })
      })
    })
  })
)
