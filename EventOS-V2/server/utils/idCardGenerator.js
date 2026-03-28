const html_to_pdf = require('html-pdf-node');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

const generateIdCard = async (user, event, role) => {
  try {
    const htmlContent = `
      <div style="font-family: sans-serif; width: 400px; padding: 20px; border: 2px solid #1a1a1a; border-radius: 10px; background: #fafafa;">
        <h2 style="color: #1a1a1a; margin-top: 0;">EventOS V2</h2>
        <div style="background: #1a1a1a; color: white; padding: 5px 10px; border-radius: 5px; display: inline-block; font-size: 12px; text-transform: uppercase; margin-bottom: 20px;">
          ${role} PASS
        </div>
        <h3 style="margin: 0; font-size: 24px;">${user.name}</h3>
        <p style="color: #6b6b6b; margin-top: 5px;">${user.email || 'Registered User'}</p>
        <hr style="border: none; border-top: 1px dashed #e5e5e5; margin: 20px 0;" />
        <p style="font-size: 12px; color: #1a1a1a; font-weight: bold;">Valid only for officially registered events.</p>
      </div>
    `;

    const options = { format: 'A4' };
    const file = { content: htmlContent };
    
    // Generate PDF buffer
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    
    // If not in prod or using mock credentials, just return a mock URL to prevent crash
    if (process.env.CLOUDINARY_CLOUD_NAME === 'mock' || !process.env.CLOUDINARY_CLOUD_NAME) {
      return "https://res.cloudinary.com/eventos/image/upload/mock-attendee-id.pdf";
    }

    // Upload buffer to Cloudinary
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'eventos/id_cards', resource_type: 'raw' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      streamifier.createReadStream(pdfBuffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("ID Card Generation Error:", error);
    return "https://res.cloudinary.com/eventos/image/upload/fallback-id.pdf";
  }
};

module.exports = { generateIdCard };
