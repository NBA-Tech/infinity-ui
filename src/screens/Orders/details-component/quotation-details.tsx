import React, { useContext, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import Modal from 'react-native-modal';
import TemplatePreview from '../components/template-preview';
import { formatDate } from '@/src/utils/utils';

const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
        borderWidth: 1,
        borderColor: '#000'
    }
})

type QuotationDetailsProps = {
    htmlCode: string
    createdOn: Date
}
const QuotationDetails = (props: QuotationDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const [open,setOpen] = useState(false);
    console.log(props?.htmlCode)

    const actionButtons = [
        {
            id: 1,
            label: 'Share',
            icon: <Feather name="share-2" size={wp('5%')} color={'#000'} />,
        },
        {
            id: 2,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={'#000'} />,
        },
    ]
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <Modal
                isVisible={open}
                onBackdropPress={() => setOpen(false)}
                onBackButtonPress={() => setOpen(false)}
            >
                <View style={globalStyles?.appBackground}>
                    <TemplatePreview html={props?.htmlCode} />
                </View>

            </Modal>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="file" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={globalStyles.heading3Text}>Quotation</Text>
                        </View>
                    </View>

                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Quotation Preview</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Created On: {formatDate(props?.createdOn)}</Text>
                        </View>
                        
                        <TouchableOpacity onPress={() => setOpen(true)}>
                            <Feather name="eye" size={wp('5%')} color={'#000'} />
                        </TouchableOpacity>
                    </View>

                    <View className='flex flex-row justify-between items-center' >
                        {actionButtons.map((action) => (
                            <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                {action.icon}
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>{action.label}</ButtonText>
                            </Button>
                        ))
                        }
                    </View>

                </View>

            </View>
        </Card>
    );
};

export default QuotationDetails;