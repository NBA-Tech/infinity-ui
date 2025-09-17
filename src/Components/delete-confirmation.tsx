import React, { useContext } from 'react';
import { View,Text } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import Modal from 'react-native-modal';



type DeleteConfirmationProps={
    openDelete: boolean;
    loading: boolean;
    setOpenDelete: React.Dispatch<React.SetStateAction<boolean>>
    handleDelete: () => void;
}
const DeleteConfirmation = (props: DeleteConfirmationProps) => {
    const globalStyles = useContext(StyleContext);
    return (
        <Modal
                isVisible={props?.openDelete}
                onBackdropPress={() => props?.setOpenDelete(false)}
                onBackButtonPress={() => props?.setOpenDelete(false)}
            >
                <View style={{ backgroundColor: '#fff', padding: wp('5%'), borderRadius: wp('3%'), alignItems: 'center' }}>
                    <View className='flex flex-col justify-between items-center' style={{ padding: wp('2%') }}>
                        <View>
                            <Feather name="alert-triangle" size={wp('10%')} color="red" />
                        </View>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Are you sure you want to delete this service?</Text>
                        </View>
                        <View className="flex flex-row justify-end items-center mt-4">
                            <Button
                                size="lg"
                                variant="solid"
                                action="primary"
                                style={[globalStyles.transparentBackground, { marginHorizontal: wp("2%") }]}
                                onPress={() => props?.setOpenDelete(false)}
                            >
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>
                                    Cancel
                                </ButtonText>
                            </Button>

                            <Button
                                size="lg"
                                variant="solid"
                                action="primary"
                                onPress={props?.handleDelete}
                                style={[globalStyles.purpleBackground, { marginHorizontal: wp("2%"), backgroundColor: '#EF4444' }]}
                                isDisabled={props?.loading}
                            >
                                {props?.loading && (
                                    <ButtonSpinner color={"#fff"} size={wp("4%")} />
                                )}
                                <Feather name="trash" size={wp("5%")} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Delete</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>

            </Modal>
    );
};

export default DeleteConfirmation;