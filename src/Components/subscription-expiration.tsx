import { View, Text,StyleSheet } from "react-native";
import { useSubscription } from "../providers/subscription/subscription-context";
import { formatDate, isExpiringSoon } from "../utils/utils";
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from "react-native-responsive-screen";
import Feather from 'react-native-vector-icons/Feather';
import { useContext } from "react";
import { StyleContext } from "../providers/theme/global-style-provider";

const styles = StyleSheet.create({
    subscriptionAlert: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        backgroundColor: "#FFCDD2",   // light red/pink background
    },
});


const SubscriptionExpiration = () => {
    const { subscriptionDetails } = useSubscription()
    const globalStyles=useContext(StyleContext)
    return (
        <View>
            {isExpiringSoon(subscriptionDetails?.endDate) && (
                <View style={styles.subscriptionAlert}>
                    <Feather name="alert-triangle" size={20} color="#B71C1C" style={{ marginRight: 8 }} />
                    <Text style={globalStyles.labelText}>
                        Your subscription ends on {formatDate(subscriptionDetails?.endDate)}
                    </Text>
                </View>
            )
            }
        </View>
    );
};

export default SubscriptionExpiration;