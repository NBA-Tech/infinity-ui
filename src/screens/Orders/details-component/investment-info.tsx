import React, { useContext, useEffect, useMemo, useState } from "react";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { Card } from "@/components/ui/card";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Modal from "react-native-modal";
import { CustomFieldsComponent } from "@/src/components/fields-component";
import { ApiGeneralRespose, FormFields, GlobalStatus } from "@/src/types/common";
import { InvestmentModel, InvestmentType } from "@/src/types/investment/investment-type";
import { formatDate, getCurrencySymbol, patchState, validateValues } from "@/src/utils/utils";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { addUpdateInvestmentAPI, deleteInvestmentAPI, getInvestmentDetailsUsingInvestmentIdAPI, updateInvestmentDetailsApi } from "@/src/api/investment/investment-api-service";
import { useToastMessage } from "@/src/components/toast/toast-message";
import { useUserStore } from "@/src/store/user/user-store";
import DeleteConfirmation from "@/src/components/delete-confirmation";
import { useReloadContext } from "@/src/providers/reload/reload-context";
import { EmptyState } from "@/src/components/empty-state-data";


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
    orderStatus:GlobalStatus
    investmentDataList: InvestmentModel[]
    setInvestmentDataList: (value: InvestmentModel[]) => void
}
const InvestmentInfo = (props: InvestmentInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const [open, setOpen] = useState(false);
    const [investmentDetails, setInvestmentDetails] = useState<InvestmentModel>();
    const { isDark } = useContext(ThemeToggleContext);
    const [errors, setErrors] = useState({});
    const [openDate, setOpenDate] = useState(false);
    const [loading, setLoading] = useState(false)
    const { getItem } = useDataStore()
    const [editCurrId, setEditCurrId] = useState<string>('');
    const { triggerReloadInvestments } = useReloadContext()
    const [deleteCurrId, setDeleteCurrId] = useState<string>('');
    const [deleteOpen, setDeleteOpen] = useState(false);
    const showToast = useToastMessage()
    const { userDetails, getUserDetailsUsingID } = useUserStore()

    const investmentFormFields: FormFields = useMemo(() => ({
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
    }), [investmentDetails])

    const handleCreateOrUpdateInvestment = async () => {
        const validateInput = validateValues(investmentDetails, investmentFormFields)
        if (!validateInput?.success) {
            return showToast({ type: "warning", title: "Oops!!", message: validateInput?.message ?? "Please fill all the required fields" });
        }
        if (!props?.orderId) {
            return showToast({ type: "error", title: "Error", message: "Order ID is not found" });
        }

        setLoading(true);

        const userId = getItem("USERID");
        const payload: InvestmentModel = {
            userId,
            orderId: props?.orderId,
            ...investmentDetails,
        };

        let response;
        if (investmentDetails?.investmentId) {
            response = await updateInvestmentDetailsApi(payload);
        } else {
            response = await addUpdateInvestmentAPI(payload);
        }

        setLoading(false);
        triggerReloadInvestments()

        if (!response?.success) {
            return showToast({ type: "error", title: "Error", message: response.message });
        }

        if (investmentDetails?.investmentId) {
            // ✅ Update existing investment in the list
            props?.setInvestmentDataList((prev) =>
                prev.map((inv) =>
                    inv.investmentId === payload.investmentId ? payload : inv
                )
            );
        } else {
            // ✅ Add new investment
            props?.setInvestmentDataList((prev) => [...prev, payload]);
        }

        showToast({ type: "success", title: "Success", message: response.message });
        setOpen(false);
        setEditCurrId("");
    };



    const getInvestmentDetails = async () => {
        setLoading(true);
        const investmentDetails: ApiGeneralRespose = await getInvestmentDetailsUsingInvestmentIdAPI(editCurrId)
        setLoading(false);
        if (!investmentDetails?.success) {
            return showToast({ type: "error", title: "Error", message: investmentDetails.message });
        }
        setInvestmentDetails(investmentDetails.data)
        setOpen(true);
    }

    const deleteInvestment = async () => {
        if (!deleteCurrId) {
            return
        }
        const deleteInvestment: ApiGeneralRespose = await deleteInvestmentAPI(deleteCurrId)
        setLoading(false)
        if (!deleteInvestment?.success) {
            return showToast({ type: "error", title: "Error", message: deleteInvestment.message })
        }
        showToast({ type: "success", title: "Success", message: deleteInvestment.message })
        props?.setInvestmentDataList((prev) => prev.filter((inv) => inv.investmentId !== deleteCurrId));
        setDeleteCurrId("")
        setDeleteOpen(false)
    }

    useEffect(() => {
        const userdId = getItem("USERID");
        getUserDetailsUsingID(userdId, showToast);

    }, [])

    useEffect(() => {
        if (editCurrId) {
            getInvestmentDetails();
        }
    }, [editCurrId])

    const verifyAndOpenAddModal = () => {
        if(props?.orderStatus==GlobalStatus.PENDING){
            return showToast({
                type: "warning",
                title: "Oops!!",
                message: "Please confirm the order before adding investments",
            })
        }
        setOpen(true);
    }

    const InvestmentCardComponent = ({ investment }: { investment: InvestmentModel }) => {
        return (
            <Card
                style={[
                    styles.card,
                    globalStyles.cardShadowEffect,
                    {
                        borderLeftWidth: 4,
                        borderLeftColor: "#3B82F6",
                    },
                ]}
            >
                <View className="flex flex-col gap-3">
                    <View className="flex flex-row justify-between items-center">
                        <View>
                            <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Investment Name</Text>
                            <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{investment?.investmentName}</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Investment Date</Text>
                            <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{formatDate(investment?.investmentDate)}</Text>
                        </View>

                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <View>
                            <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Investment Type</Text>
                            <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{investment?.investmentType}</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Investment Amount</Text>
                            <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{getCurrencySymbol(userDetails?.userBillingInfo?.country)} {investment?.investedAmount}</Text>
                        </View>

                    </View>
                    <View className="flex flex-row justify-between items-center">
                        <View>
                            <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Investment Description</Text>
                            <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{investment?.investmentDescription}</Text>
                        </View>
                        <View className="flex flex-row items-center gap-4">
                            <TouchableOpacity onPress={() => setEditCurrId(investment?.investmentId)} disabled={loading}>
                                <Feather name="edit" size={wp('5%')} color="#22C55E" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setDeleteCurrId(investment?.investmentId)
                                setDeleteOpen(true)
                            }}
                                disabled={loading}
                            >
                                <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                            </TouchableOpacity>
                        </View>

                    </View>

                </View>

            </Card>
        )

    }

    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            {deleteOpen && <DeleteConfirmation openDelete={deleteOpen} setOpenDelete={setDeleteOpen} loading={loading} handleDelete={deleteInvestment} />}
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
                        isDisabled={loading}
                    >
                        {loading && <ButtonSpinner color={"#fff"} size={wp("4%")} />}

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
                                onPress={() =>  {verifyAndOpenAddModal()} }
                            >
                                <Feather name="plus" size={wp('5%')} color={'#fff'} />
                                <ButtonText style={globalStyles.buttonText}>
                                    Add
                                </ButtonText>
                            </Button>

                        </View>
                    </View>
                    {!props?.investmentDataList?.length &&
                        <EmptyState onAction={() =>  {verifyAndOpenAddModal()} } />
                    }
                    <FlatList
                        scrollEnabled={false}
                        contentContainerStyle={{ gap: hp('2%') }}
                        data={props?.investmentDataList}
                        renderItem={({ item }) => (
                            <InvestmentCardComponent investment={item} />
                        )}
                        keyExtractor={(item) => item?.investmentId}
                    />

                </View>

            </View>

        </Card>
    );
};

export default InvestmentInfo;