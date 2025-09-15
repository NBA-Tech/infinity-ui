import { Accordion, AccordionContent, AccordionHeader, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import React, { useContext } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import CheckBox from '@react-native-community/checkbox';
import { Divider } from '@/components/ui/divider';
import { QuotaionHtmlInfo } from '@/src/types/order/order-type';
import { Button, ButtonText } from '@/components/ui/button';

const styles = StyleSheet.create({
    accordionHeader: {
        height: hp('8%'),
    },
});
type TemplateBuilderComponentProps = {
    quotationFields: any
    handleCheckboxChange: (value: any, stateKeyMap: Record<string, string>) => void
    templateValueData: any
}
const TemplateBuilderComponent = ({ quotationFields, handleCheckboxChange, templateValueData }: TemplateBuilderComponentProps) => {
    const globalStyles = useContext(StyleContext);


    const handleOnChange = (value: boolean, field: any, sectionKey: string) => {
        let updatedQuotationHtmlInfo: QuotaionHtmlInfo[] = [
            ...templateValueData.quotationHtmlInfo,
        ];

        if (value) {
            if (!updatedQuotationHtmlInfo.some((item) => item.key === field.key)) {
                updatedQuotationHtmlInfo.push({
                    key: field.key,
                    section: sectionKey,
                    html: field.html,
                });
            }
        } else {
            updatedQuotationHtmlInfo = updatedQuotationHtmlInfo.filter(
                (item) => item.key !== field.key
            );
        }

        console.log(updatedQuotationHtmlInfo)
        handleCheckboxChange(updatedQuotationHtmlInfo, { parentKey: 'quotationHtmlInfo', childKey: '' });
    }

    return (
        <View style={{ marginTop: hp('2%') }}>
            <Accordion
                size="md"
                variant="unfilled"
                type="single"
                isCollapsible
                isDisabled={false}
            >
                {Object.entries(quotationFields)?.map(([sectionKey, item]: [string, any], index: number) => (
                    <AccordionItem key={sectionKey} value={sectionKey}>
                        <AccordionHeader style={styles.accordionHeader}>
                            <AccordionTrigger>
                                {({ isExpanded = true }: { isExpanded: boolean }) => (
                                    <>
                                        <View className="flex flex-row items-center justify-between">
                                            {item?.icon}
                                            <Text
                                                style={[globalStyles.heading3Text, { marginLeft: wp('2%') }]}
                                            >
                                                {item?.label}
                                            </Text>
                                           
                                        </View>
                                        {isExpanded ? (
                                            <Feather name="chevron-up" size={wp('5%')} color="#000" />
                                        ) : (
                                            <Feather name="chevron-down" size={wp('5%')} color="#000" />
                                        )}
                                    </>
                                )}
                            </AccordionTrigger>
                        </AccordionHeader>
                        <AccordionContent>
                            {item?.fields?.map((field: any, fieldIndex: number) => (
                                <View>
                                    <View
                                        key={`${sectionKey}-${field?.heading ?? fieldIndex}`}
                                        className="flex flex-row justify-between items-center"
                                        style={{ margin: wp('1.2%') }}>
                                        <View className="flex flex-row items-center gap-3">
                                            {field?.icon}
                                            <View className="flex flex-col ml-2">
                                                <Text style={[globalStyles.heading3Text, { width: wp('70%'), flexWrap: 'wrap' }]}>{field?.heading}</Text>
                                                <Text style={[globalStyles.labelText, { width: wp('70%'), flexWrap: 'wrap' }]} >{field?.description}</Text>
                                            </View>
                                        </View>
                                        <CheckBox value={field?.isSelected} onValueChange={(value) => handleOnChange(value, field, sectionKey)} />
                                    </View>
                                    <Divider />
                                </View>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </View>
    );
};

export default TemplateBuilderComponent;
