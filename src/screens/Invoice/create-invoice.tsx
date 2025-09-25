import React, { useContext, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import QuotationDetails from './step-components/quotation-details';
const styles = StyleSheet.create({
    userOnBoardBody: {
        margin: hp("2%"),
    },
     roundWrapper: {
        borderRadius: wp("50%"),
        width: wp("13%"),
    },
    divider: {
        width: wp("10%"),
        height: hp("0.5%"),
    },
})
const CreateInvoice = () => {
    const globalStyles = useContext(StyleContext);
    const [currStep, setCurrStep] = useState(0);
    const stepIcon = ["user", "calendar", "clock", "dollar-sign"]
    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <BackHeader screenName="Create Invoice" />

            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className='flex justify-between items-center flex-row'>
                    <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                        <Text style={[globalStyles.heading2Text]}>Create Invoice</Text>
                        <GradientCard style={{ width: wp('25%') }}>
                            <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                        </GradientCard>
                    </View>
                </View>
                <View>
                    <View className="flex justify-center items-center" style={styles.userOnBoardBody}>
                        <View className="flex flex-wrap flex-row align-middle items-center">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <View key={index} className="flex flex-row align-middle items-center">
                                    <View className="flex flex-row align-middle items-center">
                                        <GradientCard
                                            className="rounded-2xl p-4 mb-4"
                                            style={styles.roundWrapper}
                                            colors={
                                                currStep === index
                                                    ? ["#6B46C1", "#9F7AEA", "#D53F8C"] // Purple gradient
                                                    : currStep > index
                                                        ? ["#48BB78", "#38A169", "#2F855A"] // Green gradient
                                                        : ["#d1d5db", "#d1d5db", "#d1d5db"] // Normal grey gradient
                                            }
                                        >
                                            <View className="justify-center items-center">
                                                {currStep > index ? (
                                                    <Feather name="check" size={wp("5%")} color="white" />
                                                ) : (
                                                    < Feather name={stepIcon[index]} size={wp("5%")} color="#fff" />
                                                )}
                                            </View>
                                        </GradientCard>
                                        {index != 3 && (
                                            <Divider style={[styles.divider, { backgroundColor: currStep > index ? "#38A169" : "#d1d5db" }]} />
                                        )}

                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
                {currStep === 0 && (
                    <QuotationDetails/>
                )

                }

            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateInvoice;