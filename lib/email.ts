import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set - email not sent:', options);
    return { success: false, error: 'Email service not configured' };
  }

  try {
    console.log('📧 Attempting to send email to:', options.to);
    console.log('📧 Subject:', options.subject);
    
    const fromAddress = options.from || process.env.EMAIL_FROM || 'Watercooler <onboarding@resend.dev>';
    console.log('📧 From:', fromAddress);

    const result = await resend.emails.send({
      from: fromAddress,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });

    if (result.error) {
      console.error('❌ Resend API error:', result.error);
      return { 
        success: false, 
        error: result.error.message || 'Failed to send email',
        details: result.error 
      };
    }

    console.log('✅ Email sent successfully! ID:', result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error: any) {
    console.error('❌ Error sending email:', error);
    
    // Log full error details
    if (error?.error) {
      console.error('Resend error details:', JSON.stringify(error.error, null, 2));
    }
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    return { 
      success: false, 
      error: error?.error?.message || error?.message || 'Unknown error',
      details: error 
    };
  }
}

/**
 * Send approval email to founder
 */
export async function sendApprovalEmail(founderEmail: string, startupName: string, startupSlug: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const startupUrl = `${siteUrl}/startup/${startupSlug}`;

  return sendEmail({
    to: founderEmail,
    subject: `🎉 Your startup "${startupName}" has been approved on Watercooler!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to bottom, #111827, #1f2937); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          </div>
          
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; margin-top: 0;">Great news! Your startup <strong>${startupName}</strong> has been approved and is now live on Watercooler.</p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0 0 15px 0;"><strong>What's next?</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Your startup is now visible to scouts, investors, and operators</li>
                <li>Share your profile to get more visibility</li>
                <li>Claim your startup page to edit it later</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${startupUrl}" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">View Your Startup Profile</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Want to claim your startup page to edit it? 
              <a href="${siteUrl}/claim" style="color: #111827; text-decoration: underline;">Click here to claim it</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent from Watercooler - A public directory of early-stage startups</p>
            <p><a href="${siteUrl}" style="color: #6b7280;">Visit Watercooler</a></p>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send rejection email to founder
 */
export async function sendRejectionEmail(founderEmail: string, startupName: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return sendEmail({
    to: founderEmail,
    subject: `Update on your "${startupName}" submission to Watercooler`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to bottom, #111827, #1f2937); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Update on Your Submission</h1>
          </div>
          
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; margin-top: 0;">Thank you for submitting <strong>${startupName}</strong> to Watercooler.</p>
            
            <p>Unfortunately, we're not able to approve your submission at this time. This could be due to various reasons including:</p>
            
            <ul style="margin: 20px 0;">
              <li>Incomplete information</li>
              <li>Doesn't meet our current criteria</li>
              <li>Duplicate submission</li>
            </ul>
            
            <p>If you believe this was a mistake or would like to resubmit with additional information, please feel free to submit again.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}/submit" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Submit Again</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              Thank you for your interest in Watercooler.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent from Watercooler - A public directory of early-stage startups</p>
            <p><a href="${siteUrl}" style="color: #6b7280;">Visit Watercooler</a></p>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send submission confirmation email
 */
export async function sendSubmissionConfirmationEmail(
  founderEmail: string,
  founderNames: string,
  startupName: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return sendEmail({
    to: founderEmail,
    subject: `Your startup "${startupName}" has been submitted to Watercooler`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to bottom, #111827, #1f2937); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Submission Received! 🎉</h1>
          </div>
          
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; margin-top: 0;">Hi ${founderNames},</p>
            
            <p>Thank you for submitting <strong>${startupName}</strong> to Watercooler! We've received your submission and it's currently <strong>pending review</strong>.</p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; font-weight: 600; color: #92400e;">⏳ Status: Pending Review</p>
              <p style="margin: 8px 0 0 0; font-size: 14px; color: #78350f;">Our team will review your submission and notify you once it's been approved.</p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0 0 15px 0; font-weight: 600;">What happens next?</p>
              <ul style="margin: 0; padding-left: 20px; color: #4b5563;">
                <li>Our team reviews all submissions to ensure quality</li>
                <li>You'll receive an email when your startup is approved</li>
                <li>Once approved, your startup will be visible to scouts, investors, and operators</li>
                <li>You can claim your startup page to edit it later</li>
              </ul>
            </div>
            
            <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #1e40af;">💡 Pro Tip</p>
              <p style="margin: 0; font-size: 14px; color: #1e3a8a;">
                Once your startup is approved, you can claim your page to edit information, update your logo, and manage your profile. Keep an eye on your inbox for the approval email!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}/browse" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Browse Other Startups</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              <strong>Questions?</strong> If you need to update your submission or have any questions, please reply to this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent from Watercooler - A public directory of early-stage startups</p>
            <p><a href="${siteUrl}" style="color: #6b7280;">Visit Watercooler</a></p>
          </div>
        </body>
      </html>
    `,
  });
}

/**
 * Send claim verification email with token link
 */
export async function sendClaimEmail(
  founderEmail: string,
  startups: Array<{ name: string; slug: string }>,
  token: string
) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const verificationUrl = `${siteUrl}/claim/verify?token=${token}`;
  
  const startupList = startups.map(s => `<li><strong>${s.name}</strong></li>`).join('');

  return sendEmail({
    to: founderEmail,
    subject: `Claim your startup${startups.length > 1 ? 's' : ''} on Watercooler`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(to bottom, #111827, #1f2937); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Claim Your Startup${startups.length > 1 ? 's' : ''}</h1>
          </div>
          
          <div style="background: white; padding: 40px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="font-size: 18px; margin-top: 0;">We found the following startup${startups.length > 1 ? 's' : ''} associated with your email:</p>
            
            <ul style="font-size: 16px; margin: 20px 0;">
              ${startupList}
            </ul>
            
            <p>To claim and manage your startup${startups.length > 1 ? 's' : ''}, please click the button below to verify your email address.</p>
            
            <div style="background: #eff6ff; border-left: 4px solid #3b82f6; padding: 16px; margin: 30px 0; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>⏰ This link expires in 24 hours</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="display: inline-block; background: #111827; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Verify Email & Claim Startup${startups.length > 1 ? 's' : ''}</a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              If the button doesn't work, copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #111827; word-break: break-all;">${verificationUrl}</a>
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>This email was sent from Watercooler - A public directory of early-stage startups</p>
            <p><a href="${siteUrl}" style="color: #6b7280;">Visit Watercooler</a></p>
          </div>
        </body>
      </html>
    `,
  });
}

