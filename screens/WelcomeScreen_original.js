import * as React from 'react';
import { View, Image, StyleSheet, Text, Pressable } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View >
      <Image
        style={styles.logo}
        source={ require("../assets/littleLemonLogo.png") }
      />
      <Text style={styles.textStyle}>Little Lemon, your local Mediterranean Bistro</Text>
      <Pressable onPress={ () => navigation.navigate("Onboard") }>
        <Text style={styles.buttonStyle}>Newsletter</Text>
      </Pressable>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container : {
    marginLeft: 25,
    marginRight: 25,
  },
  logo : {
    marginTop: 40,
    marginLeft: 75,
    height: 120,
    width: 200,
    resizeMode: "contain"
  },
  textStyle : {
    marginTop: 30,
    marginBottom: 30,
    fontSize: 19,
    textAlign: 'center'
  },
  inputStyle : {
    marginBottom: 20,
    fontSize: 16,
    borderColor: "#000000",
    borderWidth: 1,
    height: 40,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
})