import { type Nullable } from "@postfmly/types"

import {
  type Channel,
  type ChatInputCommandInteraction,
  type Client,
  EmbedBuilder,
  type HexColorString,
  MessageFlags,
  type TextChannel,
  type User,
  userMention
} from "discord.js"

import { env } from "./env.ts"

interface IWelcomeBot {
  init: (client: Client) => Promise<void>
  showWelcome: (user: User) => Promise<void>
  welcome: (interaction: ChatInputCommandInteraction) => Promise<void>
}

class WelcomeBot implements IWelcomeBot {
  private CHANNEL!: TextChannel

  async init(client: Client): Promise<void> {
    const channel: Nullable<Channel> = await client.channels.fetch(env.CHANNEL_ID)
    if (!channel) {
      throw new Error("Could not get channel")
    }

    this.CHANNEL = channel as TextChannel
  }

  async showWelcome(user: User): Promise<void> {
    await this.CHANNEL.send({
      content: userMention(user.id),
      embeds: [
        new EmbedBuilder()
          .setColor(env.COLOR as HexColorString)
          .setAuthor({
            iconURL: user.displayAvatarURL(),
            name: user.displayName
          })
          .setDescription(`# ✨ *Welcome to ${env.NAME}!* ✨`)
          .setImage(env.LOGO2_URL)
          .addFields(
            {
              inline: true,
              name: "Username:",
              value: user.username
            },
            {
              inline: true,
              name: "User ID:",
              value: user.id
            }
          )
          .setTimestamp()
          .toJSON()
      ]
    })
  }

  async welcome(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    const user: User = interaction.options.getUser("user") as User

    await this.showWelcome(user)

    await interaction.editReply({ content: `-# > ✨ Welcomed \`${user.displayName}\` to ${env.NAME}` })
  }
}

const Welcome: IWelcomeBot = new WelcomeBot()

export { Welcome }
