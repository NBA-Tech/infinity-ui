import { Button, ButtonText } from '@/components/ui/button';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import GradientCard from '@/src/utils/gradient-card';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import Share from 'react-native-share';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ApiGeneralRespose, NavigationProp, SearchQueryRequest } from '@/src/types/common';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/ui/card';
import { scaleFont } from '@/src/styles/global';
import { useCustomerStore } from '@/src/store/customer/customer-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { ApprovalStatus, OrderModel } from '@/src/types/order/order-type';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { deleteOrderAPI, getOrderDataListAPI, getOrderDetailsAPI, updateApprovalStatusAPI } from '@/src/api/order/order-api-service';
import Skeleton from '@/components/ui/skeleton';
import { formatDate, openDaialler, resetFiltersWithDefaultValue } from '@/src/utils/utils';
import { useUserStore } from '@/src/store/user/user-store';
import { EmptyState } from '@/src/components/empty-state-data';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import { getQuotationFields } from '@/src/utils/order/quotation-utils';
import { UserModel } from '@/src/types/user/user-type';
import { buildHtml } from '../orders/utils/html-builder';
import { generatePDF } from 'react-native-html-to-pdf';


const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
    }
})

const QuoteCardSkeleton = ({ count }: { count: number }) => (
    <View className='flex flex-col justify-between'>
        {[...Array(count)].map((_, index) => (
            <View key={index}>
                <Skeleton style={{ width: wp('95%'), height: hp('15%'), marginHorizontal: wp('2%') }} />
            </View>
        ))}
    </View>
);

const Quotation = () => {
    const globalStyles = useContext(StyleContext)
    const { isDark } = useContext(ThemeToggleContext)
    const navigation = useNavigation<NavigationProp>();
    const { customerMetaInfoList, loadCustomerMetaInfoList } = useCustomerStore();
    const [loading, setLoading] = useState(false);
    const { getItem } = useDataStore()
    const [filters, setFilters] = useState<SearchQueryRequest>({ page: 1, pageSize: 10 });
    const { userDetails } = useUserStore()
    const showToast = useToastMessage()
    const [hasMore, setHasMore] = useState(true);
    const [quoteData, setQuoteData] = useState([])
    const [refresh, setRefresh] = useState<boolean>(false);
    const [saveLoading, setSaveLoading] = useState<boolean>(false);
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [currId, setCurrId] = useState<string>('');
    const [totalCount, setTotalCount] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const { triggerReloadOrders } = useReloadContext()

    const actionButtons = [
        {
            key: 'share',
            label: 'Share',
            color: '#10B981', // Blue
            icon: <Feather name="share-2" size={wp('4%')} color="#fff" />,
            onPress: (orderId: string) => {
                shareQuote(orderId)
            }
        },
        {
            key: 'edit',
            label: 'Edit',
            color: '#6366F1', // Blue
            icon: <Feather name="edit-2" size={wp('4%')} color="#fff" />,
            onPress: (orderId: string) =>
                navigation.navigate("CreateQuotation", { orderId })

        },
        {
            key: 'call',
            label: 'Call',
            color: '#F97316', // Orange
            icon: <Feather name="phone" size={wp('4%')} color="#fff" />,
            onPress: (mobileNumber: string) => openDaialler(mobileNumber),
        },
    ];

    const handleShareQuotation = async (userDetails: UserModel, orderDetails: OrderModel, quotationFields:QuotaionHtmlInfo) => {
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
                html: buildHtml(orderDetails?.orderId, formatDate(new Date()), quotationFields),
                fileName: `Quotation_${orderDetails?.eventInfo?.eventTitle}`,
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

    }

    const shareQuote = async (orderId: string) => {
        console.log("share quote", orderId);
        setSaveLoading(true)
        try {
            const orderDetails = await getOrderDetailsAPI(orderId)
            if (!orderDetails?.success) {
                showToast({ type: "error", title: "Error", message: orderDetails?.message });
            }
            else {
                console.log(orderDetails, customerMetaInfoList)
                const quotationFields = getQuotationFields(
                    userDetails,
                    orderDetails?.data,
                    customerMetaInfoList,
                )
                handleShareQuotation(userDetails, orderDetails?.data, quotationFields)
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setSaveLoading(false)
        }

    }


    const handleDeletePopUp = (orderId: string) => {
        setCurrId(orderId);
        setOpenDelete(true);
    }

    const handleDelete = async () => {
        try {
            setDeleteLoading(true)
            const deleteOrderApiResponse = await deleteOrderAPI(currId)
            if (!deleteOrderApiResponse.success) {
                showToast({ type: "error", title: "Error", message: deleteOrderApiResponse.message });
            }
            else {
                showToast({ type: "success", title: "Success", message: "Rejected Successfully" });
                resetFiltersWithDefaultValue(setFilters, { page: 1, pageSize: 10 })
                setCurrId('')
                setOpenDelete(false)
            }
        }
        finally {
            setDeleteLoading(false)
        }
    }


    const updateApprovalStatus = async (orderId: string, status: ApprovalStatus) => {
        try {
            setSaveLoading(true)
            let response;

            if (status == ApprovalStatus.REJECTED) {
                response = await deleteOrderAPI(orderId)
            }
            else {
                response = await updateApprovalStatusAPI(orderId, status)

            }
            triggerReloadOrders()
            if (!response?.success) {
                showToast({ type: "error", title: "Error", message: response?.message });
            }
            else {
                showToast({ type: "success", title: "Success", message: response?.message });
                resetFiltersWithDefaultValue(setFilters)
            }
        }
        finally {
            setSaveLoading(false)
        }
    }

    const getQuoteListData = async (reset: boolean = false) => {
        reset ? setLoading(true) : setLoadingMore(true);
        const currFilters: SearchQueryRequest = {
            requiredFields: [
                "orderId",
                "status",
                "createdDate",
                "totalPrice",
                "orderBasicInfo.customerID",
                "eventInfo",
                "offeringInfo",
                "quotationHtmlInfo"
            ],
            ...filters,
            filters: {
                ...(filters?.filters || {}),
                userId: getItem("USERID"),
                approvalStatus: ApprovalStatus.PENDING
            },
        };

        try {
            const orderDataResponse: ApiGeneralRespose = await getOrderDataListAPI(currFilters);
            console.log(orderDataResponse)
            if (!orderDataResponse?.success) {
                showToast({ type: "error", title: "Error", message: orderDataResponse?.message });
                reset ? setLoading(false) : setLoadingMore(false);
                return;
            }
            setTotalCount(orderDataResponse?.total ?? 0);

            setQuoteData((prev: OrderModel[]) => {
                const newItems = orderDataResponse?.data ?? [];

                if (reset) return newItems;

                const existingIds = new Set(prev.map(item => item.orderId));

                // Only add items whose id is NOT already present
                const filteredNewItems = newItems.filter(
                    item => !existingIds.has(item.orderId)
                );

                // Return combined list
                return [...prev, ...filteredNewItems];
            });


            setHasMore(
                (orderDataResponse?.data?.length ?? 0) > 0 &&
                (((filters?.page ?? 1) * (filters?.pageSize ?? 10)) < (orderDataResponse?.total ?? 0))
            );
        } catch (err) {
            console.log(err);
        } finally {
            reset ? setLoading(false) : setLoadingMore(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let reset = filters?.page === 1;

            getQuoteListData(reset);
            return () => {
            }
        }, [filters, refresh])
    );


    useEffect(() => {
        const userId = getItem("USERID");
        loadCustomerMetaInfoList(userId, {}, {}, showToast);
        // loadOrdersMetaData(userId);
    }, []);

    const QuoteCardComponent = ({ item }: { item: OrderModel }) => {
        const customerData = customerMetaInfoList.find(x => x?.customerID === item?.orderBasicInfo?.customerID)
        return (
            <Card style={globalStyles.cardShadowEffect}>
                {/* Title */}
                <View className='flex flex-row justify-center items-center' style={{ marginBottom: hp('1.5%') }}>
                    <Text style={[globalStyles.heading2Text, globalStyles.themeTextColor, { fontSize: scaleFont(18), width: wp('70%'), textAlign: 'center' }]} numberOfLines={1}>{customerData?.name}'s {item?.eventInfo?.eventTitle}</Text>
                </View>

                {/* Client & Quote Info + Accept/Reject */}
                <View className='flex flex-row justify-between items-center' style={{ marginBottom: hp('1%') }}>
                    <View>
                        <Text style={[globalStyles.normalText, globalStyles.themeTextColor, { fontSize: scaleFont(14) }]}>Client Name: {customerData?.name}</Text>
                        <Text style={[globalStyles.normalText, globalStyles.themeTextColor, { fontSize: scaleFont(14) }]}>Created On: {formatDate(item?.createdDate)}</Text>
                    </View>

                    <View className='flex flex-row items-center gap-2'>
                        {/* Accept Button */}
                        <Button
                            size="sm"
                            variant="solid"
                            action="primary"
                            style={{ backgroundColor: "#22C55E", paddingHorizontal: wp('2%'), paddingVertical: hp('0.8%'), borderRadius: 8 }}
                            onPress={() => updateApprovalStatus(item?.orderId, ApprovalStatus.ACCEPTED)}
                            isDisabled={saveLoading}
                        >
                            <Feather name="check" size={wp('4%')} color="#fff" />
                            <ButtonText style={[globalStyles.whiteTextColor, { fontSize: scaleFont(12) }]}>Accept</ButtonText>
                        </Button>

                        {/* Reject Button */}
                        <Button
                            size="sm"
                            variant="solid"
                            action="primary"
                            style={{ backgroundColor: "#EF4444", paddingHorizontal: wp('2%'), paddingVertical: hp('0.8%'), borderRadius: 8 }}
                            onPress={() => handleDeletePopUp(item?.orderId)}
                            isDisabled={saveLoading}
                        >
                            <Feather name="x" size={wp('4%')} color="#fff" />
                            <ButtonText style={[globalStyles.whiteTextColor, { fontSize: scaleFont(12) }]}>Reject</ButtonText>
                        </Button>
                    </View>
                </View>

                {/* Event Details Card */}
                <Card style={[globalStyles.cardShadowEffect, { padding: hp('1.5%'), borderRadius: 10, marginBottom: hp('1.5%') }]}>
                    <View>
                        <View className='flex flex-row justify-between items-center' style={{ marginBottom: hp('0.8%') }}>
                            <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>Event Date</Text>
                            <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>{formatDate(item?.eventInfo?.eventDate)}</Text>
                        </View>
                        <View className='flex flex-row justify-between items-center'>
                            <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>Amount</Text>
                            <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>{userDetails?.currencyIcon} {item?.totalPrice}</Text>
                        </View>
                    </View>
                </Card>

                {/* Action Buttons */}
                <View className="flex flex-row justify-end items-center gap-1" style={{ marginTop: hp('1%') }}>
                    {actionButtons.map((btn) => (
                        <Button
                            key={btn.key}
                            size="sm"
                            variant="solid"
                            action="primary"
                            style={{
                                backgroundColor: btn.color,
                            }}
                            isDisabled={saveLoading}
                            onPress={() => {
                                if (btn?.key === "edit" || btn?.key === "delete" || btn?.key === "share") {
                                    btn.onPress(item?.orderId);
                                } else if (btn?.key === "call") {
                                    btn.onPress(customerData?.mobileNumber);
                                } else {
                                    btn.onPress();
                                }
                            }}
                        >
                            {btn.icon}
                            <ButtonText style={[globalStyles.whiteTextColor, { fontSize: scaleFont(12), marginLeft: wp('1%') }]}>
                                {btn.label}
                            </ButtonText>
                        </Button>
                    ))}
                </View>
            </Card>
        )

    }

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <DeleteConfirmation openDelete={openDelete} loading={deleteLoading} setOpenDelete={setOpenDelete} handleDelete={handleDelete} />
            <GradientCard
                colors={isDark
                    ? ["#0D3B8F", "#1372F0"]  // Dark mode: deep navy → vibrant blue
                    : ["#1372F0", "#6FADFF"]  // Light mode: vibrant blue → soft sky blue
                }
            >
                <View className="flex flex-col p-4 gap-5">
                    {/* Header */}
                    <View className="flex flex-row justify-center items-center mb-2" style={{ marginTop: hp('2.5%') }}>
                        <Text
                            style={[
                                globalStyles.headingText,
                                globalStyles.whiteTextColor,
                                { letterSpacing: 1, textTransform: 'uppercase' },
                            ]}
                        >
                            Quote
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View className="flex flex-row justify-between items-start">
                        {/* Total Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Pending Quote
                            </Text>
                            <View
                                className="flex flex-row justify-center items-center rounded-full"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    paddingVertical: hp('1%'),
                                    paddingHorizontal: wp('3%'),
                                }}
                            >
                                <Feather name="file" size={wp('5%')} style={{ marginRight: wp('2%') }} color="#fff" />
                                <Text
                                    style={[globalStyles.headingText, globalStyles.whiteTextColor]}>
                                    {loading ? "..." : totalCount}
                                </Text>
                            </View>
                        </View>

                        {/* Create Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Create Quote
                            </Text>
                            <Button
                                size="md"
                                variant="solid"
                                action="primary"
                                style={[
                                    globalStyles.buttonColor,
                                    {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderColor: "rgba(255,255,255,0.3)",
                                        borderWidth: 1,
                                    },
                                ]}
                                onPress={() => navigation.navigate("CreateQuotation")}
                            >
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>
            </GradientCard>
            <View style={{ marginHorizontal: wp('1%'), marginVertical: hp('1%') }}>
                <View style={{ backgroundColor: globalStyles.appBackground.backgroundColor }}>
                    {/* Customer Search is here */}
                    <View
                        className="flex flex-row items-center gap-3"
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                            variant='rounded'
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Quote"
                            />

                        </Input>

                    </View>


                </View>
                {loading && <QuoteCardSkeleton count={5} />}

                <View style={{ marginVertical: hp('2%') }}>
                    <FlatList
                        data={quoteData ?? []}
                        style={{ height: hp("60%") }}
                        keyExtractor={(_, index) => index.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingVertical: hp("1%"), gap: hp('2%') }}
                        renderItem={({ item }) => (
                            <QuoteCardComponent item={item} />
                        )}
                        ListEmptyComponent={
                            !loading && quoteData.length <= 0 ? (
                                <EmptyState
                                    variant={!filters?.searchQuery ? "quotations" : "search"}
                                    onAction={() => navigation.navigate("CreateQuotation")}
                                />
                            ) : null
                        }
                        onEndReached={() => {
                            if (hasMore) setFilters(prev => ({ ...prev, page: (prev?.page ?? 1) + 1 }));
                        }}
                        onEndReachedThreshold={0.7}
                        ListFooterComponent={(loadingMore && quoteData.length > 0) && <QuoteCardSkeleton count={2} />}
                        refreshing={loading}
                        onRefresh={() => {
                            setFilters(prev => ({ ...prev, page: 1 }));
                        }}
                    />
                </View>
            </View>

        </SafeAreaView>
    );
};

export default Quotation;