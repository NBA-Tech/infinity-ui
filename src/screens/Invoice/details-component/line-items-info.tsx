import { Card } from '@/components/ui/card';
import React, { useContext } from 'react';
import { View,Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
const LineItemsInfo = () => {
    const globalStyles = useContext(StyleContext);
    const {isDark}=useContext(ThemeToggleContext);

    const LineItemsCardComponent=()=>{
        return(
            <View className='rounded-xl p-4' style={{borderWidth:1,borderColor:isDark ? '#fff' : '#000'}}>
                <View className='flex flex-row justify-between items-center'>
                    <View>
                        <Text style={[globalStyles.labelText,globalStyles.subHeadingText,globalStyles.themeTextColor]}>Item Name</Text>
                        <Text style={[globalStyles.labelText,globalStyles.greyTextColor]}>hello</Text>
                    </View>

                     <View>
                        <Text style={[globalStyles.labelText,globalStyles.themeTextColor]}>1 X $200</Text>
                        <Text style={[globalStyles.labelText,globalStyles.greyTextColor]}>$1200</Text>
                    </View>

                </View>

            </View>
        )
    }
    return (
        <Card style={[globalStyles.cardShadowEffect]}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="list" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Line Items</Text>

                    </View>
                    <View className='flex flex-col gap-3'>
                        <LineItemsCardComponent/>
                        <LineItemsCardComponent/>
                        <LineItemsCardComponent/>

                    </View>
                    <View className='flex flex-row justify-end items-end'>
                        <Text style={[globalStyles.labelText,globalStyles.themeTextColor]}>Total: $1200</Text>

                    </View>

                </View>

            </View>
        </Card>
    );
};

export default LineItemsInfo;