import BackHeader from '@/src/Components/BackHeader';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/GradientCard';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { BasicInfoFields } from '../Customer/Types';
import { CustomFieldsComponent } from '@/src/Components/FieldsComponent';
import { Button, ButtonText } from '@/components/ui/button';

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
});


const CreateOrder = () => {
    const globalStyles = useContext(StyleContext);
    const stepIcon = ["user", "calendar", "clock", "dollar-sign"]

    const userInfo: Record<string, BasicInfoFields> = {
        fullName: {
            label: "Choose Customer",
            placeholder: "Enter Customer Name",
            icon: <Feather name="user" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
        },
        pointOfContact: {
            label: "Point Of Contact",
            placeholder: "Enter Point Of Contact",
            icon: <Feather name="phone" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        specialInstruction: {
            label: "Special Instruction",
            placeholder: "Enter Special Instruction",
            icon: <Feather name="phone" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: false,
            isDisabled: false,
        }
    }
    return (
        <SafeAreaView style={[globalStyles.appBackground, { flex: 1 }]}>
            <BackHeader screenName="Create Order" />

            {/* Wrap all main content in a flex container */}
            <View style={{ flex: 1, marginTop: hp("2%") }}>
                <View className="flex justify-center items-center" style={styles.userOnBoardBody}>
                    <View className="flex flex-wrap flex-row align-middle items-center">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <View key={index} className="flex flex-row align-middle items-center">
                                <View className="flex flex-row align-middle items-center">
                                    <GradientCard
                                        className="rounded-2xl p-4 mb-4"
                                        style={styles.roundWrapper}
                                    >
                                        <View className="justify-center items-center">
                                            <Feather name={stepIcon[index]} size={wp("5%")} color="#fff" />
                                        </View>
                                    </GradientCard>
                                    {index != 3 && <Divider style={styles.divider} />}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {false && (
                    <Card style={[globalStyles.cardShadowEffect, { padding: 0 }]}>
                        {/* Header */}
                        <View style={{ backgroundColor: "#ECFEFF", padding: hp("2%") }}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                <Feather name="user" size={wp("7%")} color="#06B6D4" />
                                <Text
                                    style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                >
                                    Customer Informations
                                </Text>
                            </View>
                        </View>

                        {/* Body */}
                        <CustomFieldsComponent infoFields={userInfo} />

                        {/* Footer */}
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                padding: wp("2%"),
                            }}
                        >
                            <Button
                                size="lg"
                                variant="solid"
                                action="primary"
                                style={globalStyles.purpleBackground}
                            >
                                <ButtonText style={globalStyles.buttonText}>
                                    Next : Event Details
                                </ButtonText>
                                <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                            </Button>
                        </View>
                    </Card>
                )}

                {true &&(
                    
                )

                }
            </View>

            {/* Sticky footer without absolute */}
            <Card style={[globalStyles.cardShadowEffect]}>
                <View style={{ margin: hp("2%") }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <View className='flex flex-row gap-3'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>SubTotal : ₹1000</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Taz : ₹1000</Text>

                            </View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Total Price: ₹1000</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>1 service selected</Text>
                        </View>



                    </View>

                </View>
            </Card>
        </SafeAreaView>

    );
};

export default CreateOrder;