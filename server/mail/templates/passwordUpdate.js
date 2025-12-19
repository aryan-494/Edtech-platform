const passwordUpdated = (email, name) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Password Update Confirmation</title>
      <style>
        body {
          background-color: #ffffff;
          font-family: Arial, sans-serif;
          font-size: 16px;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          text-align: center;
        }
        .message {
          font-size: 18px;
          font-weight: bold;
        }
        .highlight {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Updated Successfully</h2>
        <p>Hello <b>${name}</b>,</p>
        <p>
          Your password for <span class="highlight">${email}</span> has been
          changed successfully.
        </p>
        <p>If this wasn’t you, please reset your password immediately.</p>
      </div>
    </body>
  </html>`;
};

module.exports = passwordUpdated;
