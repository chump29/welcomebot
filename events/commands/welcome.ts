import { parse } from "node:path"

import { type Nullable } from "@postfmly/types"

import {
  type Channel,
  type ChatInputCommandInteraction,
  EmbedBuilder,
  type HexColorString,
  InteractionContextType,
  MessageFlags,
  PermissionFlagsBits,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  type SlashCommandUserOption,
  type TextChannel,
  type User,
  userMention
} from "discord.js"

import { env } from "../../utils/env.ts"

const create = (): RESTPostAPIChatInputApplicationCommandsJSONBody =>
  new SlashCommandBuilder()
    .setName(parse(import.meta.file).name)
    .setDescription("Send welcome message")
    .addUserOption(
      (option: SlashCommandUserOption): SlashCommandUserOption =>
        option.setName("user").setDescription("User to welcome").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts(InteractionContextType.Guild)
    .toJSON()

const showWelcome = async (channel: TextChannel, user: User, name: string): Promise<void> => {
  await channel.send({
    content: userMention(user.id),
    embeds: [
      new EmbedBuilder()
        .setColor(env.COLOR as HexColorString)
        .setAuthor({
          iconURL: user.displayAvatarURL(),
          name: user.displayName
        })
        .setDescription(`# ✨ *Welcome to ${name}!* ✨`)
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

const invoke = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral })

  const user: Nullable<User> = interaction.options.getUser("user")
  if (!user) {
    await interaction.editReply({ content: "❌ Could not get user" })

    return
  }

  if (!interaction.guild) {
    await interaction.editReply({ content: "❌ Could not get guild" })

    return
  }

  const channel: Nullable<Channel> = await interaction.guild.channels.fetch(env.CHANNEL_ID)
  if (!channel) {
    await interaction.editReply({ content: "❌ Could not get channel" })

    return
  }

  await showWelcome(channel as TextChannel, user, interaction.guild.name)

  await interaction.editReply({ content: `-# > ✨ Welcomed \`${user.username}\` to ${interaction.guild.name}` })
}

export { create, invoke, showWelcome }
