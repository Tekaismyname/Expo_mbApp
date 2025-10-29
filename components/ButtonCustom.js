import React from "react";
import { TouchableOpacity, Text } from "react-native";

const ButtonCustom = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "black",
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Text style={{ color: "white", fontWeight: "bold" }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;
