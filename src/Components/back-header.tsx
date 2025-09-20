import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';

interface BackHeaderProps {
  screenName?: string;
  children?: React.ReactNode;
  style?: any;
}

const BackHeader: React.FC<BackHeaderProps> = ({ screenName, children, style }) => {
  const globalStyles = useContext(StyleContext);

  return (
    <SafeAreaView>
      <Card style={[globalStyles.cardShadowEffect, { marginBottom: hp('1%') }]}>
        <View className="flex flex-row justify-start items-center gap-3" style={style}>
          {children ? (
            // Custom mode → render whatever children you pass
            children
          ) : (
            // Default mode → back button + text
            <>
              <Feather name="arrow-left" size={wp('7%')} color={'#000'} />
              {screenName && (
                <Text style={globalStyles.heading3Text}>{screenName}</Text>
              )}
            </>
          )}
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default BackHeader;
