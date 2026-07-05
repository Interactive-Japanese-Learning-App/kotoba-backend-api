import nodemailer from "nodemailer";

export const sendOtpEmail = async (
  email: string,
  otp: string
) => {

  console.log("EMAIL_USER =", process.env.EMAIL_USER);
  console.log("EMAIL_PASS =", process.env.EMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER?.trim(),
      pass: process.env.EMAIL_PASS?.trim(),
    },
  });

  await transporter.sendMail({
    from: `"Kotoba" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verifikasi Akun Kotoba",
    html: `
  <div style="
    font-family: Arial, sans-serif;
    background:#f5f7fb;
    padding:40px 20px;
  ">
    <div style="
      max-width:500px;
      margin:auto;
      background:white;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 4px 12px rgba(0,0,0,0.1);
    ">

      <div style="
        background:#E53935;
        color:white;
        text-align:center;
        padding:25px;
      ">
        <h1 style="margin:0;">Kotoba</h1>
        <p style="margin-top:8px;">
          Aplikasi Belajar Bahasa Jepang
        </p>
      </div>

      <div style="padding:30px;">

        <h2>Verifikasi Email</h2>

        <p>
          Halo! Terima kasih telah mendaftar di Kotoba,
        </p>

        <p>
          Gunakan kode OTP berikut untuk
          menyelesaikan proses verifikasi akun Anda.
        </p>

        <div style="
          text-align:center;
          margin:30px 0;
        ">
          <div style="
            display:inline-block;
            background:#f3f4f6;
            padding:18px 35px;
            border-radius:12px;
            font-size:32px;
            font-weight:bold;
            letter-spacing:8px;
            color:#E53935;
          ">
            ${otp}
          </div>
        </div>

        <p>
          Kode OTP berlaku selama
          <b>1 menit</b>.
        </p>

        <p>
          Jika Anda tidak merasa melakukan
          pendaftaran akun, abaikan email ini.
        </p>

      </div>

      <div style="
        background:#f5f5f5;
        text-align:center;
        padding:15px;
        font-size:12px;
        color:#666;
      ">
        © 2026 Kotoba Learning App
      </div>

    </div>
  </div>
  `,
  });

  console.log("EMAIL BERHASIL DIKIRIM");
};