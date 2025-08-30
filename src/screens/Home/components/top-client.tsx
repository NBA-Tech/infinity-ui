import { Card } from '@/components/ui/card';
import React, { useContext } from 'react';
import { View, StyleSheet, Text, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { Avatar, AvatarFallbackText } from '@/components/ui/avatar';
import { Divider } from '@/components/ui/divider';

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: wp('2%'),
        marginVertical: hp('2%'),
        padding: wp('4%'),
    },
    innerCard: {
        marginRight: wp('3%'),
        width: wp('60%'),
    }
});

const TopClient = () => {
    const globalStyles = useContext(StyleContext);

    // dummy array length 6
    const clients = [
        { id: '1', name: 'Arlene McCoy', orders: 4 },
        { id: '2', name: 'John Doe', orders: 6 },
        { id: '3', name: 'Jane Smith', orders: 2 },
        { id: '4', name: 'Michael Brown', orders: 8 },
        { id: '5', name: 'Emily Johnson', orders: 5 },
        { id: '6', name: 'Chris Evans', orders: 7 },
    ];

    const renderClientCard = ({ item }: any) => (
        <Card style={[globalStyles.cardShadowEffect, styles.innerCard]}>
            <View className='flex flex-col items-center justify-center gap-2'>
                <Avatar
                    style={{
                        backgroundColor: "#8B5CF6",
                        transform: [{ scale: 1.2 }],
                    }}
                >
                    <AvatarFallbackText style={globalStyles.whiteTextColor}>
                        {item.name}
                    </AvatarFallbackText>
                </Avatar>
                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                    {item.name}
                </Text>
            </View>
            <View className='flex flex-row justify-between items-center mt-2'>
                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                    Total Orders : {item.orders}
                </Text>
                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                    Completed : {item.orders}
                </Text>
            </View>
        </Card>
    );

    return (
        <View>
            <Card style={styles.cardContainer}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                            Top Clients
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                            Highest revenue contributors
                        </Text>
                    </View>
                    <Feather name="info" size={wp('5%')} color="#000" />
                </View>

                <Divider style={{ marginVertical: hp('1.5%') }} />

                {/* Horizontal FlatList */}
                <FlatList
                    horizontal
                    data={clients}
                    renderItem={renderClientCard}
                    keyExtractor={(item) => item.id}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ marginVertical: hp('2%') }}
                />
            </Card>
        </View>
    );
};

export default TopClient;
