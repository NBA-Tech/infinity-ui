import BackHeader from '@/src/Components/BackHeader';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/GradientCard';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { BasicInfoFields } from '../Customer/Types';
import { CustomCheckBox, CustomFieldsComponent } from '@/src/Components/FieldsComponent';
import { Button, ButtonText } from '@/components/ui/button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
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

    const eventInfo: Record<string, BasicInfoFields> = {
        eventTitle: {
            label: "Event Title",
            placeholder: "Enter Event Title",
            icon: <Feather name="edit-3" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        eventDate: {
            label: "Event Date",
            placeholder: "Enter Event Date",
            icon: <Feather name="calendar" size={wp("5%")} color="#8B5CF6" />,
            type: "date",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        eventTime: {
            label: "Event Time",
            placeholder: "Enter Event Time",
            icon: <Feather name="clock" size={wp("5%")} color="#8B5CF6" />,
            type: "time",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        noOfHours: {
            label: "No. of Hours",
            placeholder: "Enter No. of Hours",
            icon: <MaterialIcons name="hourglass-empty" size={wp("5%")} color="#8B5CF6" />,
            type: "number",
            style: "w-1/2",
            isRequired: true,
            isDisabled: false,
        },
        eventLocation: {
            label: "Event Location",
            placeholder: "Enter Event Location",
            icon: <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
        },
    };

    const eventTypes = {
        wedding: {
            icon: <Feather name="heart" size={wp("5%")} color="#8B5CF6" />,
            label: "Wedding",
        },
        birthday: {
            icon: <Feather name="gift" size={wp("5%")} color="#8B5CF6" />,
            label: "Birthday",
        },
        corporateEvent: {
            icon: <Feather name="briefcase" size={wp("5%")} color="#8B5CF6" />,
            label: "Corporate Event",
        },
        portraitSession: {
            icon: <Feather name="camera" size={wp("5%")} color="#8B5CF6" />,
            label: "Portrait Session",
        },
        babyShoot: {
            icon: <Feather name="smile" size={wp("5%")} color="#8B5CF6" />,
            label: "Baby Shoot",
        },
        customEvent: {
            icon: <Feather name="star" size={wp("5%")} color="#8B5CF6" />,
            label: "Custom Event",
        },
    };

    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <BackHeader screenName="Create Order" />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className='flex justify-between items-center flex-row'>
                    <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                        <Text style={[globalStyles.heading2Text]}>Create Order</Text>
                        <GradientCard style={{ width: wp('25%') }}>
                            <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                        </GradientCard>
                    </View>
                </View>

                {/* Wrap all main content in a flex container */}
                <View style={{ flex: 1, marginTop: hp("1%") }}>
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

                    {false && (
                        <Card style={[globalStyles.cardShadowEffect, { padding: 0 }]}>
                            {/* Header */}
                            <View style={{ backgroundColor: "#FDF2F8", padding: hp("2%") }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                    <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                    >
                                        Event Details
                                    </Text>
                                </View>
                            </View>

                            {/* Body */}
                            <CustomFieldsComponent infoFields={eventInfo} />
                            <View style={{ marginLeft: wp('5%') }}>

                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Event Type</Text>

                                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('3%') }}>
                                    {Object.values(eventTypes).map((eventType, index) => (
                                        <CustomCheckBox key={index}>
                                            <View className='flex flex-row items-center gap-2'>
                                                {eventType.icon}
                                                <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{eventType.label}</Text>
                                            </View>
                                        </CustomCheckBox>
                                    ))

                                    }
                                </View>
                            </View>

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
                                        Next : Service Details
                                    </ButtonText>
                                    <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                                </Button>
                            </View>
                        </Card>
                    )

                    }

                    {true && (
                        <View>
                            <Card style={[globalStyles.cardShadowEffect, { padding: 0 }]}>
                                {/* Header */}
                                <View style={{ backgroundColor: "#ECFDF5", padding: hp("2%") }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Feather name="calendar" size={wp("7%")} color="#8B5CF6" />
                                        <Text
                                            style={[globalStyles.normalTextColor, globalStyles.heading3Text]}
                                        >
                                            PhotoGraphy Services
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ marginLeft: wp('5%'), paddingVertical: hp('2%') }}>

                                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: wp('2%') }}>
                                        {Object.values(eventTypes).map((eventType, index) => (
                                            <CustomCheckBox
                                                key={index}
                                                selectedStyle={{ backgroundColor: '#ECFDF5', borderColor: '#06B6D4' }}
                                                styles={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                            >
                                                {/* Left side content */}
                                                <View className="flex flex-row items-center gap-2 flex-1">
                                                    <View>
                                                        <GradientCard
                                                            colors={["#F9FAFB", "#D1D5DB", "#9CA3AF"]}
                                                            style={{
                                                                padding: wp("2%"),
                                                                minWidth: wp("9%"),
                                                                minHeight: wp("9%"),
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            {eventType.icon}
                                                        </GradientCard>
                                                    </View>

                                                    <View className="flex flex-col gap-0.5">
                                                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                                                            Pre-Wedding Shoot
                                                        </Text>
                                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                                            Romantic couple photoshoot at scenic locations
                                                        </Text>
                                                        <View className="flex flex-row gap-2">
                                                            <View className="flex flex-row items-center gap-1">
                                                                <Feather name="clock" size={wp('3%')} color="#000" />
                                                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>2 hours</Text>
                                                            </View>
                                                            <View className="flex flex-row items-center gap-1">
                                                                <Feather name="file" size={wp('3%')} color="#000" />
                                                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>3 photos</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>

                                                {/* Price aligned to right */}
                                                <Text
                                                    style={[
                                                        globalStyles.normalBoldText,
                                                        { color: "#16A34A", marginLeft: "auto" } // green-600 tailwind shade
                                                    ]}
                                                >
                                                    ₹10,000
                                                </Text>
                                            </CustomCheckBox>

                                        ))

                                        }
                                    </View>
                                </View>
                            </Card>
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
                                        Next : Service Details
                                    </ButtonText>
                                    <Feather name="arrow-right" size={wp("5%")} color="#fff" />
                                </Button>
                            </View>
                        </View>
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
            </ScrollView>
        </SafeAreaView>

    );
};

export default CreateOrder;