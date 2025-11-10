import React, { useCallback, useContext, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
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
    isLoading: boolean
    handleEdit: (id: string) => void
}
const PackageTab = (props: PackageProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [currId, setCurrId] = useState<string>();
    const [openDelete, setOpenDelete] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { deletePackage } = useOfferingStore();
    const { userDetails } = useUserStore()
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
        const randomColor =
            COLORCODES[Math.floor(Math.random() * COLORCODES.length)];

        return (
            <Card
                className="p-4 mb-3 rounded-2xl"
                style={[
                    globalStyles.cardShadowEffect,
                     {
                        borderLeftWidth: 4,
                        borderLeftColor: globalStyles.greenTextColor.color,
                    },
                ]}
            >
                {/* Header */}
                <View className="flex-row justify-between items-start mb-3">
                    <View className="flex-1 pr-3">
                        <Text
                            style={[
                                globalStyles.heading3Text,
                                globalStyles.themeTextColor,
                                { fontWeight: "600" },
                            ]}
                            numberOfLines={1}
                        >
                            {pkg.packageName}
                        </Text>
                        <Text
                            style={[
                                globalStyles.smallText,
                                { color: isDark ? "#9CA3AF" : "#6B7280" },
                            ]}
                            numberOfLines={2}
                        >
                            {pkg.description}
                        </Text>
                    </View>

                    {/* Menu */}
                    <Menu
                        placement="bottom"
                        offset={5}
                        style={globalStyles.appBackground}
                        trigger={({ ...triggerProps }) => (
                            <Button
                                {...triggerProps}
                                variant="ghost"
                                className="bg-transparent"
                            >
                                <Feather
                                    name="more-vertical"
                                    size={wp("5%")}
                                    color={isDark ? "#E5E7EB" : "#1E293B"}
                                />
                            </Button>
                        )}
                    >
                        <MenuItem
                            textValue="Edit"
                            className="flex-row items-center gap-2"
                            onPress={() => props.handleEdit(pkg?.id || "")}
                        >
                            <Feather name="edit-2" size={wp("5%")} color="#3B82F6" />
                            <MenuItemLabel
                                style={[globalStyles.labelText, globalStyles.themeTextColor]}
                            >
                                Edit
                            </MenuItemLabel>
                        </MenuItem>
                        <MenuItem
                            textValue="Delete"
                            className="flex-row items-center gap-2"
                            onPress={() => {
                                setCurrId(pkg.id);
                                setOpenDelete(true);
                            }}
                        >
                            <Feather name="trash-2" size={wp("5%")} color="#EF4444" />
                            <MenuItemLabel
                                style={[globalStyles.labelText, globalStyles.themeTextColor]}
                            >
                                Delete
                            </MenuItemLabel>
                        </MenuItem>
                    </Menu>
                </View>

                {/* Divider */}
                <View
                    style={{
                        height: 1,
                        backgroundColor: isDark ? "#1F2937" : "#E5E7EB",
                        marginVertical: wp("1.5%"),
                    }}
                />

                {/* Body Content */}
                <View className="mt-1">
                    {/* Tags */}
                    {pkg.tags && pkg.tags.length > 0 && (
                        <View className="flex-row flex-wrap mb-2">
                            {pkg.tags.map((tag) => (
                                <View
                                    key={tag}
                                    className="px-2 py-1 mr-2 mb-2 rounded-full"
                                    style={{
                                        backgroundColor: isDark
                                            ? "rgba(59,130,246,0.15)"
                                            : "rgba(59,130,246,0.1)",
                                    }}
                                >
                                    <Text
                                        style={[
                                            globalStyles.smallText,
                                            { color: isDark ? "#93C5FD" : "#1E3A8A" },
                                        ]}
                                    >
                                        {tag}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Services List */}
                    {pkg.serviceList && pkg.serviceList.length > 0 && (
                        <View className="mt-2">
                            {pkg.serviceList.slice(0, 5).map((serviceItem) => (
                                <View
                                    key={serviceItem.id}
                                    className="flex-row justify-between mb-1"
                                >
                                    <Text
                                        style={[
                                            globalStyles.smallText,
                                            { color: isDark ? "#9CA3AF" : "#374151" },
                                        ]}
                                    >
                                        {serviceItem.name}
                                    </Text>
                                    <Text
                                        style={[
                                            globalStyles.smallText,
                                            { color: isDark ? "#9CA3AF" : "#6B7280" },
                                        ]}
                                    >
                                        x{serviceItem.value}
                                    </Text>
                                </View>
                            ))}

                            {pkg.serviceList.length > 5 && (
                                <Text
                                    style={[
                                        globalStyles.smallText,
                                        { color: isDark ? "#9CA3AF" : "#6B7280", marginTop: 2 },
                                    ]}
                                >
                                    +{pkg.serviceList.length - 5} more services
                                </Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Footer */}
                <View
                    className="flex-row justify-between items-center mt-4 pt-3"
                    style={{
                        borderTopWidth: 1,
                        borderTopColor: isDark ? "#1E293B" : "#E5E7EB",
                    }}
                >
                    <View className="flex-row items-center">
                        {pkg.icon && (
                            <View
                                className="p-2 rounded-full mr-2"
                                style={{
                                    backgroundColor: randomColor + "20",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={pkg.icon}
                                    size={wp("6%")}
                                    color={randomColor}
                                />
                            </View>
                        )}
                        <Text
                            style={[
                                globalStyles.smallText,
                                { color: isDark ? "#9CA3AF" : "#6B7280" },
                            ]}
                        >
                            {pkg.serviceList?.length || 0} services
                        </Text>
                    </View>

                    <View className="flex-row items-center">
                        <Text
                            style={[
                                globalStyles.heading3Text,
                                globalStyles.greenTextColor
                            ]}
                        >
                            {pkg?.calculatedPrice
                                ? "AUTO PRICING"
                                : `${userDetails?.currencyIcon} ${pkg?.price}`}
                        </Text>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <ScrollView
            style={{ margin: wp('2%'), height: hp('48%') }}
            contentContainerStyle={{ paddingBottom: hp('5%') }} // optional bottom padding
            showsVerticalScrollIndicator={false}
        >
            <DeleteConfirmation
                openDelete={openDelete}
                loading={loading}
                setOpenDelete={setOpenDelete}
                handleDelete={handleDelete}
            />

            {props?.isLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton
                        key={index}
                        style={{
                            width: wp('95%'),
                            height: hp('15%'),
                            marginHorizontal: wp('2%'),
                            marginBottom: hp('1%'), // spacing between skeletons
                        }}
                    />
                ))
            ) : (
                <FlatList
                    data={props?.packageData}
                    keyExtractor={(item) => item.id + ''}
                    renderItem={({ item }) => (
                        <View style={{ gap: wp('0.5%'), marginBottom: hp('1%') }}>
                            <PackageCard pkg={item} />
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    scrollEnabled={false} // disable FlatList scrolling because ScrollView will scroll
                />
            )}
        </ScrollView>
    );
};

export default PackageTab;