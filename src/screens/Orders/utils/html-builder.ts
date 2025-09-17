export const buildHtml = (invoiceId = "INV-0001", invoiceDate = new Date().toLocaleDateString(),quotationFields: any) => {
        return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
   <style>
        body {
          font-family: 'Inter-Regular', 'Poppins', sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f3f4f6;
          color: #1f2937;
          line-height: 28px;
          font-size: 16px;
        }
        .container {
          max-width: 850px;
          margin: 30px auto;
          background-color: #ffffff;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #e5e7eb;
        }
        .header {
          background-color: #4f46e5;
          color: #ffffff;
          padding: 28px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-radius: 14px;
          font-family: 'Poppins-Bold';
        }
        .studio-info {
          max-width: 65%;
          font-family: 'Poppins-Bold';
        }
        .contact-info {
          text-align: right;
          font-size: 15px;
          color: #ffffff;
          font-family: 'Inter-Regular';
        }
        .metadata {
          display: flex;
          justify-content: space-between;
          padding: 20px;
          background-color: #eef2ff;
          border-radius: 14px;
          margin-top: 20px;
          font-weight: 600;
          color: #1f2937;
          border: 1px solid #c7d2fe;
          font-family: 'Poppins-Bold';
          font-size: 15px;
        }
        .section {
          padding: 24px 20px;
          background-color: #f9fafb;
          border-radius: 14px;
          margin-top: 20px;
          border: 1px solid #e5e7eb;
        }
        h2 {
          margin-bottom: 14px;
          font-size: 24px;
          font-family: 'Poppins-Bold';
          font-weight: 600;
          color: #1f2937;
          border-left: 5px solid #6366f1;
          padding-left: 12px;
        }
        .card {
          background-color: #f0f4ff;
          padding: 18px 20px;
          border-radius: 14px;
          margin-bottom: 14px;
          border: 1px solid #dbeafe;
        }
        .field {
          margin-bottom: 12px;
          font-size: 16px;
          font-family: 'Inter-Regular';
          color: #111827;
        }
        .field span {
          font-weight: 600;
          font-family: 'Poppins-Bold';
          color: #1f2937;
        }
        .pricing-container {
          margin-top: 20px;
          border: 1px solid #e5e7eb;
          border-radius: 14px;
          overflow: hidden;
          background-color: #ffffff;
        }
        .pricing-row {
          display: flex;
          justify-content: space-between;
          padding: 2% 3%;
          border-bottom: 1px solid #e5e7eb;
          font-size: 16px;
          font-family: 'Inter-Regular';
        }
        .desc {
          font-size: 16px;
          font-family: 'Inter-Regular';
          color: #1f2937;
        }
        .heading {
          font-size: 16px;
          font-weight: 600;
          font-family: 'Poppins-Bold';
          color: #1f2937;
        }
        .amount {
          font-size: 16px;
          font-weight: 600;
          font-family: 'Poppins-Bold';
          color: #111827;
        }
        .package-row {
          background-color: #e0e7ff;
          font-weight: 600;
          color: #4338ca;
          font-family: 'Poppins-Bold';
        }
        .sub-service .desc {
          padding-left: 24px;
          font-style: italic;
          color: #6b7280;
          font-family: 'Inter-Regular';
        }
        .total-row {
          background-color: #f3f4f6;
          font-weight: 700;
          font-family: 'Poppins-Bold';
          color: #111827;
        }
        .footer {
          padding: 24px 20px;
          background-color: #f3f4f6;
          font-size: 15px;
          font-family: 'Inter-Regular';
          color: #4b5563;
          text-align: center;
          border-top: 1px solid #e5e7eb;
          margin-top: 30px;
        }
        .signature-box {
          margin-top: 24px;
          padding: 18px;
          border: 2px dashed #d1d5db;
          border-radius: 10px;
          text-align: center;
          color: #6b7280;
          font-style: italic;
          font-family: 'Inter-Regular';
        }
        .grand-total {
          font-weight: bold;
          background-color: #f3f4f6;
          border-top: 2px solid #d1d5db;
          font-family: 'Poppins-Bold';
        }
      </style>
  </head>
    <body>
      <div class="container">
        
        <!-- Header Section -->
        <header class="header">
         ${
            quotationFields.headerSection.fields.some((f:any) => f.container === "studio-info" && f.isSelected)
                ? `<div class="studio-info">
                    ${quotationFields.headerSection.fields
                    .filter((f:any) => f.container === "studio-info" && f.isSelected)
                    .map((f:any) => f.html)
                    .join("")}
                </div>`
                : ''
            }

            ${
            quotationFields.headerSection.fields.some((f:any) => f.container === "contact-info" && f.isSelected)
                ? `<div class="contact-info">
                    ${quotationFields.headerSection.fields
                    .filter((f:any) => f.container === "contact-info" && f.isSelected)
                    .map((f:any) => f.html)
                    .join("")}
                </div>`
                : ''
            }

        </header>

        <!-- Invoice Metadata -->
        <section class="metadata">
          <div><strong>Invoice ID:</strong> ${invoiceId}</div>
          <div><strong>Invoice Date:</strong> ${invoiceDate}</div>
        </section>

        <!-- Body Section -->
            ${quotationFields.bodySection.fields.some((f:any) => f.isSelected)
                        ? `<section class="section">
                ${quotationFields.bodySection.fields
                            .filter((f:any) => f.isSelected)
                            .map((f:any) => f.html)
                            .join("")}
            </section>`
                        : ''
            }



        <!-- Footer Section -->
       ${quotationFields.footerSection.fields.some((f:any) => f.isSelected)
                ? `<footer class="footer">
                ${quotationFields.footerSection.fields
                    .filter((f:any) => f.isSelected)
                    .map((f:any) => f.html)
                    .join("")}
            </footer>`
                : ''
            }


      </div>
    </body>
  </html>
  `;
    };