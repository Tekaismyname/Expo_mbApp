import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  Switch,
  Button,
  Alert,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";
import DropDownPicker from "react-native-dropdown-picker";
import { Calendar } from "react-native-calendars";
import * as Animatable from "react-native-animatable";
import { format } from "date-fns";

class Reservation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      guests: "1",
      smoking: false,
      date: new Date(),
      showCalendar: false,
      open: false,
      markedDates: {},
      items: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
        { label: "6", value: "6" },
      ],
    };
  }

  // Khi chọn ngày
  onDayPress = (day) => {
    const selectedDate = new Date(day.timestamp);
    this.setState({
      date: selectedDate,
      showCalendar: false,
      markedDates: {
        [day.dateString]: {
          selected: true,
          selectedColor: "#7cc",
          selectedTextColor: "#fff",
        },
      },
    });
  };

  // Reset form
  resetForm = () => {
    this.setState({
      guests: "1",
      smoking: false,
      date: new Date(),
      markedDates: {},
    });
  };

  // Xử lý đặt bàn
  handleReservation = () => {
    const { guests, smoking, date } = this.state;

    Alert.alert(
      "Confirm Reservation",
      `Guests: ${guests}\nSmoking: ${smoking ? "Yes" : "No"}\nDate: ${format(
        date,
        "dd/MM/yyyy"
      )}\n\nProceed with booking?`,
      [
        { text: "Cancel",
          onPress: () => {
            Alert.alert("Cancelled!", "Your table has been cancel successfully!", this.resetForm());
          }, },
        {
          text: "OK",
          onPress: () => {
            Alert.alert("Booked!", "Your table has been reserved successfully!", [
              { text: "Great!", onPress: this.resetForm },
            ]);
          },
        },
      ],
      { cancelable: true }
    );
  };

  render() {
    const { date, showCalendar, markedDates } = this.state;

    return (
      <ScrollView>
        <Animatable.View animation="zoomIn" duration={1000}>
          {/* Number of Guests */}
          <View style={[styles.formRow, { zIndex: 5000 }]}>
            <Text style={styles.formLabel}>Number of Guests</Text>
          <View style={{ flex: 1 }}>
            <DropDownPicker
              open={this.state.open}
              value={this.state.guests}
              items={this.state.items}
              setOpen={(open) => this.setState({ open })}
              setValue={(cb) =>
                this.setState((state) => ({
                  guests: cb(state.guests),
                }))
              }
              setItems={(cb) =>
                this.setState((state) => ({
                  items: cb(state.items),
                }))
              }
              placeholder="Select guests"
              listMode="SCROLLVIEW"      // ⭐ QUAN TRỌNG – KHÔNG GÂY LỖI NỮA
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                height: 40,
              }}
              dropDownContainerStyle={{
                borderWidth: 1,
                borderColor: "#ccc",
              }}
            />
          </View>
          </View>

          {/* Smoking */}
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
            <Switch
              value={this.state.smoking}
              onValueChange={(value) => this.setState({ smoking: value })}
              trackColor={{ true: "#7cc" }}
              thumbColor={this.state.smoking ? "#7cc" : "#f4f3f4"}
            />
          </View>

          {/* Date + Calendar */}
          <View style={styles.formRow}>
            <Text style={styles.formLabel}>Date</Text>
            <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
              <Icon
                name="calendar-today"
                type="material"
                color="#7cc"
                size={36}
                onPress={() => this.setState({ showCalendar: true })}
              />
              <Text style={{ marginLeft: 15, fontSize: 17 }}>
                {format(date, "dd/MM/yyyy")}
              </Text>
            </View>
          </View>

          {/* Calendar Popup */}
          {showCalendar && (
            <View style={styles.calendarContainer}>
              <Calendar
                onDayPress={this.onDayPress}
                markedDates={markedDates}
                minDate={new Date()}
                theme={{
                  backgroundColor: "#ffffff",
                  calendarBackground: "#ffffff",
                  textSectionTitleColor: "#b6c1cd",
                  selectedDayBackgroundColor: "#7cc",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: "#7cc",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  arrowColor: "#7cc",
                  monthTextColor: "#7cc",
                  textDayFontWeight: "500",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "600",
                }}
              />
              <Button title="Close" color="#999" onPress={() => this.setState({ showCalendar: false })} />
            </View>
          )}

          {/* Reserve Button */}
          <View style={styles.formRow}>
            <View style={styles.reserveButton}>
              <Button title="Reserve Table" color="#7cc" onPress={this.handleReservation} />
            </View>
          </View>
        </Animatable.View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  formRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    margin: 20,
  },
  formLabel: {
    fontSize: 18,
    flex: 2,
    fontWeight: "600",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    height: 40,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
  },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    overflow: "hidden",
  },
  reserveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.37,
    shadowRadius: 10,
    backgroundColor: "rgba(16, 17, 17, 1)", // nền chính
    // Gradient hiệu ứng (tùy chọn, đẹp hơn nữa)
    backgroundColor: "transparent",
  },
});

export default Reservation;