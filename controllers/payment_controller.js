import * as PaymentServices from "../services/payment_services.js";
import { successResponse } from "../utils/response.js";
export const createPaymentController = async (req, res, next) => {
    try {

        const collection_request_id = req.params.collection_request_id;
        const user_id = req.user.user_id;
        const payment = await PaymentServices.paymentService(user_id, collection_request_id);
        return successResponse(res, "Payment created successfully", payment, 201);
    } catch (error) {
        return next(error)
    }

}

export const getPaymentHistoryController = async (req, res, next) => {
    try {
        const user_id = req.user.user_id
        const payments = await PaymentServices.getPaymentHistoryService(user_id);
        return successResponse(res, "Payment history fetched successfully", payments, 200);
    } catch (error) {
        return next(error)
    }
}

export const handlePaymobWebhookController = async (req, res) => {
    try {
        await PaymentServices.handlePaymobWebhook(req);

        return res.status(200).json({
            received: true,
        });
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`);
    }
};

const generatePaymentResultHtml = ({ isSuccess, paymentId, transactionId, amount, currency }) => {
  const title = isSuccess ? "Payment Successful" : "Payment Failed";
  const subtitle = isSuccess 
    ? "Thank you! Your payment has been processed successfully." 
    : "Something went wrong with your transaction. Please try again.";
  const icon = isSuccess ? "&#10003;" : "&#10005;";
  const themeColor = isSuccess ? "#2e7d32" : "#d32f2f";
  const bgLight = isSuccess ? "#e8f5e9" : "#ffebee";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f4f6f8; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); max-width: 420px; width: 100%; padding: 32px 24px; text-align: center; }
    .icon-box { width: 72px; height: 72px; background: ${bgLight}; color: ${themeColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; margin: 0 auto 20px; }
    h1 { font-size: 22px; color: #1a1a1a; margin-bottom: 8px; font-weight: 700; }
    p { font-size: 14px; color: #666666; margin-bottom: 24px; line-height: 1.5; }
    .details { background: #f8f9fa; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .detail-row:last-child { margin-bottom: 0; }
    .label { color: #888; font-weight: 500; }
    .value { color: #222; font-weight: 600; word-break: break-all; }
    .btn { display: inline-block; width: 100%; background: ${themeColor}; color: #ffffff; text-decoration: none; padding: 14px; border-radius: 10px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-box">${icon}</div>
    <h1>${title}</h1>
    <p>${subtitle}</p>
    
    <div class="details">
      ${paymentId ? `<div class="detail-row"><span class="label">Payment ID:</span><span class="value">${paymentId}</span></div>` : ''}
      ${transactionId ? `<div class="detail-row"><span class="label">Transaction ID:</span><span class="value">${transactionId}</span></div>` : ''}
      ${amount ? `<div class="detail-row"><span class="label">Amount:</span><span class="value">${amount} ${currency}</span></div>` : ''}
      <div class="detail-row"><span class="label">Status:</span><span class="value" style="color: ${themeColor};">${isSuccess ? 'COMPLETED' : 'FAILED'}</span></div>
    </div>

    <button class="btn" onclick="returnToApp()">Return to App</button>
  </div>

  <script>
    function returnToApp() {
      try {
        window.location.href = "cashfortrash://payment-result?success=${isSuccess}&payment_id=${paymentId || ''}";
      } catch (e) {}

      setTimeout(function() {
        try {
          if (window.opener) {
            window.close();
          } else if (window.history.length > 1) {
            window.history.back();
          }
        } catch(e) {}
      }, 400);
    }
  </script>
</body>
</html>
  `;
};

export const handlePaymobCallbackController = async (req, res) => {
    try {
        const { success, pending, id, amount_cents, currency, merchant_order_id, order } = req.query;
        const isSuccess = success === "true" || success === true;
        const paymentId = merchant_order_id || order || req.query.payment_id;
        const transactionId = id;

        if (isSuccess && paymentId) {
            try {
                await PaymentServices.handleCallbackSuccessFallback(String(paymentId));
            } catch (dbErr) {
                console.error("Callback fallback update notice:", dbErr.message);
            }
        }

        const html = generatePaymentResultHtml({
            isSuccess: isSuccess && pending !== "true",
            paymentId,
            transactionId,
            amount: amount_cents ? (Number(amount_cents) / 100).toFixed(2) : null,
            currency: currency || "EGP",
        });

        res.setHeader("Content-Type", "text/html");
        return res.status(200).send(html);
    } catch (error) {
        return res.status(400).send(`Callback Error: ${error.message}`);
    }   
};