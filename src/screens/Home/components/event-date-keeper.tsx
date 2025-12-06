import { Card } from '@/components/ui/card';
import React, { useContext, useEffect, useMemo, useState } from 'react';
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
import Tooltip, { Placement } from 'react-native-tooltip-2';
import { useReloadContext } from '@/src/providers/reload/reload-context';
import { Divider } from '@/components/ui/divider';
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
  },
});

const EventDateKeeper = () => {
  const globalStyles = useContext(StyleContext);
  const [selectedDate, setSelectedDate] = useState('');
  const { isDark } = useContext(ThemeToggleContext);
  const [open, setOpen] = useState(false);
  const [currEventDetails, setCurrEventDetails] = useState<EventModel>();
  const [loadingProvider, setLoadingProvider] = useState({ intialLoading: false, saveLoading: false, deleteLoading: false });
  const [errors, setErrors] = useState({});
  const [eventDetails, setEventDetails] = useState<EventModel[]>([]);
  const [eventMarkedDate, setEventMarkedDate] = useState({});
  const { getItem } = useDataStore();
  const [toolTipVisible, setToolTipVisible] = useState(false);
  const showToast = useToastMessage();
  const { reloadOrders } = useReloadContext()

  const calendarStyleTheme = useMemo(
    () => ({
      // === Base Background ===
      backgroundColor: isDark ? "#0E1628" : "#FFFFFF",
      calendarBackground: isDark ? "#0E1628" : "#FFFFFF",

      // === Header (Month / Arrows) ===
      textSectionTitleColor: isDark ? "#9CA3AF" : "#6B7280",     // Mon, Tue… (Day headers)
      monthTextColor: isDark ? "#FFFFFF" : "#182D53",           // JAN 2025
      arrowColor: isDark ? "#3B82F6" : "#2563EB",
      indicatorColor: isDark ? "#3B82F6" : "#2563EB",

      // === Normal Days ===
      dayTextColor: isDark ? "#E5E7EB" : "#111827",              // normal dates
      textDisabledColor: isDark ? "#4B5563" : "#9CA3AF",         // grayed out dates
      todayTextColor: isDark ? "#3B82F6" : "#2563EB",            // today's date

      // === Selected Day ===
      selectedDayBackgroundColor: isDark ? "#3B82F6" : "#2563EB",
      selectedDayTextColor: "#FFFFFF",

      // === Dots / Markers ===
      dotColor: isDark ? "#3B82F6" : "#2563EB",
      selectedDotColor: "#FFFFFF",

      // === Fonts - Replacing fontWeight with fontFamily ===
      // Note: Use the exact PostScript name of your linked font files.
      // 500 -> OpenSans-Medium
      textDayFontFamily: "OpenSans-Medium",
      // 700 -> OpenSans-Bold
      textMonthFontFamily: "OpenSans-Bold",
      // 600 -> OpenSans-SemiBold
      textDayHeaderFontFamily: "OpenSans-SemiBold",

      // Remove the separate textDayFontWeight, textMonthFontWeight, textDayHeaderFontWeight
      // textDayFontWeight: "500",
      // textMonthFontWeight: "700",
      // textDayHeaderFontWeight: "600",

      // === Manual Styles Override (Using fontFamily instead of fontWeight) ===
      textDayStyle: {
        color: isDark ? "#E5E7EB" : "#111827",
        fontFamily: "OpenSans-Medium", // Replaces fontWeight: "500"
      },

      'stylesheet.calendar.header': {
        week: {
          marginTop: 6,
          flexDirection: "row",
          justifyContent: "space-between",
        },
        monthText: {
          fontSize: 18,
          // This was already correct, just ensuring it stays:
          fontFamily: "OpenSans-Bold",
          color: isDark ? "#FFFFFF" : "#182D53",
        },
        // Also apply to dayHeader (Mon, Tue, Wed...) if not covered by textDayHeaderFontFamily
        dayHeader: {
          fontFamily: "OpenSans-SemiBold",
          // Also inherit or set color if needed
          color: isDark ? "#9CA3AF" : "#6B7280",
        }
      },
    }),
    [isDark]
  );



  const eventFields: FormFields = {
    eventTitle: {
      parentKey: "event",
      key: "eventTitle",
      label: "Event Title",
      placeholder: "Eg : Birthday Party",
      type: "text",
      icon: <Feather name="calendar" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
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
      icon: <Feather name="clipboard" size={wp("5%")} color={isDark ? "#fff" : "#000"} />,
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
      icon: <Feather name="flag" size={wp("5%")} style={{ paddingRight: wp('3%') }} color={isDark ? "#fff" : "#000"} />,
      style: "w-full",
      isRequired: true,
      isDisabled: false,
      isLoading: loadingProvider.intialLoading,
      dropDownItems: [{ label: "HIGH", value: "HIGH" }, { label: "MEDIUM", value: "MEDIUM" }, { label: "LOW", value: "LOW" }, { label: "URGENT", value: "URGENT" },{ label: "EXPOSING", value: "EXPOSING" }],
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
  const AppointmentCard = ({ item }: { item: EventModel }) => {
    return (
      <TouchableOpacity onPress={() => editOrDeleteEvent(item)}>
        <View
          style={[
            globalStyles.cardShadowEffect,
            {
              marginVertical: hp("1%"),
              paddingVertical: hp("2%"),
              paddingHorizontal: wp("4%"),
              borderRadius: wp("4%"),
              backgroundColor: isDark ? "#1A2238" : "#FFFFFF",
            },
          ]}
        >
          {/* Top Row → Icon + Title + Priority Dot */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

            {/* Left side */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  backgroundColor: isDark ? "#3B82F6" : "#2563EB",
                  padding: wp("2%"),
                  borderRadius: wp("2%"),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather name="calendar" size={wp("6%")} color="#FFF" />
              </View>

              <Text
                style={[
                  globalStyles.heading3Text,
                  globalStyles.themeTextColor,
                  { marginLeft: wp("3%"), width: wp('20%') }
                ]}
                numberOfLines={1}
              >
                {item.eventTitle}
              </Text>
            </View>

            {/* Status Dot */}
            <View
              style={{
                width: wp("3%"),
                height: wp("3%"),
                borderRadius: wp("3%"),
                backgroundColor: PRIORITY_STYLES[item.eventPriority]?.text?.color,
              }}
            />
          </View>

          {/* Date & Time Row */}
          <View
            style={{
              marginTop: hp("1.5%"),
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: wp("4%"),
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="clock" size={wp("4.5%")} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                style={[
                  globalStyles.smallText,
                  globalStyles.themeTextColor,
                  { marginLeft: wp("1.5%") }
                ]}
              >
                {item.eventPriority}
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="calendar" size={wp("4.5%")} color={isDark ? "#9CA3AF" : "#6B7280"} />
              <Text
                style={[
                  globalStyles.smallText,
                  globalStyles.themeTextColor,
                  { marginLeft: wp("1.5%") }
                ]}
              >
                {item.eventDateString}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
    const eventSplit = currEventDetails?.eventDateString.split('-')
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
      [payload?.eventDateString]: {
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
    const selectedDateObj = new Date(day.dateString);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selected = new Date(selectedDateObj);
    selected.setHours(0, 0, 0, 0);

    if (selected < today) {
      return showToast({
        type: "error",
        title: "Error",
        message: "Cannot select past date",
      });
    }

    setSelectedDate(day.dateString);
    setCurrEventDetails((prevDetails) => ({ ...prevDetails, eventDateString: day.dateString, eventDate: selectedDateObj }));
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
        if (event.eventDateString && event.eventPriority) {
          acc[event.eventDateString] = {
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
  }, [reloadOrders])

  return (
    <Card>
      <Modal
        isVisible={open}
        onBackdropPress={resetEvent}
        onBackButtonPress={resetEvent}
      >
        <View style={[styles.modalContainer, globalStyles.formBackGroundColor]}>
          <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Add Deliverable</Text>
          <CustomFieldsComponent infoFields={eventFields} cardStyle={{ padding: hp("2%") }} />
          <View className='flex flex-row justify-end items-center'>
            {currEventDetails?.eventId &&
              <Button
                size="md"
                variant="solid"
                action="primary"
                onPress={handleDelete}
                style={[globalStyles.buttonColor, { marginHorizontal: wp("2%"), backgroundColor: '#EF4444' }]}
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
              size="md"
              variant="solid"
              action="primary"
              style={[globalStyles.buttonColor, { marginVertical: hp('2%') }]}
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
      <View className="mb-2" style={{ marginBottom: hp('1%') }}>
        <View className='flex flex-row justify-between items-center'>
          <View>
            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Event Calendar</Text>
          </View>
          <View>
            <Tooltip
              isVisible={toolTipVisible}
              content={<Text style={globalStyles.normalText}>This Widget helps you keep track of your events</Text>}
              placement={Placement.BOTTOM}
              onClose={() => setToolTipVisible(false)}>
              <TouchableOpacity onPress={() => setToolTipVisible(true)}>
                <Feather name="info" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
              </TouchableOpacity>

            </Tooltip>
          </View>
        </View>
      </View>
      <Divider style={{ marginVertical: hp('1.5%') }} />

      {/* Calendar */}
      <View style={[styles.container, { backgroundColor: isDark ? "#0E1628" : "#fff" }]}>
        <Calendar
          key={isDark ? 'dark' : 'light'}
          onDayPress={onDayPress}
          style={{
            backgroundColor: isDark ? "#0E1628" : "#FFFFFF",
            borderRadius: 10,
          }}
          markedDates={eventMarkedDate}
          onMonthChange={(value) => getMonthEvents(value?.month, value?.year)}
          markingType={'custom'}
          minDate={`${new Date().getFullYear()}-01-01`}
          maxDate={`${new Date().getFullYear() + 1}-12-31`}
          enableSwipeMonths={true}
          theme={calendarStyleTheme}
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
        contentContainerStyle={{ paddingBottom: hp('2%'), gap: wp('2%') }}
        style={{
          maxHeight: hp('30%'), // control visible list height
          marginVertical: hp('2%'),
        }}
      />
    </Card>
  );
};

export default EventDateKeeper;
