import React, { useCallback, useContext, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { PackageModel, STATUS } from '@/src/types/offering/offering-type';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Menu, MenuItem, MenuItemLabel } from '@/components/ui/menu';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { generateRandomString } from '@/src/utils/utils';
import { deleteOfferingApi } from '@/src/api/offering/offering-service';
import Modal from 'react-native-modal';
import DeleteConfirmation from '@/src/components/delete-confirmation';
import { COLORCODES } from '@/src/constant/constants';
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
    description: {
        fontSize: wp('3.5%'),
        color: '#4B5563',
        marginTop: wp('2%'),
    },
    price: {
        fontSize: wp('4.5%'),
        fontWeight: '700',
        color: '#7C3AED',
        marginTop: wp('1%'),
    },
    tagsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: wp('2%'),
    },
    tag: {
        borderWidth: 1,
        borderColor: '#7C3AED',
        paddingHorizontal: wp('2%'),
        paddingVertical: wp('1%'),
        borderRadius: wp('1%'),
        marginRight: wp('2%'),
        marginBottom: wp('2%'),
    },
    imageWrapper: {
        width: wp('20%'),
        height: wp('20%'),
        borderRadius: wp('2%'),
        overflow: 'hidden',
        backgroundColor: '#F3F4F6',
        marginRight: wp('3%'),
        alignItems: 'center',   // centers horizontally
        justifyContent: 'center', // centers vertically
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp('8%'),
    },
    emptyIconWrapper: {
        width: wp('16%'),
        height: wp('16%'),
        borderRadius: wp('8%'),
        backgroundColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: wp('4%'),
    },
    emptyText: {
        fontSize: wp('4%'),
        fontWeight: '500',
        color: '#111827',
        marginBottom: wp('1%'),
    },
    emptySubText: {
        fontSize: wp('3.5%'),
        color: '#6B7280',
    },
});
type PackageProps = {
    packageData: PackageModel[];
    handleEdit: (id: string) => void
}
const PackageTab = (props: PackageProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [currId, setCurrId] = useState<string>();
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { deletePackage } = useOfferingStore();
    const showToast = useToastMessage();
    const handleDelete = async () => {
        if (!currId) return;
        setLoading(true);
        const deleteService = await deleteOfferingApi(currId);
        if (!deleteService.success) {
            showToast({ type: "error", title: "Error", message: deleteService.message });
        }
        else {
            showToast({ type: "success", title: "Success", message: deleteService.message });
            deletePackage(currId);
        }
        setLoading(false);
        setOpenDelete(false);
    }




    const PackageCard = ({ pkg }: { pkg: PackageModel }) => {
        return (
            <Card
                style={[
                    styles.card,
                    globalStyles.cardShadowEffect,
                    {
                        borderLeftWidth: 4,
                        borderLeftColor: COLORCODES[Math.floor(Math.random() * COLORCODES.length)],
                    },
                ]}
            >
                <View style={styles.headerRow}>
                    <Text style={[globalStyles.heading3Text, styles.title,globalStyles.themeTextColor,{ width: wp('70%') }]} numberOfLines={1}>
                        {pkg.packageName}
                    </Text>
                    <View style={styles.rightHeader}>
                        <View style={[styles.status, pkg.status === STATUS.ACTIVE ? styles.activeStatus : styles.inactiveStatus]}>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>
                                {pkg.status}
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
                            <MenuItem key="Community" textValue="Edit" className='gap-2' onPress={() => props.handleEdit(pkg?.id || "")}>
                                <Feather name="edit-2" size={wp('5%')} color="#3B82F6" />
                                <MenuItemLabel style={globalStyles.labelText} >Edit</MenuItemLabel>
                            </MenuItem>
                            <MenuItem key="Plugins" textValue="Delete" className='gap-2' onPress={() => {
                                setCurrId(pkg.id);
                                setOpenDelete(true);
                            }}>
                                <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                                <MenuItemLabel style={globalStyles.labelText}>Delete</MenuItemLabel>
                            </MenuItem>
                        </Menu>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: wp('2%') }}>
                    {pkg.icon && (
                        <View style={styles.imageWrapper}>
                            <MaterialCommunityIcons name={pkg.icon} size={wp('8%')} color="#000" />
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.description} numberOfLines={2}>
                            {pkg.description}
                        </Text>
                        <Text style={styles.price}>{!pkg?.calculatedPrice ? `Rs. {pkg.price}` : 'AUTO PRICING'}</Text>

                        <View style={styles.tagsRow}>
                            {pkg.tags && pkg?.tags.map((tag) => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={[globalStyles.smallText, globalStyles.purpleTextColor]}>{tag}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={{ marginTop: wp('2%') }}>
                            {pkg?.serviceList?.map((serviceItem) => (
                                <View
                                    key={serviceItem.id}
                                    style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: wp('1%') }}
                                >
                                    <Text style={[globalStyles.smallText, { color: '#6B7280' }]}>{serviceItem.name}</Text>
                                    <Text style={[globalStyles.smallText, { color: '#6B7280' }]}>x{serviceItem.value}</Text>
                                </View>
                            ))}
                            {pkg.serviceList.length > 5 && (
                                <Text style={[globalStyles.smallText, { color: '#9CA3AF' }]}>+{pkg.serviceList.length - 5} more services</Text>
                            )}
                        </View>
                    </View>
                </View>
            </Card>
        );
    };
    return (
        <View style={{ margin: wp('2%') }}>
           <DeleteConfirmation openDelete={openDelete} loading={loading} setOpenDelete={setOpenDelete} handleDelete={handleDelete} />
            <View>
                <FlatList
                    data={props?.packageData}
                    keyExtractor={(item) => item.id + ''}
                    renderItem={({ item }) => (
                        <View style={{ gap: wp('0.5%') }}>
                            <PackageCard pkg={item} />
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                />

            </View>

        </View>
    );
};

export default PackageTab;