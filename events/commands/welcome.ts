import { parse } from "node:path"

import {
  type ChatInputCommandInteraction,
  InteractionContextType,
  PermissionFlagsBits,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
  SlashCommandBuilder,
  type SlashCommandUserOption
} from "discord.js"

import { Welcome } from "../../utils/welcome.ts"

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

const invoke = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  await Welcome.welcome(interaction)
}

export { create, invoke }
