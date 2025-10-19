
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { OrderType } from "@/src/types/order/order-type";
import { formatDate } from "../utils";
export const getQuotationFields = ( 
    userDetails: any,
  orderDetails: any,
  customerList: any[],
  packageData: any[],
  findServicePrice: (id: string) => number | undefined
)=> ({
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
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "logo"),
                },
                {
                    key: "companyName",
                    heading: "Studio/Photographer Name",
                    container: "studio-info",
                    description: "The name of the photography studio or photographer",
                    icon: <Feather name="user" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div style="font-weight:bold;">${userDetails?.userBusinessInfo?.companyName}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "companyName"),
                },
                {
                    key: "address",
                    heading: "Studio Address",
                    container: "studio-info",
                    description: "The official address of the studio/photographer",
                    icon: <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>${userDetails?.userBillingInfo?.address}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "address"),
                },
                {
                    key: "contactPhone",
                    heading: "Contact Phone",
                    container: "contact-info",
                    description: "Primary contact phone number",
                    icon: <Feather name="phone" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>📞 ${userDetails?.userBusinessInfo?.businessPhoneNumber}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactPhone"),
                },
                {
                    key: "contactEmail",
                    heading: "Contact Email",
                    container: "contact-info",
                    description: "Primary contact email address",
                    icon: <Feather name="mail" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>✉️ ${userDetails?.userBusinessInfo?.businessEmail}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactEmail"),
                },
                {
                    key: "contactWebsite",
                    heading: "Contact Website",
                    container: "contact-info",
                    description: "Official website link",
                    icon: <Feather name="globe" size={wp("5%")} color="#8B5CF6" />,
                    html: `<div>🌐 ${userDetails?.userBusinessInfo?.websiteURL}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactWebsite"),
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
                    html: `<div class="field"><span>Client Name: </span>${customerList?.find((customer) => customer?.value === orderDetails?.orderBasicInfo?.customerID)?.label}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "clientName"),
                },
                {
                    key: "eventType",
                    heading: "Event Type",
                    container: "card",
                    description: "Type of event (wedding, birthday, corporate, etc.)",
                    icon: <Feather name="camera" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Type: </span> ${orderDetails?.eventInfo?.eventType}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventType"),
                },
                {
                    key: "eventDate",
                    heading: "Event Date & Time",
                    container: "card",
                    description: "Scheduled date and time of the shoot",
                    icon: <Feather name="calendar" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Date & Time: </span>${formatDate(orderDetails?.eventInfo?.eventDate)} : ${orderDetails?.eventInfo?.eventTime}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventDate"),
                },
                {
                    key: "eventLocation",
                    heading: "Event Location",
                    container: "card",
                    description: "Venue or location of the event",
                    icon: <Feather name="map" size={wp("5%")} color="#10B981" />,
                    html: `<div class="field"><span>Event Location: </span>${orderDetails?.eventInfo?.eventLocation}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventLocation"),
                },
                {
                    key: "packageName",
                    heading: "Package Name",
                    container: "card",
                    description: "Photography package selected",
                    icon: <Feather name="package" size={wp("5%")} color="#10B981" />,
                    html: orderDetails?.offeringInfo?.orderType === OrderType.PACKAGE ?
                        `<div class="field"><span>Package:</span>${packageData?.find((p) => p?.id === orderDetails?.offeringInfo?.packageId)?.packageName}</div>` : "",
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "packageName"),
                },
                {
                    key: "pricingTable",
                    heading: "Pricing Table",
                    description: "Breakdown of package and services pricing",
                    icon: <Feather name="dollar-sign" size={wp("5%")} color="#10B981" />,
                    html: `<div class="pricing-container">
                             <div class="pricing-row header-row">
                                <div class="col name heading">Service</div>
                                <div class="col count heading">Qty</div>
                                <div class="col price heading">Unit Price</div>
                                <div class="col total heading">Total</div>
                            </div>
                            ${orderDetails?.offeringInfo?.orderType === OrderType.PACKAGE
                            ? packageData
                                ?.find((p) => p?.id === orderDetails?.offeringInfo?.packageId)
                                ?.serviceList?.map(
                                    (service) => `
                                        <div class="pricing-row">
                                            <div class="col name">${service.name}</div>
                                            <div class="col count">${service.value}</div>
                                            <div class="col price">₹ ${findServicePrice(service.id)}</div>
                                            <div class="col total">₹ ${service.value * (findServicePrice(service.id) ?? 0)}</div>
                                        </div>
                                        `
                                )
                                .join("")
                            : orderDetails?.offeringInfo?.orderType === OrderType.SERVICE
                                ? orderDetails?.offeringInfo?.services?.map(
                                    (service) => `
                                        <div class="pricing-row">
                                            <div class="col name">${service.name}</div>
                                            <div class="col count">${service.value}</div>
                                            <div class="col price">₹ ${findServicePrice(service.id)}</div>
                                            <div class="col total">₹ ${service.value * (findServicePrice(service.id) ?? 0)}</div>
                                        </div>
                                        `
                                )
                                    .join("")
                                : ""}

                            <div class="pricing-row grand-total">
                                <div class="col name heading">Grand Total</div>
                                <div class="col count"></div>
                                <div class="col price"></div>
                                <div class="col total heading">₹ ${orderDetails?.totalPrice}</div>
                            </div>
                            </div>
                            `,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "pricingTable"),
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
                    html: `<div class="card"><span>Terms & Conditions:</span> ${userDetails?.userBusinessInfo?.termsAndConditions}</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "terms"),
                },
                {
                    key: "signature",
                    heading: "Authorized Signature",
                    description: "Signature of the photographer/studio",
                    icon: <Feather name="edit-3" size={wp("5%")} color="#F59E0B" />,
                    html: `<div class="signature-box">Authorized Signature<br/>____________________</div>`,
                    isSelected: orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "signature"),
                },
            ],
        },
    })