import { sendMail } from './services/emailService.js';

async function testEmail() {
  try {
    await sendMail('ravichandransurya040@gmail.com', 'Test Email', '<h1>This is a test email</h1>');
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Failed to send test email:', error.message);
  }
}

testEmail();
