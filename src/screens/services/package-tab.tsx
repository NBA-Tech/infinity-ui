import React, { useCallback, useContext, useRef } from 'react';
import { FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
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

const PackageTab = () => {
    const globalStyles = useContext(StyleContext);

    const colorCodes = [
        "#7C3AED", // Purple
        "#3B82F6", // Blue
        "#10B981", // Emerald Green
        "#F59E0B", // Amber/Orange
        "#EF4444", // Red
        "#6366F1", // Indigo
        "#14B8A6", // Teal
        "#F43F5E", // Rose
        "#22C55E", // Green
        "#8B5CF6", // Violet
    ];


    const packages = [
        {
            id: '1',
            name: 'Pre-Wedding Package',
            price: 1000,
            description: 'A complete pre-wedding photography package.',
            services: [
                { serviceId: 's1', quantity: 1 },
                { serviceId: 's2', quantity: 2 },
            ],
            tags: ['Wedding', 'Photography'],
            isActive: true,
            image: null,
        },
        {
            id: '2',
            name: 'Birthday Package',
            price: 1200,
            description: 'Birthday photography with fun themes.',
            services: [{ serviceId: 's3', quantity: 1 }],
            tags: ['Birthday', 'Party'],
            isActive: false,
            image: null,
        },
    ];

    const services = [
        { id: 's1', name: 'Pre-Wedding PhotoShoot' },
        { id: 's2', name: 'Video Coverage' },
        { id: 's3', name: 'Birthday Photoshoot' },
    ];

   

    const PackageCard = ({ pkg }: { pkg: typeof packages[0] }) => {
        return (
            <Card
                style={[
                    styles.card,
                    globalStyles.cardShadowEffect,
                    {
                        borderLeftWidth: 4,
                        borderLeftColor: colorCodes[Math.floor(Math.random() * colorCodes.length)],
                    },
                ]}
            >
                <View style={styles.headerRow}>
                    <Text style={[globalStyles.heading3Text, styles.title]} numberOfLines={1}>
                        {pkg.name}
                    </Text>
                    <View style={styles.rightHeader}>
                        <View style={[styles.status, pkg.isActive ? styles.activeStatus : styles.inactiveStatus]}>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>
                                {pkg.isActive ? 'Active' : 'Inactive'}
                            </Text>
                        </View>
                        <Feather name="more-vertical" size={wp('5%')} color="#000" style={{ marginLeft: wp('2%') }} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', marginTop: wp('2%') }}>
                    {pkg.image && (
                        <View style={styles.imageWrapper}>
                            <Image source={{ uri: pkg.image }} style={styles.image} />
                        </View>
                    )}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.description} numberOfLines={2}>
                            {pkg.description}
                        </Text>
                        <Text style={styles.price}>Rs. {pkg.price}</Text>

                        <View style={styles.tagsRow}>
                            {pkg.tags.map((tag) => (
                                <View key={tag} style={styles.tag}>
                                    <Text style={[globalStyles.smallText, globalStyles.purpleTextColor]}>{tag}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={{ marginTop: wp('2%') }}>
                            {pkg.services.slice(0, 3).map((serviceItem) => {
                                const serviceDetails = services.find((s) => s.id === serviceItem.serviceId);
                                if (!serviceDetails) return null;
                                return (
                                    <View
                                        key={serviceItem.serviceId}
                                        style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: wp('1%') }}
                                    >
                                        <Text style={[globalStyles.smallText, { color: '#6B7280' }]}>{serviceDetails.name}</Text>
                                        <Text style={[globalStyles.smallText, { color: '#6B7280' }]}>x{serviceItem.quantity}</Text>
                                    </View>
                                );
                            })}
                            {pkg.services.length > 3 && (
                                <Text style={[globalStyles.smallText, { color: '#9CA3AF' }]}>+{pkg.services.length - 3} more services</Text>
                            )}
                        </View>
                    </View>
                </View>
            </Card>
        );
    };
    return (
        <View style={{ margin: wp('2%') }}>
            <View>
                <FlatList
                    data={packages}
                    keyExtractor={(item) => item.id}
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