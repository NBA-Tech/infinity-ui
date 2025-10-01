import { Card } from '@/components/ui/card';
import React, { useContext, useEffect, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import Modal from 'react-native-modal';
import { ApiGeneralRespose, FormFields } from '@/src/types/common';
import { Deliverable, OrderModel } from '@/src/types/order/order-type';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { generateRandomString } from '@/src/utils/utils';
import { updateOrderDetailsAPI } from '@/src/api/order/order-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { COLORCODES } from '@/src/constant/constants';

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


type DeliverablesProps = {
    orderDetails: OrderModel
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderModel>>
}
const Deliverables = (props: DeliverablesProps) => {
    const globalStyles = useContext(StyleContext);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currDeliverable, setCurrDeliverable] = useState<Deliverable>();
    const showToast = useToastMessage();



    const addOrUpdateDeliverable = async () => {
        let updatedOrderDetails = undefined
        if (!currDeliverable?.id) {
            const updateData: Deliverable = {
                ...currDeliverable,
                id: generateRandomString(10),
            };

            updatedOrderDetails = {
                ...props.orderDetails,
                deliverables: [
                    ...(props.orderDetails?.deliverables ?? []),
                    updateData,
                ],
            };

            // instead of mutating props, call a setter or callback
        }
        setLoading(true)
        if (updatedOrderDetails) {
            const updateOrderResponse: ApiGeneralRespose = await updateOrderDetailsAPI(updatedOrderDetails)
            if (!updateOrderResponse?.success) {
                showToast({ type: "error", title: "Error", message: updateOrderResponse?.message });
                setLoading(false);
                return;
            }
            props?.setOrderDetails(updatedOrderDetails);
            setLoading(false);
            showToast({ type: "success", title: "Success", message: updateOrderResponse?.message });
            setOpen(false);
            setCurrDeliverable(undefined);

        }
    };


    const deliverableForm: FormFields = {
        name: {
            parentKey: "deliverables",
            key: "name",
            label: "Deliverable",
            placeholder: "Eg : ABC Company",
            icon: <Feather name="briefcase" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: currDeliverable?.name,
            onChange(value: string) {
                setCurrDeliverable(prev => ({ ...prev, name: value }))

            },
        },
        fileUrl: {
            parentKey: "deliverables",
            key: "fileUrl",
            label: "Link",
            placeholder: "Eg : https://abc.com",
            icon: <Feather name="link" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: currDeliverable?.fileUrl,
            onChange(value: string) {
                setCurrDeliverable(prev => ({ ...prev, fileUrl: value }))

            },
        }
    }
    const resetDeliverable = () => {
        setOpen(false);
        setCurrDeliverable(undefined);
    }

    const DeliverabelCardComponent = ({ deliverable }: { deliverable: Deliverable }) => {
        return (
            <Card
                style={[
                    styles.card,
                    globalStyles.cardShadowEffect,
                    {
                        borderLeftWidth: 4,
                        borderLeftColor: "#14B8A6",
                    },
                ]}
            >
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Deliverable Name</Text>
                        <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{deliverable?.name}</Text>
                    </View>
                    <View className='flex flex-row gap-2'>
                        <Feather name="edit" size={wp('5%')} color="#8B5CF6" />
                        <Feather name="trash-2" size={wp('5%')} color="#8B5CF6" />
                    </View>
                </View>
                <View>
                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Deliverable URL</Text>
                    <Text style={[globalStyles.labelText, globalStyles.underscoreText, globalStyles.greyTextColor]}>{deliverable?.fileUrl}</Text>
                </View>

            </Card>
        )
    }
    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            <Modal
                isVisible={open}
                onBackdropPress={resetDeliverable}
                onBackButtonPress={resetDeliverable}
            >
                <View style={styles.modalContainer}>
                    <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Add Deliverable</Text>
                    <CustomFieldsComponent infoFields={deliverableForm} cardStyle={{ padding: hp("2%") }} />
                    <Button
                        size="sm"
                        variant="solid"
                        action="primary"
                        style={[globalStyles.purpleBackground, { marginVertical: hp('2%') }]}
                        onPress={addOrUpdateDeliverable}
                        isDisabled={loading}
                    >
                        {loading && <ButtonSpinner color={"#fff"} size={wp("4%")} />}

                        <Feather name="save" size={wp('5%')} color={'#fff'} />
                        <ButtonText style={globalStyles.buttonText}>
                            {loading ? "Saving..." : "Save"}
                        </ButtonText>
                    </Button>
                </View>

            </Modal>

            <View>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="list" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Deliverables</Text>
                        </View>
                        <View>
                            <Button
                                size="sm"
                                variant="solid"
                                action="primary"
                                style={globalStyles.purpleBackground}
                                onPress={() => setOpen(true)}
                            >
                                <Feather name="plus" size={wp('5%')} color={'#fff'} />
                                <ButtonText style={globalStyles.buttonText}>
                                    Add
                                </ButtonText>
                            </Button>

                        </View>
                    </View>
                    <View>
                        <FlatList
                            data={props.orderDetails?.deliverables}
                            renderItem={({ item }) => (
                                <DeliverabelCardComponent deliverable={item} />
                            )}
                            keyExtractor={(item) => item.id}
                        />

                    </View>
                </View>

            </View>
        </Card>
    );
};

export default Deliverables;