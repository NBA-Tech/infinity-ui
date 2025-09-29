import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
        marginHorizontal: wp('2%'),
    },
    rightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
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
            <Card style={[styles.card, globalStyles.cardShadowEffect]}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <MaterialCommunityIcons name={service?.icon || "camera"} size={wp('5%')} color={isDark ? '#fff' : '#000'} />

                    <Text style={[globalStyles.heading3Text, styles.title,globalStyles.themeTextColor, { width: wp('70%') }]} numberOfLines={1}>
                        {service?.serviceName}
                    </Text>

                    <View style={styles.rightHeader}>
                        <View style={[styles.status, service?.status === STATUS.ACTIVE ? styles.activeStatus : styles.inactiveStatus]}>
                            <Text style={[globalStyles.themeTextColor, globalStyles.smallText]}>
                                {service?.status}
                            </Text>
                        </View>
                        <Menu
                            placement="bottom"
                            offset={5}
                            trigger={({ ...triggerProps }) => {
                                return (
                                    <Button {...triggerProps} variant="ghost" style={{ backgroundColor: 'transparent' }}>
                                        <Feather name="more-vertical" size={wp('5%')} color={isDark ? '#fff' : '#000'} style={{ marginLeft: wp('2%') }} />
                                    </Button>
                                )
                            }}
                        >
                            <MenuItem key="Community" textValue="Edit" className='gap-2' onPress={() => props.handleEdit(service?.id || "")}>
                                <Feather name="edit-2" size={wp('5%')} color="#3B82F6" />
                                <MenuItemLabel style={globalStyles.labelText} >Edit</MenuItemLabel>
                            </MenuItem>
                            <MenuItem key="Plugins" textValue="Delete" className='gap-2' onPress={() => {
                                setCurrId(service.id);
                                setOpenDelete(true);
                            }}>
                                <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                                <MenuItemLabel style={globalStyles.labelText}>Delete</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    </View>
                </View>

                {/* Description and Price */}
                <View style={styles.descRow}>
                    <Text
                        style={[
                            globalStyles.normalTextColor,
                            globalStyles.smallText,
                            { width: wp('70%') } // set your fixed width here
                        ]}
                        numberOfLines={2} // limit lines to 2
                        ellipsizeMode="tail" // shows "..." at the end if text overflows
                    >
                        {service?.description}
                    </Text>

                    <Text style={[styles.price,globalStyles.subHeadingText]}>
                        Rs. {service?.price}
                    </Text>
                </View>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                    <View style={styles.tagsRow}>
                        {service?.tags?.map((tag: string, idx: number) => (
                            <View key={idx} style={styles.tag}>
                                <Text style={[globalStyles.smallText, globalStyles.whiteTextColor]}>{tag}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Card>
        );
    };

    return (
        <View style={{ margin: wp('2%') }}>
            <DeleteConfirmation openDelete={openDelete} loading={loading} setOpenDelete={setOpenDelete} handleDelete={handleDelete}  />
            <View style={{ height: hp('75%') }}>
                <FlatList
                    data={props.serviceData}
                    keyExtractor={(item) => item.id || ''}
                    renderItem={({ item }) => (
                        <View style={{ gap: wp('0.5%') }}>
                            <ServiceCard service={item} />
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />

            </View>
        </View>
    );
};

export default ServiceTab;