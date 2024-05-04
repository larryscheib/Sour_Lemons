import React, { useContext } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import CustomButton from "../HOC/CustomButton";
import { colors } from "../../constants/color";
import * as ImagePicker from "expo-image-picker";
import AppContext from "../../contexts/AppContext";

const Button = ({ onPress, onlyButton, ...props }) => {
  const {
    globalState: { user },
    updateUser,
  } = useContext(AppContext);

  const { firstName, lastName, profileImageUri } = { ...user };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      updateUser({ profileImageUri: result.assets[0].uri });
    }
  };

  const clearImage = async () => {
    updateUser({ profileImageUri: null });
  };

  if (onlyButton) {
    return (
      <Pressable onPress={onPress}>
          <Image
            source={require("../../assets/back_arrow.png")}
            style={styles.buttonImage}
            {...props}
          />
      </Pressable>
    );
  }

  return (
    <View>
      <Text style={styles.label}>Button</Text>
      <View style={styles.container}>
        {profileImageUri && (
          <Image
            source={{ uri: profileImageUri }}
            style={styles.buttonContainer}
            {...props}
          />
        )}
        {!profileImageUri && (
          <View style={styles.buttonContainer}>
            <Text style={styles.text}>
              {firstName?.slice(0, 1)}
              {lastName?.slice(0, 1)}
            </Text>
          </View>
        )}

        <CustomButton text={"Change"} onPress={pickImage} />
        {profileImageUri && (
          <CustomButton text={"Remove"} onPress={clearImage} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 5,
    fontSize: 10,
    fontWeight: "bold",
    color: "gray",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  ButtonContainer: {
    backgroundColor: colors.GREEN,
    height: 68,
    width: 68,
    border: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  headerButton: {
    backgroundColor: colors.YELLOW,
    height: 30,
    width: 30,
    fontSize: 10,
    border: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  ButtonImage: {
    height: 30,
    width: 30,
   borderRadius: 50,
  },
  headerButtonText: {
    color: colors.GRAY,
    fontSize: 10,
  },
  text: { color: colors.GRAY, fontSize: 30 },
});
export default Button;
