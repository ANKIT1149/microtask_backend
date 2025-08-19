import express, { text } from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const app = express();

app.use(express.json());
app.use(cors({ origin: '*' }));

dotenv.config();

app.get('/', (req, res) => {
  res.send('Hello Welcome To Nodemailer Route');
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`Port is running on ${process.env.PORT}`);
});

app.post('/sendmail', async (req, res) => {
  try {
    const { to, subject, body, attachment } = req.body;

    if (!to || !subject || !body) {
      return res
        .status(400)
        .json({ success: 'false', message: 'Please provide all field' });
    }

    console.log(to, subject, body, attachment);

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOPtions = {
      from: `"Microtasker" ${process.env.SMTP_USER}`,
      to: to,
      subject: subject,
      text: body,
      attachments: attachment
        ? [
            {
              filename: attachment.filename || 'invoice.pdf',
              path: attachment,
            },
          ]
        : [],
    };

    const info = await transport.sendMail(mailOPtions);

    return res.status(200).json({ success: true, info });
  } catch (error) {
    console.error('Failed to send email:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send email',
      error: error.message,
    });
  }
});

app.post('/client_sendmail', async (req, res) => {
  try {
    const { to, subject, body } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields',
      });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      secure: false,
    });

    const mailOptions = {
      from: `"Microtasker" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      text: body,
    };

    return res.status(200).json({ success: true, info });

  } catch (error) {
    console.log('Error in client_sendMail:', error);
    return res.status(500).json({
      success: false,
      message: 'failed to send email',
      error: error.message,
    });
  }
});

app.post('/generate_token', async (req, res) => {
  try {
    const { user, clientId } = req.body;
    if (!user || !clientId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields',
      });
    }

    const payload = {
      userId: user,
      clientId: clientId
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '4d' })
    
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (error) {
    console.log('Error in generating token:', error);
    return res.status(500).json({
      success: false,
      message: 'failed to generate token',
      error: error.message,
    });
  }
});

app.get('/get_secret_key', (req, res) => {
  res.json({
    API_KEY: process.env.API_KEY,
    BASE_URL: process.env.BASE_URL,
    HUGGINGFACE_API_TOKEN: process.env.HUGGINGFACE_API_TOKEN,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,

    B2_APPLICATION_KEY_ID: process.env.B2_APPLICATION_KEY_ID,
    B2_APPLICATION_KEY: process.env.B2_APPLICATION_KEY,
    B2_BUCKET_NAME: process.env.B2_BUCKET_NAME,
    B2_BUCKET_ID: process.env.B2_BUCKET_ID,
    B2_API_URL: process.env.B2_API_URL,

    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
    FIREBASE_SENDER_ID: process.env.FIREBASE_SENDER_ID,
    FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    FIREBASE_MEASUREMENT_APP_ID: process.env.FIREBASE_MEASUREMENT_APP_ID,

    EMAIL_ADDRESS: process.env.EMAIL_ADDRESS,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    BASE_DOWNLOAD_URL: process.env.BASE_DOWNLOAD_URL,
    FCM_SERVER_KEY: process.env.FCM_SERVER_KEY,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  });
});
