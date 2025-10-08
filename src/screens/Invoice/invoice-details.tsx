import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import BackHeader from '@/src/components/back-header';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Button, ButtonText } from '@/components/ui/button';
import { ApiGeneralRespose, RootStackParamList } from '@/src/types/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import CustomerInfo from './details-component/customer-info';
import InvoiceInfo from './details-component/invoice-info';
import LineItemsInfo from './details-component/line-items-info';
import { getInvoiceDetailsAPI } from '@/src/api/invoice/invoice-api-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { Invoice } from '@/src/types/invoice/invoice-type';


type Props = NativeStackScreenProps<RootStackParamList, "InvoiceDetails">;

const InvoiceDetails = ({ route, navigation }: Props) => {
    const { invoiceId } = route?.params;
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [invoiceDetails, setInvoiceDetails] = useState<Invoice>();
    const showToast = useToastMessage();
    const [loading,setLoading]=useState(false)

    const actionButtons = [
        {
            id: 3,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        }
    ]


    const getInvoiceDetails=async()=>{
        setLoading(true)
        const invoiceDetails:ApiGeneralRespose= await getInvoiceDetailsAPI(invoiceId as string)
        setLoading(false)
        if(!invoiceDetails.success){
            showToast({type:"error",title:"Error",message:invoiceDetails.message})
        }
        else{
            console.log(invoiceDetails?.data)
            setInvoiceDetails(invoiceDetails?.data)
        }
    }
    useEffect(()=>{
        getInvoiceDetails()
    },[invoiceId])
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader>
                <View className='flex flex-col'>
                    <View className="flex flex-row justify-between items-center w-full">
                        {/* Left side */}
                        <View className="flex flex-row items-center gap-3">
                            <Feather name="arrow-left" size={wp('7%')} color={isDark ? '#fff' : '#000'} />
                            <View className="flex flex-col">
                                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Invoice Details</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>
                                    #{invoiceId}
                                </Text>
                            </View>
                        </View>
                        <View className='flex flex-row justify-between items-center gap-2' style={{ marginVertical: hp('2%') }}>
                            {actionButtons.map((action) => (
                                <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                    {action.icon}
                                </Button>
                            ))
                            }
                        </View>

                    </View>

                </View>
            </BackHeader>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >

                <View className='flex flex-col gap-5'>
                    <View>
                        <CustomerInfo customerData={invoiceDetails?.billingInfo} loading={loading}/>
                    </View>
                    <View>
                        <InvoiceInfo invoiceDetails={invoiceDetails} loading={loading}/>
                    </View>
                    {/* <View>
                        <LineItemsInfo />
                    </View> */}

                </View>
            </ScrollView>

        </SafeAreaView>
    );
};

export default InvoiceDetails;