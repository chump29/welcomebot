// biome-ignore-all lint/nursery/useLowercaseTestTitle: using env names

import { describe, expect, test } from "bun:test"

import { type HexColorString } from "discord.js"
import { expectTypeOf } from "expect-type"

import { env } from "../../utils/env.ts"

describe("env", (): void => {
  test("ACTIVITY", (): void => {
    expect(env.ACTIVITY).toBeString()

    expect(env.ACTIVITY.length).toBeGreaterThan(0)
  })

  test("CHANNEL_ID", (): void => {
    expect(env.CHANNEL_ID).toBeString()

    expect(env.CHANNEL_ID.length).toBeGreaterThan(0)
  })

  test("COLOR", (): void => {
    expectTypeOf(env.COLOR).toEqualTypeOf<HexColorString>()

    expect(env.COLOR).toBe("#78866b")
  })

  test("DEBUG", (): void => {
    expect(env.DEBUG).toBeBoolean()

    expect(env.DEBUG).toBeTrue()
  })

  test("LOGO_NAME", (): void => {
    expect(env.LOGO_NAME).toBeString()

    expect(env.LOGO_NAME).toBe("welcomebot.webp")
  })

  test("LOGO_PATH", (): void => {
    expect(env.LOGO_PATH).toBeString()

    expect(env.LOGO_PATH).toBe("./utils/images")
  })

  test("LOGO_PORT", (): void => {
    expectTypeOf(env.LOGO_PORT).toEqualTypeOf<number | "random">()

    expect(env.LOGO_PORT).toBe("random")
  })

  test("LOGO_URL", (): void => {
    expect(env.LOGO_URL).toBeString()

    expect(env.LOGO_URL.length).toBeGreaterThan(0)
  })

  test("LOGO2_NAME", (): void => {
    expect(env.LOGO2_NAME).toBeString()

    expect(env.LOGO2_NAME).toBe("welcome.webp")
  })

  test("LOGO2_PATH", (): void => {
    expect(env.LOGO_PATH).toBeString()

    expect(env.LOGO_PATH).toBe("./utils/images")
  })

  test("LOGO2_URL", (): void => {
    expect(env.LOGO_URL).toBeString()

    expect(env.LOGO_URL.length).toBeGreaterThan(0)
  })

  test("NAME", (): void => {
    expect(env.NAME).toBeString()

    expect(env.NAME).toBe("WelcomeBot")
  })

  test("TEST_FULL", (): void => {
    expect(env.TEST_FULL).toBeBoolean()
  })

  test("TOKEN", (): void => {
    expect(env.TOKEN).toBeString()

    expect(env.TOKEN.length).toBeGreaterThan(0)
  })
})
