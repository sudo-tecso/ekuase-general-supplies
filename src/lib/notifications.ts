import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOrderConfirmationEmail = async (email: string, orderData: any) => {
  try {
    await resend.emails.send({
      from: "Ekuase General Supplies <orders@ekuasegs.com>", // Note: requires domain verification in production
      to: email,
      subject: `Order Confirmed - #${orderData.id}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="color: #ff5c00;">Order Confirmed!</h1>
          <p>Thank you for your purchase from Ekuase General Supplies.</p>
          <h3>Order Details:</h3>
          <p>Order ID: ${orderData.id}</p>
          <p>Total Amount: GHS ${orderData.totalAmount}</p>
          <hr />
          <p>We are preparing your delivery.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
  }
};

export const sendTicketEmail = async (email: string, ticketData: any) => {
  try {
    await resend.emails.send({
      from: "Ekuase General Supplies <tickets@ekuasegs.com>",
      to: email,
      subject: `Your Pickup Ticket is Ready - ${ticketData.ticketCode}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; text-align: center;">
          <h1 style="color: #ff5c00;">Your Ticket is Ready!</h1>
          <p>Present this ticket at the Ekuase General Supplies warehouse to complete your purchase.</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h2 style="font-family: monospace; font-size: 32px; letter-spacing: 5px;">${ticketData.ticketCode}</h2>
          </div>
          <p>This ticket expires in 48 hours.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Ticket email failed:", error);
  }
};
