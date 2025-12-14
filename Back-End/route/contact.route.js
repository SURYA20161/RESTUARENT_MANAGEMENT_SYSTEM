import express from 'express';
import { sendContactEmail } from '../controller/contact.controller.js';

const router = express.Router();

// POST /contact - Send contact email
router.post('/contact', sendContactEmail);

export default router;
