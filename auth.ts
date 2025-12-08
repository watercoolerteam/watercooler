import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Email from "next-auth/providers/email";
import { sendEmail } from "@/lib/email";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  trustHost: true, // Required for production
  providers: [
    Email({
      server: "", // Empty string to disable nodemailer
      from: process.env.EMAIL_FROM || "Watercooler <onboarding@resend.dev>",
      sendVerificationRequest: async ({ identifier, url }) => {
        await sendEmail({
          to: identifier,
          subject: "Sign in to Watercooler",
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
                  <p style="font-size: 18px; margin-top: 0;">Click the button below to sign in to your Watercooler account:</p>
                  
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
});
