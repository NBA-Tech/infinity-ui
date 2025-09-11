import React, { useContext } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
        fontSize: wp('5%'),           // larger font
        fontWeight: '700',             // bold
        color: '#7C3AED',              // purple highlight
    },
    tag: {
        backgroundColor: '#7C3AED', // purple
        paddingHorizontal: wp('2%'),
        paddingVertical: wp('1%'),
        borderRadius: wp('1%'),
        marginRight: wp('2%'),
        marginBottom: wp('2%'),
    },
})
const ServiceTab = () => {
    const globalStyles = useContext(StyleContext);

    const services = [
        {
            id: '1',
            name: 'Pre-Wedding PhotoShoot',
            status: 'Active',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            price: 1000,
            tags: ['Wedding', 'Pre-Wedding'],
        },
        {
            id: '2',
            name: 'Baby Shower Photoshoot',
            status: 'Active',
            description: 'Capture the beautiful moments of your baby shower.',
            price: 800,
            tags: ['Baby Shower', 'Photography'],
        },
        {
            id: '3',
            name: 'Birthday Party Photoshoot',
            status: 'Inactive',
            description: 'Fun and memorable birthday party photos.',
            price: 1200,
            tags: ['Birthday', 'Party'],
        },
         {
            id: '4',
            name: 'Birthday Party Photoshoot',
            status: 'Inactive',
            description: 'Fun and memorable birthday party photos.',
            price: 1200,
            tags: ['Birthday', 'Party'],
        },
         {
            id: '5',
            name: 'Birthday Party Photoshoot',
            status: 'Inactive',
            description: 'Fun and memorable birthday party photos.',
            price: 1200,
            tags: ['Birthday', 'Party'],
        },
        // Add more services here
    ];


    const ServiceCard = ({ service }: any) => {
        return (
            <Card style={[styles.card, globalStyles.cardShadowEffect]}>
                {/* Header Row */}
                <View style={styles.headerRow}>
                    <Feather name="grid" size={wp('5%')} color="#000" />

                    <Text style={[globalStyles.heading3Text, styles.title]} numberOfLines={1}>
                        {service.name || "Pre-Wedding PhotoShoot"}
                    </Text>

                    <View style={styles.rightHeader}>
                        <View style={[styles.status, service.status === 'Active' ? styles.activeStatus : styles.inactiveStatus]}>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>
                                {service.status || "Active"}
                            </Text>
                        </View>
                        <Feather name="more-vertical" size={wp('5%')} color="#000" style={{ marginLeft: wp('2%') }} />
                    </View>
                </View>

                {/* Description and Price */}
                <View style={styles.descRow}>
                    <Text style={[globalStyles.normalTextColor, globalStyles.smallText]} numberOfLines={2}>
                        {service.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit."}
                    </Text>
                    <Text style={[styles.price]}>
                        Rs. {service.price || 1000}
                    </Text>
                </View>

                {/* Tags */}
                {service.tags && service.tags.length > 0 && (
                    <View style={styles.tagsRow}>
                        {service.tags.map((tag: string, idx: number) => (
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
            <View>
                    <FlatList
                        data={services}
                        keyExtractor={(item) => item.id}
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