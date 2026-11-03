import { type Nullable } from "@postfmly/types"

import {
  type Channel,
  ChannelType,
  type ChatInputCommandInteraction,
  type Client,
  EmbedBuilder,
  MessageFlags,
  type TextChannel,
  type User,
  userMention
} from "discord.js"

import { env } from "./env.ts"

interface IWelcomeBot {
  init: (client: Client) => Promise<void>
  showWelcome: (user: User, name: string) => Promise<void>
  welcome: (interaction: ChatInputCommandInteraction) => Promise<void>
}

class WelcomeBot implements IWelcomeBot {
  private CHANNEL!: TextChannel

  async init(client: Client): Promise<void> {
    const channel: Nullable<Channel> = await client.channels.fetch(env.CHANNEL_ID)
    if (channel?.type !== ChannelType.GuildText) {
      throw new Error("Could not get channel")
    }

    this.CHANNEL = channel
  }

  async showWelcome(user: User, name: string): Promise<void> {
    await this.CHANNEL.send({
      content: userMention(user.id),
      embeds: [
        new EmbedBuilder()
          .setColor(env.COLOR)
          .setAuthor({
            iconURL: user.displayAvatarURL(),
            name: user.displayName
          })
          .setTitle(`✨ Welcome to ${name}! ✨`)
          .addFields(
            {
              inline: true,
              name: "👤 USERNAME",
              value: `\`${user.username}\``
            },
            {
              inline: true,
              name: "🪪 USER ID",
              value: `\`${user.id}\``
            }
          )
          .setTimestamp()
      ]
    })
  }

  async welcome(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral })

    // biome-ignore lint/style/noNonNullAssertion: required
    const user = interaction.options.getUser("user")!

    // biome-ignore lint/style/noNonNullAssertion: executed from server
    const { name } = interaction.guild!

    await this.showWelcome(user, name)

    await interaction.editReply({ content: `-# > ✨ Welcomed \`${user.displayName}\` to ${name}` })
  }
}

export const Welcome = new WelcomeBot()
