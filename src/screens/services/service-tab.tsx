import React, { useContext, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { ServiceModel, STATUS } from '@/src/types/offering/offering-type';
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
            <Card style={[globalStyles.cardShadowEffect]}>
                {/* Header Row */}
                <View className="flex-row justify-between items-center mb-2">
                    <Text
                        style={[globalStyles.headingText, globalStyles.themeTextColor]}
                        className="flex-1 text-ellipsis overflow-hidden pr-2"
                        numberOfLines={1}
                    >
                        {service?.serviceName}
                    </Text>

                    {/* Action Menu */}
                    <Menu
                        placement="bottom"
                        offset={5}
                        style={globalStyles.appBackground}
                        trigger={({ ...triggerProps }) => (
                            <Button {...triggerProps} variant="ghost" className="bg-transparent">
                                <Feather
                                    name="more-vertical"
                                    size={wp('5%')}
                                    color={isDark ? '#fff' : '#000'}
                                />
                            </Button>
                        )}
                    >
                        <MenuItem
                            key="Edit"
                            textValue="Edit"
                            className="flex-row items-center gap-2"
                            onPress={() => props.handleEdit(service?.id || "")}
                        >
                            <Feather name="edit-2" size={wp('5%')} color="#3B82F6" />
                            <MenuItemLabel
                                style={[globalStyles.labelText, globalStyles.themeTextColor]}
                            >
                                Edit
                            </MenuItemLabel>
                        </MenuItem>

                        <MenuItem
                            key="Delete"
                            textValue="Delete"
                            className="flex-row items-center gap-2"
                            onPress={() => {
                                setCurrId(service.id);
                                setOpenDelete(true);
                            }}
                        >
                            <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                            <MenuItemLabel
                                style={[globalStyles.labelText, globalStyles.themeTextColor]}
                            >
                                Delete
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </View>

                {/* Description & Price Row */}
                <View className="flex-row justify-between items-start">
                    <Text
                        style={[globalStyles.normalTextColor, globalStyles.smallText]}
                        className="w-[70%] leading-snug"
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {service?.description}
                    </Text>

                    <Text
                        style={[globalStyles.greenTextColor, globalStyles.headingText]}
                        className="text-right"
                    >
                        {userDetails?.currencyIcon} {service?.price}
                    </Text>
                </View>
            </Card>

        );
    };

    return (
        <ScrollView
            style={{ margin: wp('2%'), height: hp('48%') }}
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