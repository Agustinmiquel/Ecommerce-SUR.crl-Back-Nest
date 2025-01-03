import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';

async function generateInvoicePdf() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

  const { width, height } = page.getSize();
  page.drawText('Remito', {
    x: 50,
    y: height - 150,
    size: 20,
    color: rgb(0, 0.51, 0.71),
  });

  page.drawText('Detalles del remito aqui...', {
    x: 50,
    y: height - 150,
    size: 20,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('remito.pdf', pdfBytes);
}

generateInvoicePdf();
