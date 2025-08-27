import React, { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Feather from "react-native-vector-icons/Feather";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import BackHeader from "@/src/Components/BackHeader";
import { StyleContext } from "@/src/providers/theme/GlobalStyleProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Divider } from "@/components/ui/divider";
import { GeneralInfo } from "./GeneralInfo";
import ProjectInfo from "./OrderInfo";
import InvoiceInfo from "./InvoiceInfo";

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        margin: wp('2%')
    },
    detailsContainer: {
        marginVertical: hp('2%'),
        gap: hp('2%')
    },
    scene: {
        flex: 1
    }
})


const DeliverablesRoute = () => (
    <ScrollView style={styles.scene} contentContainerStyle={{ padding: 16 }}>
        <Text>Deliverables</Text>
    </ScrollView>
);

const renderScene = SceneMap({
    general: GeneralInfo,
    projects: ProjectInfo,
    invoices: InvoiceInfo,
    deliverables: DeliverablesRoute,
});

// ---------------- Main Screen ----------------
export default function CustomerDetailsScreen() {
    const globalStyles = useContext(StyleContext);
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "general", title: "General", icon: "briefcase" },
        { key: "projects", title: "Projects", icon: "briefcase" },
        { key: "invoices", title: "Invoices", icon: "briefcase" },
        { key: "deliverables", title: "Deliverables", icon: "briefcase" },
    ]);

    const renderTabBar = (props: any) => (
        <TabBar
            {...props}
            style={{ backgroundColor: '#fff' }}
            indicatorStyle={{ backgroundColor: '#8B5CF6', height: 3, borderRadius: 2 }}
            activeColor="#111827"
            inactiveColor="#6B7280"
            pressColor="rgba(139,92,246,0.15)"
            tabStyle={{ width: 'auto' }}
        />
    );


    return (
        <SafeAreaView style={[globalStyles.appBackground, { flex: 1 }]}>
            {/* Header */}
            <BackHeader screenName="Customer Details" />

            {/* Top Info Section */}
            <View style={styles.infoContainer}>
                <View
                    className="flex flex-row justify-between items-center gap-4"
                    style={{ marginHorizontal: wp("4%") }}
                >
                    <Avatar
                        style={{
                            backgroundColor: "#8B5CF6",
                            transform: [{ scale: 1.2 }],
                        }}
                    >
                        <AvatarFallbackText style={globalStyles.whiteTextColor}>
                            Arlene McCoy
                        </AvatarFallbackText>
                    </Avatar>

                    <View className="flex flex-col justify-center">
                        <Text style={globalStyles.heading2Text}>Arlene McCoy</Text>
                        <Text
                            style={[
                                globalStyles.smallText,
                                globalStyles.normalTextColor,
                            ]}
                        >
                            Created On : 25/7/2023
                        </Text>
                    </View>

                    <View
                        className="flex flex-row justify-end items-center"
                        style={{ flex: 1 }}
                    >
                        <Feather name="edit" size={wp("6%")} color={"#8B5CF6"} />
                    </View>
                </View>
            </View>

            {/* Tab View */}
            <View style={{ flex: 1, marginTop: hp('2%') }}>
                <TabView
                    commonOptions={{
                        icon: ({ route, focused, color }) => (
                            <Feather
                                name={route.icon}
                                size={wp("5%")}
                                color={focused ? "#8B5CF6" : "#6B7280"}
                            />
                        ),
                    }}
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    initialLayout={{ width: wp("100%") }}
                    renderTabBar={renderTabBar}
                />
            </View>
        </SafeAreaView>
    );
}

