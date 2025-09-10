import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import Feather from 'react-native-vector-icons/Feather';
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import ServiceTab from './service-tab';
import PackageTab from './package-tab';
const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
    tabContainer: {
        width: wp('45%'),
        paddingVertical: hp('1.5%'),  // vertical padding for touch
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 3,        // only bottom border
        borderBottomColor: 'transparent', // default (inactive tab)
    },
    activeTab: {
        borderBottomColor: '#7C3AED', // purple color for active tab
    },

})
const services = () => {
    const globalStyles = useContext(StyleContext);
    const [activeTab, setActiveTab] = useState('services');
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader screenName='Services' />
            <View>
                <View className='bg-[#fff]' style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text]}>Services & Package</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                        </View>
                    </View>

                    <View
                        className="flex flex-row items-center gap-3"
                        style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Services/Packages"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />

                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>

                    <View className='flex flex-row justify-between items-center' style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                        <TouchableOpacity style={[styles.tabContainer, activeTab === 'services' && styles.activeTab]} onPress={() => setActiveTab('services')}>
                            <Text style={[globalStyles.normalBoldText]}>Services</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.tabContainer, activeTab === 'packages' && styles.activeTab]} onPress={() => setActiveTab('packages')}>
                            <Text style={[globalStyles.normalBoldText]}>Packages</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {activeTab === 'services' && <ServiceTab />}
                {activeTab === 'packages' && <PackageTab />}
            </View>
        </SafeAreaView>
    );
};

export default services;