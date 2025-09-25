import React, { useContext, useEffect, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { OfferingInfo, OrderType } from '@/src/types/order/order-type';
import { OfferingModel, ServiceInfo } from '@/src/types/offering/offering-type';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { getOfferingListAPI } from '@/src/api/offering/offering-service';
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
    itemIconContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        alignItems: 'center',
        backgroundColor: '#8B5CF6'
    }
})

type OfferingDetailsProps = {
    offeringData?: OfferingInfo
    totalPrice?: number
    setPackageData: (data: OfferingModel[]) => void
    setServiceData: (data: OfferingModel[]) => void
}
const OfferingDetails = (props: OfferingDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [serviceList, setServiceList] = useState<ServiceInfo[]>([]);
    const { getOfferingList, setOfferingList } = useOfferingStore()
    const showToast = useToastMessage()
    const { getItem } = useDataStore()


    const getServiceList = async () => {
        const userID = getItem("USERID");
        if (!userID) {
            showToast({
                type: "error",
                title: "Error",
                message: "UserID not found. Please logout and login again.",
            });
            return;
        }

        let offeringListData = getOfferingList();
        if (offeringListData.length <= 0) {
            const offeringData = await getOfferingListAPI(userID);
            if (!offeringData?.success) {
                showToast({
                    type: "error",
                    title: "Error",
                    message: offeringData?.message ?? "Something went wrong",
                });
                return;
            } else {
                const { packages, services } = offeringData.data;
                offeringListData = [...(packages ?? []), ...(services ?? [])];
            }
        }

        let servicesWithPrice: ServiceInfo[] = [];

        if (props?.offeringData?.orderType === OrderType.SERVICE) {
            servicesWithPrice = (props?.offeringData?.services ?? []).map(service => {
                const fullService = offeringListData.find(
                    (item: OfferingModel) => item.type === OrderType.SERVICE && item.id === service.id
                );

                return {
                    ...service,
                    price: fullService?.price ?? 0,
                };
            });
        } else if (props?.offeringData?.orderType === OrderType.PACKAGE) {
            const selectedPackage = offeringListData.find(
                (item: OfferingModel) =>
                    item.type === OrderType.PACKAGE && item.id === props?.offeringData?.packageId
            );

            servicesWithPrice = selectedPackage?.serviceList?.map(service => {
                const fullService = offeringListData.find(
                    (item: OfferingModel) => item.type === OrderType.SERVICE && item.id === service.id
                );

                return {
                    ...service, // id, name, value
                    price: fullService?.price ?? 0,
                };
            }) ?? [];
        }

        setServiceList(servicesWithPrice);
        props?.setPackageData?.(offeringListData.filter((offering) => offering?.type == OrderType?.PACKAGE) as OfferingModel[]);
        props?.setServiceData?.(offeringListData.filter((offering) => offering?.type == OrderType?.SERVICE) as OfferingModel[]);
    };




    useEffect(() => {
        getServiceList()
    }, [props.offeringData])
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="camera" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text,globalStyles.themeTextColor]}>Service Information</Text>
                        </View>
                        <View style={[styles.statusContainer, { borderColor: isDark ? '#fff' : '#000' }]}>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>{props?.offeringData?.orderType}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Premium Wedding Package</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Package includes:</Text>
                    </View>

                    <View className='flex flex-col gap-3'>
                        <FlatList
                            data={serviceList}
                            renderItem={({ item, index }) => (
                                <View className='flex flex-row justify-between items-center' key={index}>
                                    <View className='flex flex-row justify-start items-center gap-2'>
                                        <View style={styles.itemIconContainer}>
                                            <Feather name="check" size={wp('2%')} color={'#fff'} />
                                        </View>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{item?.name} x{item?.value}</Text>

                                    </View>
                                    <View>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>${item?.price}</Text>
                                    </View>
                                </View>
                            )}
                            contentContainerStyle={{ gap: hp('1%') }}
                            showsVerticalScrollIndicator={true} />
                        <Divider />
                        <View className='flex flex-row justify-between items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Total:</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>${props?.totalPrice}</Text>
                        </View>
                    </View>

                </View>

            </View>

        </Card>
    );
};

export default OfferingDetails;