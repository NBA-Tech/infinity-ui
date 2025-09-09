import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from "react-native";
import { StyleContext } from "@/src/providers/theme/global-style-provider";
import { Card } from "@/components/ui/card";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Dropdown } from "react-native-element-dropdown";
import Feather from "react-native-vector-icons/Feather";
import { CustomFieldsComponent } from "@/src/components/fields-component";
import { FormFields } from "@/src/types/common";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Button, ButtonText } from "@/components/ui/button";
const styles = StyleSheet.create({
    cardContainer: {
        padding: wp("2%"),
        borderRadius: wp("2%"),
        backgroundColor: "#fff",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    contentContainer: {
        flex: 1,
        justifyContent: "center",
    },
    text: {
        marginBottom: hp("1%"),
        textAlign: "center",
    },
    dropdown: {
        height: hp("5%"),
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: wp("1%"),
        paddingHorizontal: wp("2%"),
    },
    dropdownContainer: {
        paddingHorizontal: 0,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        width: wp("80%"),
        backgroundColor: "#fff",
        borderRadius: wp("2%"),
        padding: wp("4%"),
    },
    closeButton: {
        alignSelf: "flex-end",
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});

const TextBox = () => {
    const globalStyles = useContext(StyleContext);
    const [showModal, setShowModal] = useState(false);
    const [layout, setLayout] = useState({
        width: 150,
        height: 120,
        colorCode: "#000000",
    });
    const [selected, setSelected] = useState(null);

    const formFields: FormFields = {
        width: {
            key: "width",
            label: "Width",
            placeholder: "Eg : 100%",
            icon: <FontAwesome name="text-width" size={wp("5%")} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            value: String(layout.width),
            isRequired: false,
            isDisabled: false,
            onChange: (value: number) => {
                setLayout({
                    ...layout,
                    width: value,
                });
            }
        },
        height: {
            key: "height",
            label: "Height",
            placeholder: "Eg : 100%",
            icon: <FontAwesome name="text-width" size={wp("5%")} color="#8B5CF6" />,
            type: "number",
            style: "w-full",
            value: String(layout.height),
            isRequired: false,
            isDisabled: false,
            onChange: (value: number) => {
                setLayout({
                    ...layout,
                    height: value,
                });
            }
        },
        colorCode: {
            key: "colorCode",
            label: "Color Code",
            placeholder: "Eg : #000000",
            icon: <FontAwesome name="text-width" size={wp("5%")} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: false,
            value: layout.colorCode,
            isDisabled: false,
            onChange: (value: string) => {
                setLayout({
                    ...layout,
                    colorCode: value,
                });
            }
        }
    };

    return (
        <View>
            {/* Modal */}
            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                            <Feather name="x" size={wp("6%")} color="#000" />
                        </Pressable>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text, { marginBottom: hp("1%") }]}>
                            TextBox Settings
                        </Text>
                        <CustomFieldsComponent infoFields={formFields} />
                    </View>

                </View>
            </Modal>

            {/* Card */}
            <TouchableOpacity onLongPress={() => setShowModal(true)}>
                <Card style={[styles.cardContainer, { width: layout.width, height: layout.height }]}>
                    <View style={styles.contentContainer}>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text, styles.text]}>
                            TextBox
                        </Text>
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.dropdownContainer}
                            data={[
                                { label: "Heading", value: "heading" },
                                { label: "Address", value: "address" },
                                { label: "Normal", value: "normal" },
                            ]}
                            labelField="label"
                            valueField="value"
                            value={selected}
                            onChange={(item) => setSelected(item.value)}
                            placeholder="Select type"
                            placeholderStyle={[globalStyles.labelText, { color: "#808080" }]}
                            selectedTextStyle={globalStyles.labelText}
                            maxHeight={200}
                            searchPlaceholder="Search..."
                        />
                    </View>
                </Card>
            </TouchableOpacity>
        </View>
    );
};

export default TextBox;
