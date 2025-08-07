const html2pdf = require('html2pdf.js');

const generatePDF = async (htmlContent, userId, resumeId) => {
  try {
    // Check payment status (simplified)
    const paymentRef = await db.collection('payments').where('userId', '==', userId).where('resumeId', '==', resumeId).get();
    const isPaid = !paymentRef.empty && paymentRef.docs[0].data().status === 'completed';

    const opt = {
      filename: `resume-${resumeId}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    if (!isPaid) {
      htmlContent += '<div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:24px;color:#999;opacity:0.5;">Watermark - Pay to Remove</div>';
    }

    return html2pdf().from(htmlContent).set(opt).output('datauristring');
  } catch (err) {
    throw new Error('Failed to generate PDF');
  }
};

module.exports = { generatePDF };