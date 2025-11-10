import React, { useContext } from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import { ConnectivityContext } from '../providers/internet-connection/connectivity-provider';
import LottieView from 'lottie-react-native';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext } from '../providers/theme/global-style-provider';
const NoInternetPopup = () => {
    const globalStyles=useContext(StyleContext)
    const { isConnected } = useContext(ConnectivityContext);

    return (
        <Modal
            visible={!isConnected}
            transparent={true}
            animationType="slide"
        >
            <View style={styles.centeredView}>
                <View style={[styles.modalView,{backgroundColor:globalStyles.appBackground.backgroundColor}]}>
                    <LottieView
                        source={require('../assets/animations/connection_lost.json')}
                        autoPlay
                        loop
                        style={styles.mainAnimation}
                    />
                    <Text style={[globalStyles.headingText,globalStyles.themeTextColor]}>No Internet Connection</Text>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    mainAnimation: {
        width: wp('70%'),
        height: wp('50%'),
    },
    modalView: {
        margin: 20,
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
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Roboto-Regular',
        color: "#0C1421"
    },
});

export default NoInternetPopup;