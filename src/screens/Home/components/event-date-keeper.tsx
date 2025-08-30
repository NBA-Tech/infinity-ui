import { Card } from '@/components/ui/card';
import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
  dot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('100%')
  },
  container: {
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
});

const EventDateKeeper = () => {
  const globalStyles = useContext(StyleContext);
  const [selectedDate, setSelectedDate] = useState('');

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
      style={[globalStyles.cardShadowEffect, { marginVertical: hp('0.5%'), marginHorizontal: wp('2%') }]}
    >
      {/* Row: Name + Status */}
      <View className="flex flex-row justify-between items-center">
        {/* Left: Calendar + Name */}
        <View className="flex flex-row items-center gap-3">
          <Feather name="calendar" size={wp('6%')} color="#000" />
          <Text style={globalStyles.heading3Text}>{item.name}</Text>
        </View>

        {/* Right: Status */}
        <View style={[styles.dot, { backgroundColor: "red" }]}>
        </View>
      </View>

      {/* Row: Date & Time */}
      <View className="mt-3 flex flex-row items-center space-x-4">
        <Text style={globalStyles.smallText}>📅 {item.date}</Text>
        <Text style={globalStyles.smallText}>⏰ {item.time}</Text>
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
        <Text style={globalStyles.heading3Text}>Event Calendar</Text>
        <Text style={globalStyles.smallText}>Upcoming shoots and meetings</Text>
      </View>

      {/* Calendar */}
      <View style={styles.container}>
        <Calendar
          onDayPress={onDayPress}
          markedDates={markedDates}
          markingType={'custom'}
          minDate={'2025-01-01'}
          maxDate={'2026-12-31'}
          enableSwipeMonths={true}
          theme={{
            todayTextColor: '#FF5733',
            arrowColor: '#007AFF',
            monthTextColor: '#000',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
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
