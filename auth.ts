import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Email from "next-auth/providers/email";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { sendEmail } from "@/lib/email";
import { comparePassword, hashPassword } from "@/lib/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for production
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            accounts: {
              where: { provider: "credentials" },
            },
          },
        });

        if (!user || !user.accounts[0]) {
          return null;
        }

        // Get password hash from account (stored in access_token field as workaround)
        const account = user.accounts[0];
        const passwordHash = account.access_token;

        if (!passwordHash) {
          return null;
        }

        const isValid = await comparePassword(
          credentials.password as string,
          passwordHash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
    Email({
      // Provide minimal server config to satisfy NextAuth validation
      // We override sendVerificationRequest to use Resend instead
      server: {
        host: "smtp.resend.com",
        port: 465,
        auth: {
          user: "resend",
          pass: process.env.RESEND_API_KEY || "",
        },
      },
      from: process.env.EMAIL_FROM || "Watercooler <onboarding@resend.dev>",
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendEmail({
          to: identifier,
          subject: "Sign in to Watercooler",
          disableClickTracking: true, // Disable click tracking to avoid Google Safe Browsing warnings
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(to bottom, #111827, #1f2937); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 28px;">Sign in to Watercooler</h1>
                </div>
                
                <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                  <p style="font-size: 18px; margin-top: 0;">Click the button below to sign in to your Watercooler account. If you don't have an account yet, we'll create one for you automatically.</p>
                  
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${url}" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Sign In</a>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${url}" style="color: #111827; word-break: break-all;">${url}</a>
                  </p>
                  
                  <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                    This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
                  </p>
                </div>
                
                <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
                  <p>This email was sent from Watercooler - A public directory of early-stage startups</p>
                </div>
              </body>
            </html>
          `,
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, email }) {
      // Allow sign-in - NextAuth will create user if they don't exist
      return true;
    },
    async redirect({ url, baseUrl }) {
      // After successful sign-in, redirect to dashboard instead of sign-in page
      if (url.startsWith("/")) {
        // Relative URL - check if it's the sign-in page
        if (url === "/auth/signin" || url.startsWith("/auth/signin")) {
          return `${baseUrl}/dashboard`;
        }
        return `${baseUrl}${url}`;
      }
      // If URL is on same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      // Default to dashboard
      return `${baseUrl}/dashboard`;
    },
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  session: {
    strategy: "database",
  },
  debug: process.env.NODE_ENV === "development",
});
