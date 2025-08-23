import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import Header from '@/src/Components/Header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/GradientCard';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';


const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
    cardContainer: {
        borderRadius: wp('2%'),
    }
})
const Customer = () => {
    const globalStyle = useContext(StyleContext);



    const CustomerCardComponent = () => {
        return (
            <Card style={[styles.cardContainer,globalStyle.cardShadowEffect]}>
                <View className='p-3'>
                    <Text style={[globalStyle.subHeadingText, globalStyle.blackTextColor]}>John Doe</Text>
                    <Text style={[globalStyle.labelText, globalStyle.greyTextColor]}>
                        123 Main Street, Anytown, USA
                    </Text>
                </View>

            </Card>
        )
    }
    return (
        <SafeAreaView style={globalStyle.appBackground}>
            <Header />

            <View>
                <View className='bg-[#fff]' style={{ marginVertical: hp('1%') }}>
                    <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                        <Text style={[globalStyle.heading2Text]}>Customer Screen</Text>
                        <GradientCard style={{ width: wp('25%') }}>
                            <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                        </GradientCard>
                        <Text style={[globalStyle.normalTextColor, globalStyle.labelText]}>8 customers found</Text>
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
                                placeholder="Search Customer"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />

                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>


                </View>
                
                <CustomerCardComponent/>
            </View>

        </SafeAreaView>
    );
};

export default Customer;