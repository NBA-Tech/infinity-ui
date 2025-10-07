import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import { COLORCODES } from '@/src/constant/constants';
import { OrderModel } from '@/src/types/order/order-type';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { SearchQueryRequest } from '@/src/types/common';
import { getInvoiceListBasedOnFiltersAPI } from '@/src/api/invoice/invoice-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { Invoice } from '@/src/types/invoice/invoice-type';
import { formatDate } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';
import { useUserStore } from '@/src/store/user/user-store';
import { getInvoiceFields } from '@/src/utils/invoice/invoice-utils';
import Modal from 'react-native-modal';
import TemplatePreview from '../components/template-preview';
import { buildHtml } from '../utils/html-builder';
import { EmptyState } from '@/src/components/empty-state-data';
import { useNavigation } from '@react-navigation/native';
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
        marginVertical: wp('1%'),
        borderRadius: wp('2%'),
        backgroundColor: '#fff',
        gap: wp('4%')
    },
})

type InvoiceDetailsProps = {
    orderDetails: OrderModel;
    invoiceDetails: Invoice[]
}

const InvoiceDetails = (props: InvoiceDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { getItem } = useDataStore();
    const [loading, setLoading] = useState(false);
    const showToast = useToastMessage();
    const [currId, setCurrId] = useState<string>('');
    const { userDetails, getUserDetailsUsingID } = useUserStore();
    const [open, setOpen] = useState(false);
    const navigation = useNavigation();
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


    const invoiceTemplateFields = useMemo(() =>
        getInvoiceFields(
            userDetails,
            props?.invoiceDetails?.find((s) => s?.invoiceId === currId),
            props?.orderDetails
        ), [currId]
    )


    const handlePreview = (id: string) => {
        setCurrId(id);
        setOpen(true);
    }

    useEffect(() => {
        const userId = getItem("USERID");
        getUserDetailsUsingID(userId, showToast);
    }, [])

    const invoiceCardComponent = ({ item }: { item: Invoice }) => {
        return (
            <Card
                style={[
                    styles.card,
                    globalStyles.cardShadowEffect,
                    {
                        borderLeftWidth: 4,
                        borderLeftColor: "#10B981",
                    },
                ]}
            >

                <View className='flex flex-row justify-between items-center'>
                    <View className='flex flex-col'>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Invoice #{item?.invoiceId}</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Invoice Date: {formatDate(item?.invoiceDate)}</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Price: ${item?.amountPaid}</Text>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => { handlePreview(item?.invoiceId) }}>
                            <Feather name="eye" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='flex flex-row justify-between items-center' >
                    {actionButtons.map((action) => (
                        <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                            {action.icon}
                            <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>{action.label}</ButtonText>
                        </Button>
                    ))
                    }
                </View>
            </Card>
        )
    }
    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}
            >
                <View style={globalStyles?.appBackground}>
                    <TemplatePreview html={buildHtml(props?.orderDetails?.orderId, formatDate(props?.orderDetails?.createdDate), invoiceTemplateFields)} />
                </View>

            </Modal>
            <View>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="file-text" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Invoices</Text>
                        </View>
                    </View>
                    {loading && <Skeleton height={hp('25%')} />}
                    {props?.invoiceDetails?.length <= 0 ? (
                        <EmptyState variant='invoices' onAction={() => {
                            navigation.navigate("Invoice", {
                                screen: "CreateInvoice",
                            });

                        }} />
                    ) : (
                        <FlatList
                            data={props?.invoiceDetails}
                            style={{ height: hp("60%") }}
                            renderItem={invoiceCardComponent}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ paddingVertical: hp("1%") }}
                            keyExtractor={(item) => item?.invoiceId}
                            onEndReachedThreshold={0.7}
                        />

                    )}


                </View>

            </View>
        </Card>
    );
};

export default InvoiceDetails;