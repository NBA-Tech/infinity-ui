import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import { COLORCODES } from '@/src/constant/constants';
import { getQuotationFields } from '@/src/utils/order/quotation-utils';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@/src/components/empty-state-data';

const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
        borderWidth: 1,
        borderColor: '#000'
    },
    card: {
        marginVertical: wp('2%'),
        borderRadius: wp('2%'),
        backgroundColor: '#fff',
        gap: wp('4%')
    },
})

type QuotationDetailsProps = {
    htmlTemplate: QuotaionHtmlInfo[];
    serviceData: ServiceModel[];
    packageData: PackageModel[];
    orderDetails: OrderModel;
    createdOn: Date;
    borderColor: string;

}
const QuotationDetails = (props: QuotationDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [open, setOpen] = useState(false);
    const showToast = useToastMessage();
    const { userDetails, getUserDetailsUsingID } = useUserStore();
    const { getItem } = useDataStore();
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const [customerList, setCustomerList] = useState<any[]>();
    const navigation = useNavigation();
    const handleShareQuotation = async () => {
        try {
            const message = `
                        Hello Sir/Mam 👋,
                        Thank you for showing interest in our photography services 📸.
                        Please find attached your customized quotation with detailed packages, services, and pricing.
    
                        If you have any questions or would like to make changes, feel free to reach out. We’d love to be part of your special moments ✨.
    
                        📍 Studio Address: ${userDetails?.userBillingInfo?.address}, ${userDetails?.userBillingInfo?.city}, ${userDetails?.userBillingInfo?.state}, ${userDetails?.userBillingInfo?.zipCode}, ${userDetails?.userBillingInfo?.country}
                        📞 Phone: ${userDetails?.userBusinessInfo?.businessPhoneNumber}
                        📧 Email: ${userDetails?.userBusinessInfo?.businessEmail}
                        🌐 Website: ${userDetails?.userBusinessInfo?.websiteURL}
    
                        Looking forward to capturing memories together! 💫
    
                        Warm regards,
                            `;

            const options = {
                html: buildHtml("1", new Date().toLocaleDateString(), quotationFields,"Quotation"),
                fileName: `Quotation_${props?.orderDetails?.eventInfo?.eventTitle}`,
            };
            const file = await generatePDF(options);
            const shareOptions = {
                title: options.fileName,
                message: message,
                url: `file://${file.filePath}`,
                type: 'application/pdf',
            }


            await Share.open(shareOptions);

        } catch (err) {
            console.error("Error generating PDF:", err);
        }
    };

    const loadCustomerData = async () => {
        const userID = getItem("USERID")
        const metaData = await loadCustomerMetaInfoList(userID, {}, {}, showToast)
        setCustomerList(metaData);
    }


    useEffect(() => {
        const userID = getItem("USERID")
        getUserDetailsUsingID(userID, showToast)
        loadCustomerData()
    }, [])
    const quotationFields = useMemo(
        () =>
            getQuotationFields(
                userDetails,
                props?.orderDetails,
                customerList,
            ),
        [customerMetaInfoList, props?.orderDetails, props?.packageData, userDetails]
    );

    const actionButtons = [
        {
            id: 1,
            label: 'Share',
            icon: <Feather name="share-2" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
            onPress: () => {
                handleShareQuotation()
            }
        },
        {
            id: 2,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
            onPress: () => {
                navigation.navigate("CreateOrder", { orderId: props?.orderDetails?.orderId });
            }
        },
    ]

    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}
            >
                <View style={globalStyles?.appBackground}>
                    <TemplatePreview html={buildHtml(props?.orderDetails?.orderId, formatDate(props?.orderDetails?.createdDate), quotationFields, "Quotation")} />
                </View>

            </Modal>
            <View>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-center gap-2'>
                            <Feather name="file" size={wp('7%')} color={'#3B82F6'} />
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Quotation</Text>
                        </View>
                    </View>
                    {props?.orderDetails?.length <= 0 ? (
                        <EmptyState variant='orders' />
                    ) : (
                        <Card
                            style={[
                                styles.card,
                                globalStyles.cardShadowEffect,
                                {
                                    borderLeftWidth: 4,
                                    borderLeftColor: props?.borderColor,
                                },
                            ]}
                        >


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
                                    <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground} onPress={action.onPress}>
                                        {action.icon}
                                        <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>{action.label}</ButtonText>
                                    </Button>
                                ))
                                }
                            </View>
                        </Card>
                    )}


                </View>

            </View>
        </Card>
    );
};

export default QuotationDetails;