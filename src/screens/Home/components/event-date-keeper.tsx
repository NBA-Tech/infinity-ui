import { Card } from '@/components/ui/card';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext,ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  dot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('100%')
  },
  container: {
    justifyContent: 'center',
  },
});

const EventDateKeeper = () => {
  const globalStyles = useContext(StyleContext);
  const [selectedDate, setSelectedDate] = useState('');
  const { isDark } = useContext(ThemeToggleContext);

  // Predefined events with custom styles
  const staticMarkedDates = {
    '2025-09-01': {
      customStyles: {
        container: { backgroundColor: '#FFCDD2', borderRadius: 8 },
        text: { color: '#B71C1C', fontWeight: 'bold' },
      },
    },
    '2025-09-15': {
      customStyles: {
        container: { backgroundColor: '#BBDEFB', borderRadius: 8 },
        text: { color: '#0D47A1', fontWeight: 'bold' },
      },
    },
    '2025-09-25': {
      customStyles: {
        container: { backgroundColor: '#C8E6C9', borderRadius: 8 },
        text: { color: '#1B5E20', fontWeight: 'bold' },
      },
    },
  };

  // Merge user-selected date
  const markedDates = {
    ...staticMarkedDates,
    ...(selectedDate
      ? {
        [selectedDate]: {
          customStyles: {
            container: { backgroundColor: '#007AFF', borderRadius: 8 },
            text: { color: 'white', fontWeight: 'bold' },
          },
        },
      }
      : {}),
  };

  // Appointment Card Component
  const AppointmentCard = ({ item }: { item: any }) => (
    <View
      className="mx-4 rounded-2xl shadow-md bg-[#f5f5f5] p-4"
      style={[globalStyles.cardShadowEffect, { marginVertical: hp('0.5%'), marginHorizontal: wp('2%'),backgroundColor:isDark?"#1F2028":"#f5f5f5"}]}
    >
      {/* Row: Name + Status */}
      <View className="flex flex-row justify-between items-center">
        {/* Left: Calendar + Name */}
        <View className="flex flex-row items-center gap-3">
          <Feather name="calendar" size={wp('6%')} color={"#8B5CF6"} />
          <Text style={[globalStyles.heading3Text,,globalStyles.themeTextColor]}>{item.name}</Text>
        </View>

        {/* Right: Status */}
        <View style={[styles.dot, { backgroundColor: "red" }]}>
        </View>
      </View>

      {/* Row: Date & Time */}
      <View className="mt-3 flex flex-row items-center space-x-4">
        <Text style={[globalStyles.smallText,globalStyles.themeTextColor]}>📅 {item.date}</Text>
        <Text style={[globalStyles.smallText,globalStyles.themeTextColor]}>⏰ {item.time}</Text>
      </View>
    </View>
  );

  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  // Dummy appointment data
  const appointments = Array.from({ length: 10 }).map((_, i) => ({
    id: i.toString(),
    name: i % 2 === 0 ? 'Sarah' : 'Alex',
    date: i % 2 === 0 ? '04/09/2025' : '05/09/2025',
    time: i % 2 === 0 ? '10:30 AM' : '3:15 PM',
    status: i % 2 === 0 ? 'Pending' : 'Confirmed',
  }));

  return (
    <Card>
      {/* Header */}
      <View className="mb-2">
        <Text style={[globalStyles.heading3Text,globalStyles.themeTextColor]}>Event Calendar</Text>
        <Text style={[globalStyles.smallText,globalStyles.themeTextColor]}>Upcoming shoots and meetings</Text>
      </View>

      {/* Calendar */}
      <View style={[styles.container,{backgroundColor:isDark?"#1F2028":"#fff"}]}>
        <Calendar
          onDayPress={onDayPress}
          style={{backgroundColor:isDark?"#1F2028":"#fff"}}
          markedDates={markedDates}
          markingType={'custom'}
          minDate={'2025-01-01'}
          maxDate={'2026-12-31'}
          enableSwipeMonths={true}
          theme={{
            todayTextColor: isDark ? '#BB86FC' : '#fff',
            arrowColor: isDark ? '#BB86FC' : '#fff',
            monthTextColor: isDark ? '#FFFFFF' : '#fff',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            backgroundColor: isDark ? '#1F2028' : '#fff',
          }}
        />
      </View>

      {/* Appointment List (Vertical FlatList) */}
      <FlatList
        horizontal
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AppointmentCard item={item} />}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp('2%') }}
        style={{
          maxHeight: hp('30%'), // control visible list height
          marginVertical: hp('2%'),
        }}
      />
    </Card>
  );
};

export default EventDateKeeper;
