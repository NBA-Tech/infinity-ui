import React, { useContext, useMemo, useState } from 'react';
import { View, Text } from 'react-native';
import Modal from 'react-native-modal';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import { Divider } from '@/components/ui/divider';
import RangeSlider from './range-slider';
import { FormFields, SearchQueryRequest } from '../types/common';
import Feather from 'react-native-vector-icons/Feather';
import { getCountries, getStates, patchState } from '../utils/utils';
import { CustomFieldsComponent } from './fields-component';
import { LEADSOURCE } from '../types/customer/customer-type';
import { Button, ButtonText } from '@/components/ui/button';
import { OrderStatus } from '../types/order/order-type';
import { ORDERSTATUS } from '../constant/constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
type FilterComponentProps = {
    openFilter: boolean
    filters?: SearchQueryRequest
    extraValue?: Record<any, any>
    filterName: string
    setFilters?: React.Dispatch<React.SetStateAction<SearchQueryRequest>>
    setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>

}
const FilterComponent = (props: FilterComponentProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [values, setValues] = useState([100, 500]);
    const customerFormFields: FormFields = useMemo(() => ({
        country: {
            parentKey: "userBillingInfo",
            key: "country",
            label: "Country",
            placeholder: "Select Country",
            icon:  <MaterialIcons name="public" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: props?.filters?.filters?.["customerBillingInfo.country"] ?? "",
            dropDownItems: getCountries().map((country) => ({
                label: country.name,
                value: country.isoCode,
            })),
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    filters: {
                        ...prev?.filters,
                        "customerBillingInfo.country": value
                    }
                }))
            }
        },
        state: {
            parentKey: "userBillingInfo",
            key: "state",
            label: "State (Note : Select Country First)",
            placeholder: "Select State",
            icon: <Feather name="map-pin" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            type: "select",
            style: "w-full",
            isRequired: false,
            isDisabled: false,
            value: props?.filters?.filters?.["customerBillingInfo.state"]?.state ?? "",
            dropDownItems: getStates(props?.filters?.filters?.["customerBillingInfo.country"] ?? "").map((state) => ({
                label: state.name,
                value: state.isoCode
            })),
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    filters: {
                        ...prev?.filters,
                        "customerBillingInfo.state": value
                    }
                }))
            }
        },
        dateSort: {
            parentKey: "dateSort",
            key: "dateSort",
            label: "Date Sort",
            type: "select",
            style: "w-full",
            icon: <MaterialIcons name="sort" size={wp('5%')} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
            value: props?.filters?.sortOrder === "DESC" ? "LATEST" : "OLDEST" ?? "",
            dropDownItems: ["LATEST", "OLDEST"].map((dateSort) => ({
                label: dateSort,
                value: dateSort
            })),
            isSearchable: false,
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    sortField: "createdDate",
                    sortOrder: value === "LATEST" ? "DESC" : "ASC"
                }))
            }
        },
    }), [props?.filters, props?.extraValue]);

    const orderFormFields: FormFields = useMemo(() => ({
        customerName: {
            parentKey: "customerName",
            key: "customerName",
            label: "Customer Name",
            type: "select",
            style: "w-full",
            dropDownItems: props?.extraValue?.customerList,
            value: props?.filters?.filters?.["orderBasicInfo.customerID"] ?? "",
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    filters: {
                        ...prev?.filters,
                        "orderBasicInfo.customerID": value
                    }
                }))
            }
        },
        orderStatus: {
            parentKey: "orderStatus",
            key: "orderStatus",
            label: "Order Status",
            type: "select",
            style: "w-full",
            dropDownItems: ORDERSTATUS.map((orderStatus) => ({
                label: orderStatus,
                value: orderStatus
            })),
            value: props?.filters?.filters?.status ?? "",
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    filters: {
                        ...prev?.filters,
                        status: value
                    }
                }))
            }
        },
        sortDate: {
            parentKey: "sortDate",
            key: "sortDate",
            label: "Sort Date By",
            type: "select",
            style: "w-full",
            value: props?.filters?.sortOrder === "DESC" ? "LATEST" : "OLDEST" ?? "",
            dropDownItems: ["LATEST", "OLDEST"].map((dateSort) => ({
                label: dateSort,
                value: dateSort
            })),
            isSearchable: false,
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    sortField: "eventInfo.eventDate",
                    sortOrder: value === "LATEST" ? "DESC" : "ASC"
                }))
            }
        },

    }), [props?.filters, props?.extraValue]);

    const invoiceFormFields:FormFields=useMemo(()=>({
        customerName: {
            parentKey: "customerName",
            key: "customerName",
            label: "Customer Name",
            type: "select",
            style: "w-full",
            dropDownItems: props?.extraValue?.customerList,
            value: props?.filters?.filters?.["customerId"] ?? "",
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    filters: {
                        ...prev?.filters,
                        "customerId": value
                    }
                }))
            }
        },
        orderType:{
            parentKey: "orderType",
            key: "orderType",
            label: "Order Name",
            type: "select",
            style: "w-full",
            dropDownItems: props?.extraValue?.orderList,
            value: props?.filters?.filters?.["orderId"] ?? "",
            onChange: (value: string) => {
                props?.setRefresh(true)
                props?.setFilters(prev => ({
                    ...prev,
                    page: 1,
                    filters: {
                        ...prev?.filters,
                        "orderId": value
                    }
                }))
            }

        },
    }),[props?.filters,props?.extraValue])

    const filterComponents = {
        customer: {
            label: 'Customer Filter',
            component: () => (
                <CustomFieldsComponent infoFields={customerFormFields} />
            )
        },
        orders: {
            label: 'Order Filter',
            component: () => (
                <CustomFieldsComponent infoFields={orderFormFields} />
            )
        },
        invoice:{
            label: 'Invoice Filter',
            component:()=><CustomFieldsComponent infoFields={invoiceFormFields} />
        }
    }
    return (
        <Modal
            isVisible={props?.openFilter}
            onBackdropPress={() => props?.setOpenFilter(false)}
            onBackButtonPress={() => props?.setOpenFilter(false)}
        >
            <View className='flex flex-col rounded-xl' style={{ backgroundColor:globalStyles.formBackGroundColor.backgroundColor, padding: wp('5%') }}>
                <View style={{ padding: wp('2%') }}>
                    <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>{filterComponents[props?.filterName].label}</Text>
                    <Divider />
                </View>
                <View style={{ marginVertical: hp('2%') }}>
                    {filterComponents[props?.filterName].component()}
                    <Divider style={{ marginVertical: hp('2%') }} />
                    <View className='flex flex-row justify-end items-center gap-2'>
                        <Button size="md" variant="solid" action="primary" style={globalStyles.transparentBackground} onPress={() => props?.setOpenFilter(false)}>
                            <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor, globalStyles.themeTextColor]}>Cancel</ButtonText>
                        </Button>
                        <Button size="md" variant="solid" action="primary" style={globalStyles.buttonColor} onPress={() => {
                            props?.setOpenFilter(false)
                            props?.setFilters(prev => ({ page: 1,pageSize: 10 }))
                        }
                        }>
                            <ButtonText style={[globalStyles.buttonText]}>Reset</ButtonText>
                        </Button>

                    </View>


                </View>

            </View>

        </Modal>
    );
};

export default FilterComponent;