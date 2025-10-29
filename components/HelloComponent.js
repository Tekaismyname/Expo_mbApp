import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from "react-native";
import ButtonCustom from "./ButtonCustom";

class Hello extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "HKD",
      age: 21,
      weight: 80,
    };
  }

  render() {
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // iOS sẽ đẩy nội dung lên
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "white",
              padding: 20,
            }}
          >
            {/* Input field Name */}
            <TextInput
              style={styles.inputName}
              placeholder="Enter your name"
              value={this.state.name}
              onChangeText={(value) => this.setState({ name: value })}
            />

            {/* Input field Age */}
            <TextInput
              style={styles.input}
              placeholder="Enter your age"
              keyboardType="numeric"
              value={this.state.age.toString()}
              onChangeText={(value) =>
                this.setState({ age: parseInt(value) || 0 })
              }
            />

            {/* Input field Weight */}
            <TextInput
              style={styles.input}
              placeholder="Enter your weight"
              keyboardType="numeric"
              value={this.state.weight.toString()}
              onChangeText={(value) =>
                this.setState({ weight: parseInt(value) || 0 })
              }
            />

            {/* Hiển thị dữ liệu */}
            <Text style={{ margin: 20, fontSize: 16 }}>Hello world!</Text>
            <Text style={{ fontWeight: "bold", fontStyle: "italic" }}>
              My name is {this.state.name}
            </Text>
            <Text style={{ color: "red" }}>I'm {this.state.age} years old</Text>
            <Text style={{ backgroundColor: "cyan" }}>
              and my weight is {this.state.weight} kg
            </Text>

            {/* Button */}
            <View style={styles.buttonRow}>
              <ButtonCustom
                title="NEXT YEAR"
                onPress={() => this.onPressNextYear()}
              />
              <ButtonCustom
                title="PREV YEAR"
                onPress={() => this.onPressPreviousYear()}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }

  onPressNextYear() {
    this.setState((prev) => ({
      age: prev.age + 1,
      weight: prev.weight + 2,
    }));
  }

  onPressPreviousYear() {
    this.setState((prev) => ({
      age: prev.age - 1,
      weight: prev.weight - 2,
    }));
  }
}

const styles = {
  inputName: {
    height: 40,
    width: 200,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "lightyellow",
  },
  input: {
    height: 40,
    width: 200,
    borderColor: "black",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "lightblue",
  },
  buttonRow: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20, // RN >=0.71, nếu cũ hơn dùng marginRight
  },
};

export default Hello;
