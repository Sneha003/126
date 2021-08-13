import React from "react";
import { StyleSheet, Text, View, Button, Platform } from "react-native";
import * as Permissions from "expo-permissions";
import * as axios from "axios";
import * as ImagePicker from "expo-image-picker";
export default class Camera extends React.Component {
  constructor() {
    super();
    this.state = {
      image: null,
    };
  }
  getPermissions = async () => {
    if (Platform.OS !== "web") {
      const { status } = await Permissions.getAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("sorry, give a permission to open camera");
      }
    }
  };
  uploadImage = async (uri) => {
    const Data = new FormData();
    var fileName = uri.split("/")[uri.split("/").length - 1];
    console.log(fileName);

    // spliting the image uri from fileName/ base 64
    //data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4TV
    var type = `image/${uri.split(".")[uri.split(".").length - 1]}`
    console.log(type);

    const fileupload = {
      uri: uri,
      name: fileName,
      type: type,
    };

    Data.append("digit", fileupload);
    const url = "https://41c2d6d6e0b8.ngrok.io/predict-digit";
    await axios({
      method: "post",
      url: url,
      data: Data,
      config: {
        headers: {
          "content-type":"multipart/form-data",
        },
      },
    })
      .then((response) => response)
      .then((result) => {
        console.log("success: ", result.data);
      })
      .catch((error) => {
        consoloe.log("error: ", error);
      });
  };

  pickImage = async () => {
    try {
      var result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
        aspect: [8, 10],
      });
      //  != true
      if (!result.cancelled) {
        // console.log(result.uri);
        this.setState({
          image: result.data,
        });

        this.uploadImage(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this.getPermissions();
  }
  render() {
    return (
      <View
        style={{ width: 400, height: 30, marginTop: 300, alignSelf: "center" }}
      >
        <Button
          title="Pick the Image from Gallery"
          color="red"
          onPress={this.pickImage}
        ></Button>
      </View>
    );
  }
}
