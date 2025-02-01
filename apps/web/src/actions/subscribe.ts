"use server"

import wretch from "wretch"
import { createServerAction } from "zsa"
import { env } from "~/env"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { newsletterSchema } from "~/server/schemas"
import { isDisposableEmail } from "~/utils/helpers"

/**
 * Subscribe to the newsletter
 * @param input - The newsletter data to subscribe to
 * @returns The newsletter that was subscribed to
 */
export const subscribeToNewsletter = createServerAction()
  .input(newsletterSchema)
  .handler(async ({ input: json }) => {
    const ip = await getIP()

    // Rate limiting check
    if (await isRateLimited(ip, "newsletter")) {
      throw new Error("Too many attempts. Please try again later.")
    }

    // Disposable email check
    if (await isDisposableEmail(json.email)) {
      throw new Error("Invalid email address, please use a real one")
    }

    const url = `https://api.beehiiv.com/v2/publications/${env.BEEHIIV_PUBLICATION_ID}/subscriptions`

    try {
      const { data } = await wretch(url)
        .auth(`Bearer ${env.BEEHIIV_API_KEY}`)
        .post(json)
        .json<{ data: { status: string } }>()

      if (data?.status === "pending") {
        return "You've been subscribed to the newsletter, please check your email for confirmation."
      }

      return "You've been subscribed to the newsletter."
    } catch (error) {
      throw new Error("Failed to subscribe to newsletter. Please try again later.")
    }
  })
