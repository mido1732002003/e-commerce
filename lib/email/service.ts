import 'server-only'

interface EmailOptions {
  to: string
  subject: string
  html: string
  from?: string
}

class EmailService {
  private provider: 'resend' | 'brevo'
  private from: string

  constructor() {
    this.provider = (process.env.EMAIL_PROVIDER as 'resend' | 'brevo') || 'resend'
    this.from = process.env.EMAIL_FROM || 'NextShop <noreply@example.com>'
  }

  async send(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
    try {
      if (this.provider === 'resend') {
        return await this.sendWithResend(options)
      } else {
        return await this.sendWithBrevo(options)
      }
    } catch (error) {
      console.error('Email send error:', error)
      return { success: false, error: 'Failed to send email' }
    }
  }

  private async sendWithResend(options: EmailOptions) {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: options.from || this.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  }

  private async sendWithBrevo(options: EmailOptions) {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { email: this.parseEmail(options.from || this.from) },
        to: [{ email: options.to }],
        subject: options.subject,
        htmlContent: options.html,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      return { success: false, error }
    }

    return { success: true }
  }

  private parseEmail(email: string): string {
    const match = email.match(/<(.+)>/)
    return match ? match[1] : email
  }

  async sendOrderConfirmation(order: any) {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .order-details { background-color: #f8f9fa; padding: 15px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Order Confirmation</h1>
              <p>Thank you for your order!</p>
            </div>
            <div class="content">
              <p>Hi ${order.shipping_address?.name || 'Customer'},</p>
              <p>We've received your order and will process it soon.</p>
              
              <div class="order-details">
                <h2>Order #${order.id}</h2>
                <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
                <p><strong>Total:</strong> $${(order.total_cents / 100).toFixed(2)}</p>
                <p><strong>Payment Method:</strong> ${order.payment_method.toUpperCase()}</p>
                <p><strong>Status:</strong> ${order.status}</p>
              </div>
              
              <h3>Shipping Address</h3>
              <p>
                ${order.shipping_address?.name}<br>
                ${order.shipping_address?.address}<br>
                ${order.shipping_address?.city}, ${order.shipping_address?.state} ${order.shipping_address?.zip}<br>
                ${order.shipping_address?.country}
              </p>
              
              <p>We'll send you another email when your order ships.</p>
            </div>
            <div class="footer">
              <p>© 2024 NextShop. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `

    return await this.send({
      to: order.contact_email,
      subject: `Order Confirmation - #${order.id}`,
      html,
    })
  }
}

export const emailService = new EmailService()