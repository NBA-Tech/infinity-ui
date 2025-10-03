import { Card } from '@/components/ui/card';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableNativeFeedbackComponent } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { FormFields } from '@/src/types/common';
import { EventModel, PRIORITY_STYLES } from '@/src/types/event/event-type';
import { patchState, validateValues } from '@/src/utils/utils';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { TouchableOpacity } from 'react-native';
import { createNewEventAPI, deleteEventAPI, getEventBasedMonthYearAPI, updateEventAPI } from '@/src/api/event/event-api-service';
const styles = StyleSheet.create({
  dot: {
    width: wp('3%'),
    height: wp('3%'),
    borderRadius: wp('100%')
  },
  container: {
    justifyContent: 'center',
  },
  modalContainer: {
    padding: wp('3%'),
    borderRadius: wp('3%'),
    backgroundColor: '#1E1E2A'
  },
});

const EventDateKeeper = () => {
  const globalStyles = useContext(StyleContext);
  const [selectedDate, setSelectedDate] = useState('');
  const { isDark } = useContext(ThemeToggleContext);
  const [open, setOpen] = useState(false);
  const [currEventDetails, setCurrEventDetails] = useState<EventModel>();
  const [loadingProvider, setLoadingProvider] = useState({ intialLoading: false, saveLoading: false,deleteLoading:false });
  const [errors, setErrors] = useState({});
  const [eventDetails, setEventDetails] = useState<EventModel[]>([]);
  const [eventMarkedDate, setEventMarkedDate] = useState({});
  const { getItem } = useDataStore();
  const showToast = useToastMessage();


  const eventFields: FormFields = {
    eventTitle: {
      parentKey: "event",
      key: "eventTitle",
      label: "Event Title",
      placeholder: "Eg : Birthday Party",
      type: "text",
      icon: <Feather name="event" size={wp("5%")} color="#8B5CF6" />,
      style: "w-full",
      isRequired: true,
      isDisabled: false,
      isLoading: loadingProvider.intialLoading,
      value: currEventDetails?.eventTitle ?? "",
      onChange: (value: string) => {
        patchState("", "eventTitle", value, true, setCurrEventDetails, setErrors);
      }
    },
    eventDescription: {
      parentKey: "event",
      key: "eventDescription",
      label: "Event Description",
      placeholder: "Eg : Birthday Party",
      type: "text",
      icon: <Feather name="event" size={wp("5%")} color="#8B5CF6" />,
      style: "w-full",
      isRequired: true,
      isDisabled: false,
      isLoading: loadingProvider.intialLoading,
      value: currEventDetails?.eventDescription ?? "",
      onChange: (value: string) => {
        patchState("", "eventDescription", value, true, setCurrEventDetails, setErrors);
      }
    },
    eventPriority: {
      parentKey: "event",
      key: "eventPriority",
      label: "Event Priority",
      placeholder: "Eg : Birthday Party",
      type: "select",
      icon: <Feather name="event" size={wp("5%")} color="#8B5CF6" />,
      style: "w-full",
      isRequired: true,
      isDisabled: false,
      isLoading: loadingProvider.intialLoading,
      dropDownItems: [{ label: "HIGH", value: "HIGH" }, { label: "MEDIUM", value: "MEDIUM" }, { label: "LOW", value: "LOW" }, { label: "URGENT", value: "URGENT" }],
      value: currEventDetails?.eventPriority ?? "",
      onChange: (value: string) => {
        patchState("", "eventPriority", value, true, setCurrEventDetails, setErrors);
      }
    }
  }
  const editOrDeleteEvent = (event: EventModel) => {
    setCurrEventDetails(event);
    setOpen(true);
  }
  // Appointment Card Component
  const AppointmentCard = ({ item }: { item: EventModel }) => (
    <TouchableOpacity onPress={() => editOrDeleteEvent(item)}>
      <View
        className="mx-4 rounded-2xl shadow-md bg-[#f5f5f5] p-4"
        style={[globalStyles.cardShadowEffect, { marginVertical: hp('0.5%'), marginHorizontal: wp('2%'), backgroundColor: isDark ? "#1F2028" : "#f5f5f5" }]}
      >
        {/* Row: Name + Status */}
        <View className="flex flex-row justify-between items-center">
          {/* Left: Calendar + Name */}
          <View className="flex flex-row items-center gap-3">
            <Feather name="calendar" size={wp('6%')} color={"#8B5CF6"} />
            <Text style={[globalStyles.heading3Text, , globalStyles.themeTextColor]}>{item.eventTitle}</Text>
          </View>

          {/* Right: Status */}
          <View style={[styles.dot, { backgroundColor: PRIORITY_STYLES[item.eventPriority]?.text?.color }]}>
          </View>
        </View>

        {/* Row: Date & Time */}
        <View className="mt-3 flex flex-row items-center space-x-4">
          <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>📅 {item.eventDate}</Text>
          <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>⏰ {item.eventPriority}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const resetEvent = () => {
    setOpen(false);
    setSelectedDate('');
    setCurrEventDetails(undefined);
  };
  const handleDelete = async () => {
    setLoadingProvider((prev) => ({ ...prev, deleteLoading: true }));

    const deleteEventResponse = await deleteEventAPI(currEventDetails?.eventId);

    if (!deleteEventResponse.success) {
      setLoadingProvider((prev) => ({ ...prev, saveLoading: false }));
      return showToast({
        type: "error",
        title: "Error",
        message: deleteEventResponse.message,
      });
    }

    showToast({
      type: "success",
      title: "Success",
      message: deleteEventResponse.message,
    });

    setLoadingProvider((prev) => ({ ...prev, deleteLoading: false }));
    resetEvent();
    const eventSplit= currEventDetails?.eventDate.split('-')
    console.log(eventSplit)
    await getMonthEvents(Number(eventSplit?.[1]), Number(eventSplit?.[0]));
  }

  const addOrUpdateEvent = async () => {
    const userId = getItem("USERID");
    const payload: EventModel = { ...currEventDetails, userId: userId };

    const isValid = validateValues(currEventDetails, eventFields);
    if (!isValid) {
      return showToast({
        type: "error",
        title: "Error",
        message: "Please fill all the required fields",
      });
    }

    setLoadingProvider((prev) => ({ ...prev, saveLoading: true }));

    let addOrUpdateEventResponse;
    if (payload?.eventId) {
      // Update existing event
      addOrUpdateEventResponse = await updateEventAPI(payload);
    } else {
      // Create new event
      addOrUpdateEventResponse = await createNewEventAPI(payload);
    }

    if (!addOrUpdateEventResponse.success) {
      setLoadingProvider((prev) => ({ ...prev, saveLoading: false }));
      return showToast({
        type: "error",
        title: "Error",
        message: addOrUpdateEventResponse.message,
      });
    }

    showToast({
      type: "success",
      title: "Success",
      message: addOrUpdateEventResponse.message,
    });

    // Update marked date
    setEventMarkedDate((prev) => ({
      ...prev,
      [payload?.eventDate]: {
        customStyles: PRIORITY_STYLES[payload?.eventPriority],
      },
    }));

    // Update local event details state
    setEventDetails((prevEventDetails) => {
      if (payload?.eventId) {
        // Replace existing event
        return prevEventDetails.map((event) =>
          event.eventId === payload.eventId ? payload : event
        );
      } else {
        // Add new event
        return [...prevEventDetails, payload];
      }
    });

    setLoadingProvider((prev) => ({ ...prev, saveLoading: false }));
    resetEvent();
  };


  const onDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    setCurrEventDetails((prevDetails) => ({ ...prevDetails, eventDate: day.dateString }));
    setOpen(true);
  };

  const getMonthEvents = async (month: number, year: number) => {
    setLoadingProvider((prevLoadingProvider) => ({ ...prevLoadingProvider, intialLoading: true }));
    const userId = getItem("USERID");
    const eventBasedMonthResponse = await getEventBasedMonthYearAPI(month, year, userId)
    if (!eventBasedMonthResponse.success) {
      setLoadingProvider((prevLoadingProvider) => ({ ...prevLoadingProvider, intialLoading: false }));
      return showToast({ type: "error", title: "Error", message: eventBasedMonthResponse.message });
    }
    setEventDetails(eventBasedMonthResponse.data)
    setEventMarkedDate(
      eventBasedMonthResponse.data.reduce((acc: any, event: any) => {
        if (event.eventDate && event.eventPriority) {
          acc[event.eventDate] = {
            customStyles: PRIORITY_STYLES[event.eventPriority] || PRIORITY_STYLES["LOW"]
          };
        }
        return acc;
      }, {})
    );
    setLoadingProvider((prevLoadingProvider) => ({ ...prevLoadingProvider, intialLoading: false }));

  }



  useEffect(() => {
    getMonthEvents(new Date().getMonth() + 1, new Date().getFullYear())
  }, [])
  useEffect(() => {
    console.log(eventMarkedDate)
  }, [eventMarkedDate])

  return (
    <Card>
      <Modal
        isVisible={open}
        onBackdropPress={resetEvent}
        onBackButtonPress={resetEvent}
      >
        <View style={styles.modalContainer}>
          <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Add Deliverable</Text>
          <CustomFieldsComponent infoFields={eventFields} cardStyle={{ padding: hp("2%") }} />
          <View className='flex flex-row justify-end items-center'>
            {currEventDetails?.eventId &&
              <Button
                size="sm"
                variant="solid"
                action="primary"
                onPress={handleDelete}
                style={[globalStyles.purpleBackground, { marginHorizontal: wp("2%"), backgroundColor: '#EF4444',borderRadius: wp("2%"),borderWidth: wp("0.5%"),borderColor: 'transparent' }]}
                isDisabled={loadingProvider.deleteLoading}
              >
                {loadingProvider.deleteLoading && (
                  <ButtonSpinner color={"#fff"} size={wp("4%")} />
                )}
                <Feather name="trash" size={wp("5%")} color="#fff" />
                <ButtonText style={globalStyles.buttonText}>Delete</ButtonText>
              </Button>

            }

            <Button
              size="sm"
              variant="solid"
              action="primary"
              style={[globalStyles.purpleBackground, { marginVertical: hp('2%') }]}
              onPress={addOrUpdateEvent}
              isDisabled={loadingProvider.saveLoading || Object.keys(errors).length > 0}
            >
              {loadingProvider.saveLoading && <ButtonSpinner color={"#fff"} size={wp("4%")} />}

              <Feather name="save" size={wp('5%')} color={'#fff'} />
              <ButtonText style={globalStyles.buttonText}>
                {loadingProvider.saveLoading ? "Saving..." : "Save"}
              </ButtonText>
            </Button>

          </View>

        </View>

      </Modal>
      {/* Header */}
      <View className="mb-2">
        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Event Calendar</Text>
        <Text style={[globalStyles.smallText, globalStyles.themeTextColor]}>Upcoming shoots and meetings</Text>
      </View>

      {/* Calendar */}
      <View style={[styles.container, { backgroundColor: isDark ? "#1F2028" : "#fff" }]}>
        <Calendar
          onDayPress={onDayPress}
          style={{ backgroundColor: isDark ? "#1F2028" : "#fff" }}
          markedDates={eventMarkedDate}
          onMonthChange={(value) => getMonthEvents(value?.month, value?.year)}
          markingType={'custom'}
          minDate={`${new Date().getFullYear()}-01-01`}
          maxDate={`${new Date().getFullYear() + 1}-12-31`}
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
          displayLoadingIndicator={loadingProvider.intialLoading}
        />
      </View>

      {/* Appointment List (Vertical FlatList) */}
      <FlatList
        horizontal
        data={eventDetails}
        keyExtractor={(item) => item.eventId}
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
