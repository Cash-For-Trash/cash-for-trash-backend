const mailLayout = (title, content) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <style>
          body{
              margin:0;
              padding:0;
              background:#f4f4f4;
              font-family:Arial,sans-serif;
          }

          .container{
              max-width:600px;
              margin:40px auto;
              background:#ffffff;
              border-radius:10px;
              overflow:hidden;
              box-shadow:0 0 10px rgba(0,0,0,.1);
          }

          .header{
              background:#2E7D32;
              color:white;
              padding:25px;
              text-align:center;
          }

          .content{
              padding:30px;
              color:#333;
          }

          .otp{
              background:#f1f8e9;
              color:#2E7D32;
              font-size:32px;
              font-weight:bold;
              text-align:center;
              padding:20px;
              border-radius:8px;
              letter-spacing:6px;
              margin:25px 0;
          }

          .footer{
              background:#fafafa;
              text-align:center;
              color:#777;
              padding:20px;
              font-size:13px;
          }
      </style>
  </head>

  <body>

      <div class="container">

          <div class="header">
              <h1>${title}</h1>
          </div>

          <div class="content">
              ${content}
          </div>

          <div class="footer">
              Cash For Trash © ${new Date().getFullYear()}
          </div>

      </div>

  </body>
  </html>
  `;
};

export const verifyEmailTemplate = (name, otp) => {

  return mailLayout(
    "Verify Your Email",

    `
      <h2>Hello ${name} 👋</h2>

      <p>
        Welcome to <strong>Cash For Trash</strong>.
      </p>

      <p>
        Use the following OTP to verify your email address:
      </p>

      <div class="otp">
        ${otp}
      </div>

      <p>
        This code will expire in
        <strong>10 minutes</strong>.
      </p>

      <p>
        If you didn't create an account, you can safely ignore this email.
      </p>
    `
  );

};

export const resetPasswordTemplate = (name, otp) => {

  return mailLayout(
    "Reset Your Password",

    `
      <h2>Hello ${name} 👋</h2>

      <p>
        We received a request to reset your password for your <strong>Cash For Trash</strong> account.
      </p>

      <p>
        Use the following OTP to reset your password:
      </p>

      <div class="otp">
        ${otp}
      </div>

      <p>
        This code will expire in
        <strong>10 minutes</strong>.
      </p>

      <p>
        If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged.
      </p>
    `
  );

};