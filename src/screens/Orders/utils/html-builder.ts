export const buildHtml = (invoiceId = "INV-0001", invoiceDate = new Date().toLocaleDateString(), quotationFields: any, type: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
  <style>
  /* ------------ GLOBAL RESET ------------ */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', 'Poppins', sans-serif;
    background-color: #f8f9fc;
    color: #1e293b;
    line-height: 1.6;
    padding: 32px 0;
  }

  .container {
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 20px;
    padding: 40px 36px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
  }

  /* ------------ HEADER ------------ */
  .header {
    background: linear-gradient(135deg, #4338ca, #4f46e5);
    padding: 30px 28px;
    border-radius: 16px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
  }

  .studio-info {
    font-family: 'Poppins-Bold';
    font-size: 20px;
    max-width: 70%;
    line-height: 1.4;
  }

  .contact-info {
    text-align: right;
    font-size: 14px;
    opacity: 0.9;
    line-height: 1.5;
  }

  /* ------------ INVOICE METADATA ------------ */
  .metadata {
    margin-top: 24px;
    padding: 20px 24px;
    background-color: #eef2ff;
    border-radius: 14px;
    border: 1px solid #c7d2fe;
    display: flex;
    justify-content: space-between;
    font-family: 'Inter';
    font-weight: 600;
    font-size: 15px;
    color: #1e293b;
  }

  /* ------------ SECTIONS ------------ */
  .section {
    margin-top: 32px;
    padding: 28px 24px;
    background: #fafbff;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
  }

  h2 {
    font-family: 'Poppins-Bold';
    font-size: 22px;
    color: #1e293b;
    margin-bottom: 18px;
    border-left: 5px solid #6366f1;
    padding-left: 14px;
  }

  .card {
    background: #f1f5ff;
    border: 1px solid #dbeafe;
    padding: 20px;
    border-radius: 14px;
    margin-bottom: 16px;
  }

  .field {
    margin-bottom: 12px;
    font-size: 16px;
    color: #1e293b;
    font-family: 'Inter';
  }

  .field span {
    font-family: 'Poppins-Bold';
    font-weight: 600;
    color: #1e293b;
  }

  /* ------------ PRICING TABLE ------------ */
  .pricing-container {
    margin-top: 24px;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
  }

  .pricing-row {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    padding: 14px 20px;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    font-size: 15px;
    font-family: 'Inter';
  }

  .pricing-row.header-row {
    background: #eef2ff;
    font-family: 'Poppins-Bold';
    font-weight: 600;
    color: #1e293b;
  }

  .pricing-row .col {
    padding: 4px 8px;
    word-break: break-word;
  }

  .package-row {
    background: #e0e7ff;
    color: #4338ca;
    font-family: 'Poppins-Bold';
    font-weight: 600;
  }

  .sub-service .desc {
    padding-left: 32px;
    font-style: italic;
    font-size: 14px;
    color: #64748b;
  }

  .total-row {
    background: #f8fafc;
    font-family: 'Poppins-Bold';
    font-weight: 700;
  }

  /* GRAND TOTAL */
  .grand-total {
    background: #f1f5f9;
    border-top: 2px solid #cbd5e1;
    font-family: 'Poppins-Bold';
    font-size: 18px;
    padding: 18px 20px;
    color: #1e293b;
  }

  /* ------------ FOOTER ------------ */
  .footer {
    margin-top: 40px;
    text-align: center;
    padding: 24px 20px;
    background: #f8fafc;
    color: #475569;
    border-top: 1px solid #e2e8f0;
    font-size: 15px;
  }

  .signature-box {
    margin-top: 24px;
    padding: 22px;
    border: 2px dashed #cbd5e1;
    border-radius: 12px;
    font-style: italic;
    color: #64748b;
    font-size: 15px;
  }

  /* ------------ RESPONSIVE ------------ */
  @media (max-width: 700px) {
    .pricing-row {
      grid-template-columns: 1fr 1fr;
      row-gap: 12px;
    }
    .metadata {
      flex-direction: column;
      gap: 6px;
      text-align: left;
    }
    .header {
      flex-direction: column;
      align-items: flex-start;
      gap: 18px;
    }
    .contact-info {
      text-align: left !important;
    }
  }
</style>

  </head>
    <body>
      <div class="container">
        
        <!-- Header Section -->
        ${quotationFields.headerSection.fields.some(
    (f: any) =>
      (f.container === "studio-info" || f.container === "contact-info") && f.isSelected
  )
      ? `<header class="header">
                ${quotationFields.headerSection.fields.some((f: any) => f.container === "studio-info" && f.isSelected)
        ? `<div class="studio-info">
                        ${quotationFields.headerSection.fields
          .filter((f: any) => f.container === "studio-info" && f.isSelected)
          .map((f: any) => f.html)
          .join("")}
                      </div>`
        : ''
      }
                ${quotationFields.headerSection.fields.some((f: any) => f.container === "contact-info" && f.isSelected)
        ? `<div class="contact-info">
                        ${quotationFields.headerSection.fields
          .filter((f: any) => f.container === "contact-info" && f.isSelected)
          .map((f: any) => f.html)
          .join("")}
                      </div>`
        : ''
      }
              </header>`
      : ''
    }
        

        <!-- Invoice Metadata -->
        <section class="metadata">
          <div><strong>${type} ID:</strong> ${invoiceId}</div>
          <div><strong>${type} Date:</strong> ${invoiceDate}</div>
        </section>

        <!-- Body Section -->
            ${quotationFields.bodySection.fields.some((f: any) => f.isSelected)
      ? `<section class="section">
                ${quotationFields.bodySection.fields
        .filter((f: any) => f.isSelected)
        .map((f: any) => f.html)
        .join("")}
            </section>`
      : ''
    }



        <!-- Footer Section -->
       ${quotationFields.footerSection.fields.some((f: any) => f.isSelected)
      ? `<footer class="footer">
                ${quotationFields.footerSection.fields
        .filter((f: any) => f.isSelected)
        .map((f: any) => f.html)
        .join("")}
            </footer>`
      : ''
    }


      </div>
    </body>
  </html>
  `;
};