import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { formatDate } from "../utils";
import { OrderType } from "@/src/types/order/order-type";
// Factory function
export const getInvoiceFields = (
    userDetails: any,
    invoiceDetails: any,
    orderDetails: any,
) => {
    return {
        headerSection: {
            label: "Header Section",
            icon: <Feather name="layout" size={wp("5%")} color="#8B5CF6" />,
            fields: [
                {
                    key: "logo",
                    heading: "Logo",
                    container: "studio-info",
                    description: "The logo of the photography studio",
                    icon: <Feather name="image" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>
                <img src=${userDetails?.userBusinessInfo?.companyLogoURL} width='50%' height='50' alt="Logo" />
              </div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "logo"),
                },
                {
                    key: "companyName",
                    heading: "Studio/Photographer Name",
                    container: "studio-info",
                    description: "The name of the photography studio or photographer",
                    icon: <Feather name="user" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div style="font-weight:bold;">${userDetails?.userBusinessInfo?.companyName}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "companyName"),
                },
                {
                    key: "address",
                    heading: "Studio Address",
                    container: "studio-info",
                    description: "The official address of the studio/photographer",
                    icon: <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>${userDetails?.userBillingInfo?.address}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "address"),
                },
                {
                    key: "contactPhone",
                    heading: "Contact Phone",
                    container: "contact-info",
                    description: "Primary contact phone number",
                    icon: <Feather name="phone" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>📞 ${userDetails?.userBusinessInfo?.businessPhoneNumber}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "contactPhone"),
                },
                {
                    key: "contactEmail",
                    heading: "Contact Email",
                    container: "contact-info",
                    description: "Primary contact email address",
                    icon: <Feather name="mail" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>✉️ ${userDetails?.userBusinessInfo?.businessEmail}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "contactEmail"),
                },
                {
                    key: "contactWebsite",
                    heading: "Contact Website",
                    container: "contact-info",
                    description: "Official website link",
                    icon: <Feather name="globe" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>🌐 ${userDetails?.userBusinessInfo?.websiteURL}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "contactWebsite"),
                },
            ],
        },

        bodySection: {
            label: "Body Section",
            icon: <Feather name="file-text" size={wp("5%")} color="#10B981" />,
            fields: [
                {
                    key: "clientName",
                    heading: "Client Name",
                    container: "card",
                    description: "Full name of the client",
                    icon: <Feather name="user-check" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Client Name:</span>${orderDetails?.customerInfo?.firstName} ${orderDetails?.customerInfo?.lastName}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "clientName"),
                },
                {
                    key: "eventType",
                    heading: "Event Type",
                    container: "card",
                    description: "Type of event",
                    icon: <Feather name="camera" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Type:</span>${orderDetails?.eventInfo?.eventType}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "eventType"),
                },
                {
                    key: "eventDate",
                    heading: "Event Date & Time",
                    container: "card",
                    description: "Scheduled date and time of the shoot",
                    icon: <Feather name="calendar" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Date & Time:</span>${formatDate(orderDetails?.eventInfo?.eventDate)} : ${orderDetails?.eventInfo?.eventTime}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "eventDate"),
                },
                {
                    key: "eventLocation",
                    heading: "Event Location",
                    container: "card",
                    description: "Venue or location of the event",
                    icon: <Feather name="map" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Location:</span>${orderDetails?.eventInfo?.eventLocation}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "eventLocation"),
                },
                {
                    key: "packageName",
                    heading: "Package Name",
                    container: "card",
                    description: "Photography package selected",
                    icon: <Feather name="package" size={wp("5%")} color="#10B981" />,
                    html:
                        invoiceDetails?.items?.[0]?.itemType === OrderType.PACKAGE
                            ? `<div class="field"><span>Package:</span>${invoiceDetails?.items?.[0]?.itemName}</div>`
                            : "",
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "packageName"),
                },
                {
                    key: "pricingTable",
                    heading: "Pricing Table",
                    description: "Breakdown of package and services pricing",
                    icon: <Feather name="dollar-sign" size={wp("5%")} color="#10B981" />,
                    html: `<div class="pricing-container">
                  <div class="pricing-row header-row">
                    <div class="col name heading">Service Info</div>
                    <div class="col count heading">Date</div>
                    <div class="col price heading">Price</div>
                  </div>
                  <div class="pricing-row" style="flex-wrap">
                  <div 
                  class="col name" 
                  style="white-space: normal; word-wrap: break-word; overflow-wrap: break-word;"
                >
                  ${invoiceDetails?.invoiceDescription}
                </div>
                
                    <div class="col count">${invoiceDetails?.invoiceDate}</div>
                    <div class="col price">${userDetails?.currencyIcon || "$"} ${invoiceDetails?.amountPaid}</div>
                  </div>
                  <div class="pricing-row grand-total">
                    <div class="col name heading">Grand Total</div>
                    <div class="col count"></div>
                    <div class="col price"></div>
                    <div class="col total heading">₹ ${invoiceDetails?.amountPaid}</div>
                  </div>
               </div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "pricingTable"),
                },
            ],
        },

        footerSection: {
            label: "Footer Section",
            icon: <Feather name="file" size={wp("5%")} color="#F59E0B" />,
            fields: [
                {
                    key: "terms",
                    heading: "Terms & Conditions",
                    description: "Payment terms, delivery timeline, rights",
                    icon: <Feather name="file-text" size={wp("5%")} color="#F59E0B" />,
                    html: `<div class="card"><span>Terms & Conditions:</span>${userDetails?.userBusinessInfo?.termsAndConditions || ""}</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "terms"),
                },
                {
                    key: "signature",
                    heading: "Authorized Signature",
                    description: "Signature of the photographer/studio",
                    icon: <Feather name="edit-3" size={wp("5%")} color="#F59E0B" />,
                    html: `<div class="signature-box">Authorized Signature<br/>____________________</div>`,
                    isSelected: invoiceDetails?.quotationHtmlInfo?.some((s) => s?.key === "signature"),
                },
            ],
        },
    };
}
