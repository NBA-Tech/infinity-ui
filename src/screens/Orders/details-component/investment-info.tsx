import React, { useContext, useState } from "react";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { Card } from "@/components/ui/card";
import { View, Text, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Button, ButtonText } from "@/components/ui/button";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { CustomFieldsComponent } from "@/src/components/fields-component";
import { FormFields } from "@/src/types/common";
import { InvestmentModel, InvestmentType } from "@/src/types/investment/investment-type";
import { patchState } from "@/src/utils/utils";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { addUpdateInvestmentAPI } from "@/src/api/investment/investment-api-service";
import { useToastMessage } from "@/src/components/toast/toast-message";


const styles = StyleSheet.create({
    modalContainer: {
        padding: wp('3%'),
        borderRadius: wp('3%'),
        backgroundColor: '#1E1E2A'
    },
    card: {
        marginVertical: wp('2%'),
        borderRadius: wp('2%'),
        backgroundColor: '#fff',
    },
})

type InvestmentInfoProps = {
    orderId: string
}
const InvestmentInfo = (props: InvestmentInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const [open, setOpen] = useState(false);
    const [investmentDataList, setInvestmentDataList] = useState([]);
    const [investmentDetails, setInvestmentDetails] = useState<InvestmentModel>();
    const { isDark } = useContext(ThemeToggleContext);
    const [errors, setErrors] = useState({});
    const [openDate, setOpenDate] = useState(false);
    const { getItem } = useDataStore()
    const showToast = useToastMessage()

    const investmentFormFields: FormFields = {
        investmentName: {
            parentKey: "",
            key: "investmentName",
            label: "Invest Name",
            placeholder: "Eg: Salary",
            icon: <Feather name="briefcase" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: investmentDetails?.investmentName ?? "",
            onChange: (value: string) => {
                patchState("", "investmentName", value, true, setInvestmentDetails, setErrors);
            },
        },
        investedAmount: {
            parentKey: "",
            key: "investedAmount",
            label: "Invested Amount",
            placeholder: "Eg: 1000",
            icon: <Feather name="dollar-sign" size={wp("5%")} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: investmentDetails?.investedAmount ?? "",
            onChange: (value: string) => {
                patchState("", "investedAmount", value, true, setInvestmentDetails, setErrors);
            },
        },
        investmentDate: {
            parentKey: "",
            key: "investmentDate",
            label: "Investment Date",
            placeholder: "Eg: 01/01/2023",
            icon: <Feather name="calendar" size={wp("5%")} color="#8B5CF6" />,
            type: "date",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            isOpen: openDate,
            value: investmentDetails?.investmentDate ?? "",
            setIsOpen: (value: boolean) => setOpenDate(value),
            onChange: (value: string) => {
                patchState("", "investmentDate", value, true, setInvestmentDetails, setErrors);
            },
        },
        investmentDescription: {
            parentKey: "",
            key: "investmentDescription",
            label: "Investment Description",
            placeholder: "Eg: This is for salary",
            icon: <Feather name="briefcase" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: investmentDetails?.investmentDescription ?? "",
            onChange: (value: string) => {
                patchState("", "investmentDescription", value, true, setInvestmentDetails, setErrors);
            },
        },
        investmentType: {
            parentKey: "",
            key: "investmentType",
            label: "Investment Type",
            placeholder: "Eg: EQUIPMENT",
            icon: <Feather name="briefcase" size={wp("5%")} style={{ paddingRight: wp('3%') }} color="#8B5CF6" />,
            type: "select",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            dropDownItems: Object.values(InvestmentType).map((type) => ({
                label: type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
                value: type,
            })),
            value: investmentDetails?.investmentType ?? "",
            onChange: (value: string) => {
                patchState("", "investmentType", value, true, setInvestmentDetails, setErrors);
            },
        }
    }

    const handleCreateOrUpdateInvestment = async () => {
        if(!props?.orderId){
            return showToast({ type: "error", title: "Error", message: "OrderId is not found" });
        }
        const userId = getItem("USERID");
        const payload: InvestmentModel = {
            userId: userId,
            orderId: props?.orderId,
            ...investmentDetails
        }
        const addUpdateInvestmentResponse = await addUpdateInvestmentAPI(payload);
        if (!addUpdateInvestmentResponse?.success) {
            return showToast({ type: "error", title: "Error", message: addUpdateInvestmentResponse.message });
        }
        showToast({ type: "success", title: "Success", message: addUpdateInvestmentResponse.message });
        setOpen(false);
    }
    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}

            >
                <View style={styles.modalContainer}>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Add Investments</Text>
                    <CustomFieldsComponent infoFields={investmentFormFields} cardStyle={{ padding: hp("2%") }} />
                    <Button
                        size="sm"
                        variant="solid"
                        action="primary"
                        style={[globalStyles.purpleBackground, { marginVertical: hp('2%') }]}
                        onPress={handleCreateOrUpdateInvestment}
                    >

                        <Feather name="save" size={wp('5%')} color={'#fff'} />
                        <ButtonText style={globalStyles.buttonText}>
                            Save
                        </ButtonText>
                    </Button>
                </View>

            </Modal>
            <View>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="list" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Investments</Text>
                        </View>
                        <View>
                            <Button
                                size="sm"
                                variant="solid"
                                action="primary"
                                style={globalStyles.purpleBackground}
                                onPress={() => { setOpen(true) }}
                            >
                                <Feather name="plus" size={wp('5%')} color={'#fff'} />
                                <ButtonText style={globalStyles.buttonText}>
                                    Add
                                </ButtonText>
                            </Button>

                        </View>
                    </View>

                </View>

            </View>

        </Card>
    );
};

export default InvestmentInfo;