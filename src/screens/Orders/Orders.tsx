import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import Header from '@/src/Components/Header';
import GradientCard from '@/src/utils/GradientCard';
import { Divider } from '@/components/ui/divider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonText } from '@/components/ui/button';
import Feather from 'react-native-vector-icons/Feather';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Fab } from '@/components/ui/fab';
import OrderCard from './components/OrderCard';



const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
})
const Orders = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <View>
                <View className='bg-[#fff]' style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text]}>Orders</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>8 Orders found</Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]}>
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create New</ButtonText>
                            </Button>
                        </View>
                    </View>
                    {/* Customer Search is here */}
                    <View
                        className="flex flex-row items-center gap-3"
                        style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Orders"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />

                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>


                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ height: hp('60%') }}>
                    {Array(4).fill(0).map((_, index) => (
                        <View key={index} style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                            <OrderCard/>
                        </View>
                    ))

                    }
                </ScrollView>
                <Fab
                    size="lg"
                    placement="bottom right"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    style={{ backgroundColor: '#8B5CF6' }}
                >
                    <Feather name="plus" size={wp('6%')} color="#fff" />
                </Fab>
            </View>
        </SafeAreaView>
    );
};

export default Orders;