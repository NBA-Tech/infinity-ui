import React, { useContext, useEffect, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import Modal from 'react-native-modal';
import TemplatePreview from '../components/template-preview';
import { formatDate } from '@/src/utils/utils';
import { OrderModel, OrderType, QuotaionHtmlInfo } from '@/src/types/order/order-type';
import { UserModel } from '@/src/types/user/user-type';
import { useUserStore } from '@/src/store/user/user-store';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { ApiGeneralRespose } from '@/src/types/common';
import { getUserDetailsApi } from '@/src/services/user/user-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { PackageModel, ServiceModel } from '@/src/types/offering/offering-type';
import { buildHtml } from '../utils/html-builder';

const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
        borderWidth: 1,
        borderColor: '#000'
    }
})

type QuotationDetailsProps = {
    htmlTemplate: QuotaionHtmlInfo[];
    serviceData: ServiceModel[];
    packageData:PackageModel[];
    orderDetails: OrderModel;
    createdOn: Date;

}
const QuotationDetails = (props: QuotationDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [open, setOpen] = useState(false);
    const [userDetails, setUserDetails] = useState<UserModel | null>(null);
    const showToast  = useToastMessage();
    const { getUserDetails } = useUserStore();
    const { getItem } = useDataStore();

    const actionButtons = [
        {
            id: 1,
            label: 'Share',
            icon: <Feather name="share-2" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        },
        {
            id: 2,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        },
    ]


    const getUserDetailsUsingID = async (userID: string) => {
        let userDetails = getUserDetails()
        if (!userDetails) {
            const userDetailsApi: ApiGeneralRespose = await getUserDetailsApi(userID)
            if (!userDetailsApi?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message: userDetailsApi?.message ?? "Something went wrong",
                })
            }
            else {
                setUserDetails(userDetailsApi.data)
            }
        }
        else{
            setUserDetails(userDetails)
        }

    }
    const findServicePrice = (serviceId: string) => {
        const service = props?.serviceData.find((service) => service.id === serviceId)
        return service?.price
    }


    useEffect(() => {
        const userID= getItem("USERID")
        getUserDetailsUsingID(userID)
    }, [])
    const quotationFields = {
        headerSection: {
            fields: [
                {
                    key: "logo",
                    container: "studio-info",
                    html: `<div>
                        <img src=${userDetails?.userBusinessInfo?.companyLogoURL} width='50%' height='50' alt="Logo" />
                        </div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "logo"),
                },
                {
                    key: "companyName",
                    container: "studio-info",
                    html: `<div style="font-weight:bold;">${userDetails?.userBusinessInfo?.companyName}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "companyName"),
                },
                {
                    key: "address",
                    container: "studio-info",
                    html: `<div>${userDetails?.userBillingInfo?.address}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "address"),
                },
                {
                    key: "contactPhone",
                    container: "contact-info",
                    html: `<div>📞 ${userDetails?.userBusinessInfo?.businessPhoneNumber}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactPhone"),
                },
                {
                    key: "contactEmail",
                    container: "contact-info",
                    html: `<div>✉️ ${userDetails?.userBusinessInfo?.businessEmail}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactEmail"),
                },
                {
                    key: "contactWebsite",
                    container: "contact-info",
                    html: `<div>🌐 ${userDetails?.userBusinessInfo?.websiteURL}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "contactWebsite"),
                },
            ],
        },

        bodySection: {
            fields: [
                {
                    key: "clientName",
                    container: "card",
                    // html: `<div class="field"><span>Client Name:</span>${customerList?.find((customer) => customer?.value === props?.orderDetails?.orderBasicInfo?.customerID)?.label}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "clientName"),
                },
                {
                    key: "eventType",
                    container: "card",
                    html: `<div class="field"><span>Event Type:</span> ${props?.orderDetails?.eventInfo?.eventType}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventType"),
                },
                {
                    key: "eventDate",
                    container: "card",
                    html: `<div class="field"><span>Event Date & Time:</span>${props?.orderDetails?.eventInfo?.eventDate} : ${props?.orderDetails?.eventInfo?.eventTime}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventDate"),
                },
                {
                    key: "eventLocation",
                    container: "card",
                    html: `<div class="field"><span>Event Location:</span>${props?.orderDetails?.eventInfo?.eventLocation}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "eventLocation"),
                },
                {
                    key: "packageName",
                    container: "card",
                    html: props?.orderDetails?.offeringInfo?.orderType === OrderType.PACKAGE ?
                        `<div class="field"><span>Package:</span>${props?.packageData?.find((p) => p?.id === props?.orderDetails?.offeringInfo?.packageId)?.packageName}</div>` : "",
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "packageName"),
                },
                {
                    key: "pricingTable",
                    html: `<div class="pricing-container">
                                 <div class="pricing-row header-row">
                                    <div class="col name heading">Service</div>
                                    <div class="col count heading">Qty</div>
                                    <div class="col price heading">Unit Price</div>
                                    <div class="col total heading">Total</div>
                                </div>
                                ${props?.orderDetails?.offeringInfo?.orderType === OrderType.PACKAGE
                            ? props?.packageData
                                ?.find((p) => p?.id === props?.orderDetails?.offeringInfo?.packageId)
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
                            : props?.orderDetails?.offeringInfo?.orderType === OrderType.SERVICE
                                ? props?.orderDetails?.offeringInfo?.services?.map(
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
                                    <div class="col total heading">₹ ${props?.orderDetails?.totalPrice}</div>
                                </div>
                                </div>
                                `,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "pricingTable"),
                },
            ],
        },

        footerSection: {
            fields: [
                {
                    key: "terms",
                    html: `<div class="card"><span>Terms & Conditions:</span> {{terms}}</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "terms"),
                },
                {
                    key: "signature",
                    html: `<div class="signature-box">Authorized Signature<br/>____________________</div>`,
                    isSelected: props?.orderDetails?.quotationHtmlInfo?.some((section) => section?.key === "signature"),
                },
            ],
        },
    };

    return (
        <Card style={[globalStyles.cardShadowEffect,{flex:1}]}>
            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}
            >
                <View style={globalStyles?.appBackground}>
                    <TemplatePreview html={buildHtml(props?.orderDetails?.orderId,formatDate(props?.orderDetails?.createdDate),quotationFields)} />
                </View>

            </Modal>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="file" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text,globalStyles.themeTextColor]}>Quotation</Text>
                        </View>
                    </View>

                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Quotation Preview</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Created On: {formatDate(props?.createdOn)}</Text>
                        </View>

                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <Feather name="eye" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>

                    <View className='flex flex-row justify-between items-center' >
                        {actionButtons.map((action) => (
                            <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                {action.icon}
                                <ButtonText style={[globalStyles.buttonText,globalStyles.themeTextColor]}>{action.label}</ButtonText>
                            </Button>
                        ))
                        }
                    </View>

                </View>

            </View>
        </Card>
    );
};

export default QuotationDetails;