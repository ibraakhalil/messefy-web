import { Auth } from "@auth/core"
import Google from "@auth/core/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "./db"

export const authHandler = (req: Request) =>
  Auth(req, {
    adapter: DrizzleAdapter(db),
    providers: [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: { params: { prompt: "consent", access_type: "offline", response_type: "code" }},
      }),
    ],
    secret: process.env.AUTH_SECRET,
    session: { strategy: "database" },
  })
