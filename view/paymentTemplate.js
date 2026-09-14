export const paymentTemplate = (payment) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${payment.title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background-color: #f4f6f8; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; }
    .card { background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); max-width: 420px; width: 100%; padding: 32px 24px; text-align: center; }
    .icon-box { width: 72px; height: 72px; background: ${payment.bgLight}; color: ${payment.themeColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 36px; font-weight: bold; margin: 0 auto 20px; }
    h1 { font-size: 22px; color: #1a1a1a; margin-bottom: 8px; font-weight: 700; }
    p { font-size: 14px; color: #666666; margin-bottom: 24px; line-height: 1.5; }
    .details { background: #f8f9fa; border-radius: 12px; padding: 16px; margin-bottom: 24px; text-align: left; }
    .detail-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .detail-row:last-child { margin-bottom: 0; }
    .label { color: #888; font-weight: 500; }
    .value { color: #222; font-weight: 600; word-break: break-all; }
    .btn { display: inline-block; width: 100%; background: ${payment.themeColor}; color: #ffffff; text-decoration: none; padding: 14px; border-radius: 10px; font-size: 16px; font-weight: 600; border: none; cursor: pointer; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.9; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-box">${payment.icon}</div>
    <h1>${payment.title}</h1>
    <p>${payment.subtitle}</p>

    <div class="details">
      ${payment.paymentId ? `<div class="detail-row"><span class="label">Payment ID:</span><span class="value">${payment.paymentId}</span></div>` : ''}
      ${payment.transactionId ? `<div class="detail-row"><span class="label">Transaction ID:</span><span class="value">${payment.transactionId}</span></div>` : ''}
      ${payment.amount ? `<div class="detail-row"><span class="label">Amount:</span><span class="value">${payment.amount} ${payment.currency}</span></div>` : ''}
      <div class="detail-row"><span class="label">Status:</span><span class="value" style="color: ${payment.themeColor};">${payment.isSuccess ? 'COMPLETED' : 'FAILED'}</span></div>
    </div>

    <button class="btn" onclick="returnToApp()">Return to App</button>
  </div>

  <script>
    function returnToApp() {
      try {
        window.location.href = "cashfortrash://payment-result?success=${payment.isSuccess}&payment_id=${payment.paymentId || ''}";
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