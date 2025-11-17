import React, { useContext, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { ServiceModel, SERVICETYPE, STATUS } from '@/src/types/offering/offering-type';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import Modal from 'react-native-modal';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { deleteOfferingApi } from '@/src/api/offering/offering-service';
import { generateRandomString } from '@/src/utils/utils';
import { useToastMessage } from '@/src/components/toast/toast-message';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import Skeleton from '@/components/ui/skeleton';
import { useUserStore } from '@/src/store/user/user-store';
import { Divider } from '@/components/ui/divider';
const styles = StyleSheet.create({
    card: {
        padding: wp('4%'),
        marginVertical: wp('2%'),
        borderRadius: wp('2%'),
        backgroundColor: '#fff',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: wp('2%'),
    },
    title: {
        flex: 1,
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    status: {
        paddingVertical: wp('1%'),
        paddingHorizontal: wp('2%'),
        borderRadius: wp('1%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeStatus: {
        backgroundColor: '#34D399', // green
    },
    inactiveStatus: {
        backgroundColor: '#F87171', // red
    },
    descRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: wp('2%'),
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: wp('2%'),
    },
    price: {
        color: '#7C3AED',              // purple highlight
    },
    tag: {
        backgroundColor: '#7C3AED', // purple
        paddingHorizontal: wp('2%'),
        paddingVertical: wp('1%'),
        borderRadius: wp('3%'),
        marginRight: wp('2%'),
        marginBottom: wp('2%'),
    },
})
type ServiceTabProps = {
    serviceData: ServiceModel[];
    isLoading: boolean
    handleEdit: (id: string) => void
}
const ServiceTab = (props: ServiceTabProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [currId, setCurrId] = useState<string>();
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { deleteService } = useOfferingStore();
    const showToast = useToastMessage();
    const { userDetails } = useUserStore()


    const handleDelete = async () => {
        if (!currId) return;
        setLoading(true);
        const deleteServiceResponse = await deleteOfferingApi(currId);
        if (!deleteServiceResponse.success) {
            showToast({ type: "error", title: "Error", message: deleteServiceResponse.message });
        }
        else {
            showToast({ type: "success", title: "Success", message: deleteServiceResponse.message });
            deleteService(currId);
        }
        setLoading(false);
        setOpenDelete(false);
    }

    const ServiceCard = ({ service }: { service: ServiceModel }) => {
        return (
            <Card
                className="p-4 mb-3 rounded-2xl"
                style={[
                    globalStyles.cardShadowEffect,
                    {
                        borderLeftWidth: 4,
                        borderLeftColor: service?.type === SERVICETYPE.SERVICE
                            ? globalStyles.blueTextColor.color
                            : globalStyles.greenTextColor.color,
                    },
                ]}
            >
                {/* Header Row */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text
                        style={[globalStyles.heading3Text, globalStyles.themeTextColor]}
                        className="flex-1 text-ellipsis overflow-hidden pr-2"
                        numberOfLines={1}
                    >
                        {service?.serviceName}
                    </Text>
                </View>

                {/* Description & Price */}
                <View className="flex-row justify-between items-start mt-1 mb-3">
                    <Text
                        style={[globalStyles.greyTextColor, globalStyles.smallText]}
                        className="w-[70%] leading-snug"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {service?.type === SERVICETYPE.SERVICE
                            ? `Session Type: ${service?.sessionType || "-"}`
                            : `Quantity: ${service?.quantity || "-"}`}
                    </Text>

                    <Text
                        style={[globalStyles.greenTextColor, globalStyles.heading3Text]}
                        className="text-right"
                    >
                        {userDetails?.currencyIcon} {service?.price ?? 0}
                    </Text>
                </View>

                {/* Divider Line */}
               <Divider style={{marginVertical:wp('2%'),backgroundColor:isDark?'#3F3F46':'#E5E7EB'}}/>

                {/* Footer Actions */}
                <View className="flex flex-row justify-end items-center gap-4">
                    <TouchableOpacity
                        className="flex flex-row items-center gap-1"
                        onPress={() => props.handleEdit(service?.id || "")}
                    >
                        <Feather
                            name="edit-2"
                            size={wp("5%")}
                            color={globalStyles.blueTextColor.color}
                        />
                        <Text
                            style={[globalStyles.themeTextColor, globalStyles.labelText]}
                        >
                            Edit
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="flex flex-row items-center gap-1"
                        onPress={() => {
                            setCurrId(service.id);
                            setOpenDelete(true);
                        }}
                    >
                        <Feather name="trash-2" size={wp("5%")} color="#EF4444" />
                        <Text
                            style={[globalStyles.themeTextColor, globalStyles.labelText]}
                        >
                            Delete
                        </Text>
                    </TouchableOpacity>
                </View>
            </Card>
        );
    };


    return (
        <ScrollView
            style={{ margin: wp('2%') }}
            contentContainerStyle={{ paddingBottom: hp('5%') }}
            showsVerticalScrollIndicator={false}
        >
            {/* Delete confirmation at the top */}
            <DeleteConfirmation
                openDelete={openDelete}
                loading={loading}
                setOpenDelete={setOpenDelete}
                handleDelete={handleDelete}
            />

            {props?.isLoading ? (
                // Skeletons when loading
                Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        style={{
                            width: wp('95%'),
                            height: hp('15%'),
                            marginHorizontal: wp('2%'),
                            marginBottom: hp('1%'),
                        }}
                    />
                ))
            ) : (
                // Render the list of services
                props?.serviceData && props?.serviceData?.map((item, index) => (
                    <View
                        key={item.id?.toString() || index.toString()}
                        style={{ gap: wp('0.5%'), marginBottom: hp('1%') }}
                    >
                        <ServiceCard service={item} />
                    </View>
                ))
            )}
        </ScrollView>
    );
};

export default ServiceTab;