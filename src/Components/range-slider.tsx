import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MultiSlider from "@esteemapp/react-native-multi-slider";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { ThemeToggleContext } from "../providers/theme/global-style-provider";

interface RangeSliderProps {
    min: number;
    max: number;
    step?: number;
    initialValues?: [number, number];
    onChange?: (values: [number, number]) => void;
}

const RangeSlider = ({
    min,
    max,
    step = 1,
    initialValues = [min, max],
    onChange,
}: RangeSliderProps) => {
    const { isDark } = useContext(ThemeToggleContext);
    const [values, setValues] = useState<[number, number]>(initialValues);

    const handleSliderChange = (newValues: number[]) => {
        const range = [newValues[0], newValues[1]] as [number, number];
        setValues(range);
        onChange?.(range);
    };

    // Custom marker with tooltip
    const CustomMarker = ({ currentValue }: { currentValue: number }) => (
        <View style={styles.markerWrapper}>
            <View style={styles.tooltipContainer}>
                <View
                    style={[
                        styles.tooltip,
                        { backgroundColor: isDark ? "#111" : "#8B5CF6" },
                    ]}
                >
                    <Text style={{ color: "#fff", fontSize: 12 }}>{currentValue}</Text>
                </View>
            </View>
            <View
                style={[
                    styles.marker,
                    { backgroundColor: "#8B5CF6" },
                ]}
            />
        </View>
    );


    return (
        <View style={styles.container}>
            <MultiSlider
                values={values}
                min={min}
                max={max}
                step={step}
                onValuesChange={handleSliderChange}
                selectedStyle={{ backgroundColor: "#8B5CF6" }}
                unselectedStyle={{ backgroundColor: isDark ? "#444" : "#ddd" }}
                customMarker={(e) => <CustomMarker currentValue={e.currentValue} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: hp("2%"),
    },
    markerWrapper: {
        alignItems: "center",
        justifyContent: "center",
    },
    tooltipContainer: {
        position: "absolute",
        bottom: 28, // push tooltip above the circle
        alignItems: "center",
    },
    tooltip: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    marker: {
        height: 20,
        width: 20,
        borderRadius: 10,
    },
});

export default RangeSlider;
