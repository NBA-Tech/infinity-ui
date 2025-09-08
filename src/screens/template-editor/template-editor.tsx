import React, { useContext, useRef, useMemo, useCallback, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { StyleContext } from "@/src/providers/theme/global-style-provider";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Card } from "@/components/ui/card";
import Feather from "react-native-vector-icons/Feather";
import { SafeAreaView } from "react-native-safe-area-context";
import BackHeader from "@/src/components/back-header";
import Draggable from "react-native-draggable";
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TextBox from "./text-box";


const styles = StyleSheet.create({
  footerButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  cardWrapper: {
    borderTopLeftRadius: wp("8%"),
    borderTopRightRadius: wp("8%"),
    width: wp("100%"),
  },
  sheetContent: {
    flex: 1,
    padding: wp("4%"),
    backgroundColor: "#fff",
    borderTopLeftRadius: wp("8%"),
    borderTopRightRadius: wp("8%"),
  },
  elementContainer: {
    width: wp("28%"),
    marginVertical: hp("1%"),
    borderRadius: wp("2%"),
    backgroundColor: "#fff",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  }
});


// reusable box component
const ElementBox = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => {
  const globalStyles = useContext(StyleContext);
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <Card className="flex flex-col justify-center items-center" style={styles.elementContainer}>
        <MaterialCommunityIcons name={icon} size={wp("8%")} color="#000" />
        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
          {label}
        </Text>
      </Card>
    </TouchableOpacity>
  );
};

const TemplateEditor = () => {
  const globalStyles = useContext(StyleContext);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [elements, setElements] = useState<any[]>([]);

  // snap points
  const snapPoints = useMemo(() => ["100%"], []);

  const handleOpenSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleAddElement = (type: string) => {
    setElements((prev) => [...prev, { id: Date.now().toString(), type }]);
  };

  const renderElement = (type: string) => {
    switch (type) {
      case "Text":
        return <MaterialCommunityIcons name="format-text" size={wp("10%")} color="#000" />;
      case "Image":
        return <MaterialCommunityIcons name="image" size={wp("10%")} color="#000" />;
      case "Table":
        return <MaterialCommunityIcons name="table" size={wp("10%")} color="#000" />;
      case "Canvas":
        return <MaterialCommunityIcons name="image-edit" size={wp("10%")} color="#000" />;
      case "Divider":
        return <MaterialCommunityIcons name="minus" size={wp("10%")} color="#000" />;
      default:
        return null;
    }
  };

  const renderEditableComponent=(type: string)=> {
    switch(type){
      case 'Text':
        return <TextBox/>
    }
  }

  return (
    <SafeAreaView style={[globalStyles.appBackground, { flex: 1 }]}>
      <BackHeader screenName="Template Editor" />

      {/* Draggable Area */}
      <View style={{ flex: 1 }}>
        {elements.map((el) => (
          <Draggable key={el.id}>
            <Card className="p-2 bg-white rounded-xl">
              {renderEditableComponent(el.type)}
            </Card>
          </Draggable>
        ))}
      </View>

      {/* Footer Button */}
      <View style={styles.footerButton}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleOpenSheet}>
          <Card style={styles.cardWrapper}>
            <View className="flex flex-col justify-between items-center p-2">
              <Feather name="chevron-up" size={wp("7%")} color="#000" />
              <Text
                style={[
                  globalStyles.normalTextColor,
                  globalStyles.smallText,
                ]}
              >
                Add Template
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      </View>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        enablePanDownToClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            pressBehavior="close"
          />
        )}
        backgroundStyle={{ backgroundColor: globalStyles.themeBackground }}
        handleIndicatorStyle={{
          backgroundColor: globalStyles.isDark ? "#fff" : "#000",
        }}
      >

        <BottomSheetView style={[styles.sheetContent]}>
          <View className="flex flex-row justify-between items-center">
            <Text
              style={[
                globalStyles.normalTextColor,
                globalStyles.subHeadingText,
              ]}
            >
              Template Options
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginVertical: hp("2%"),
              width: "100%",
            }}
          >
            <ElementBox icon="format-text" label="Text" onPress={() => handleAddElement("Text")} />
            <ElementBox icon="image" label="Image" onPress={() => handleAddElement("Image")} />
            <ElementBox icon="table" label="Table" onPress={() => handleAddElement("Table")} />
            <ElementBox icon="image-edit" label="Canvas" onPress={() => handleAddElement("Canvas")} />
            <ElementBox icon="minus" label="Divider" onPress={() => handleAddElement("Divider")} />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default TemplateEditor;
