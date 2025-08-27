import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {Calendar} from 'react-native-big-calendar';

const EventDateKeeper = () => {
  const [events, setEvents] = useState([
  {
    title: 'Meeting',
    start: new Date(2020, 1, 11, 10, 0),
    end: new Date(2020, 1, 11, 10, 30),
  },
  {
    title: 'Coffee break',
    start: new Date(2020, 1, 11, 15, 45),
    end: new Date(2020, 1, 11, 16, 30),
  },
  ]);

  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventPress = (event: any) => {
    setSelectedEvent(event);
  };

  const updateEvent = () => {
    if (selectedEvent) {
      setEvents((prev) =>
        prev.map((ev) => (ev.id === selectedEvent.id ? selectedEvent : ev))
      );
    }
    setSelectedEvent(null);
  };

  return (
    <View style={styles.container}>
      <Calendar
        events={events}
        height={600}
        mode="month" // month/week/day
        swipeEnabled
        showTime={false}
        eventCellStyle={(event) => ({
          backgroundColor: event.color,
          borderRadius: 8,
        })}
        onPressEvent={handleEventPress}
      />

      {selectedEvent && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setSelectedEvent(null)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Edit Event</Text>

              <Text>Title:</Text>
              <TextInput
                style={styles.input}
                value={selectedEvent.title}
                onChangeText={(val) =>
                  setSelectedEvent({ ...selectedEvent, title: val })
                }
              />

              <Text>Client:</Text>
              <TextInput
                style={styles.input}
                value={selectedEvent.client}
                onChangeText={(val) =>
                  setSelectedEvent({ ...selectedEvent, client: val })
                }
              />

              <Text>Type:</Text>
              <TextInput
                style={styles.input}
                value={selectedEvent.type}
                onChangeText={(val) =>
                  setSelectedEvent({ ...selectedEvent, type: val })
                }
              />

              <Text>Color:</Text>
              <TextInput
                style={styles.input}
                value={selectedEvent.color}
                onChangeText={(val) =>
                  setSelectedEvent({ ...selectedEvent, color: val })
                }
              />

              <TouchableOpacity style={styles.saveButton} onPress={updateEvent}>
                <Text style={{ color: '#fff' }}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.saveButton, { backgroundColor: '#999', marginTop: 8 }]}
                onPress={() => setSelectedEvent(null)}
              >
                <Text style={{ color: '#fff' }}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
});

export default EventDateKeeper;
