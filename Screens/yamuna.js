import *as React from "react"
import { View, Button, Text, Platform } from "react-native"
import *as ImagePicker from "expo-image-picker"
import *as Permissions from "expo-permissions"
import * as axios from "axios"
import { result } from "lodash"
export default class Picker extends React.Component {
    constructor() {
        super()
        this.state = {
            image: null
        }
    }

    getPermission = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (status !== "granted") {
                alert(" sorry, give permission to camera")
            }
        }
    }

    componentDidMount() {
        this.getPermission()
    }

    uploadImage=async(uri)=>{
        const Data= new FormData()
        var filename=uri.split("/")[uri.split("/").length-1]
        console.log(filename)
        var type=`image/${uri.split('.')[uri.split('.').length - 1]}`
        console.log(type)
      //console.log(type)

        const fileupload={
            uri:uri,
            name:filename,
            type:type
        }
       Data.append("digit",fileupload)
       const url="https://41c2d6d6e0b8.ngrok.io/predict-digit"
       await axios({
        method:"post",
        url:url,
        data:Data,
       config:{ headers: {
        "content-type": "multipart/form-data",
      }}
    })
      .then((response)=>response)
      .then((result)=>{
        console.log("Sucess:", result.data)
      })
      .catch((error)=>{
        console.error("Error :", error)

      })

      }


    pickImage = async () => {
        try {
            var result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                aspect: [8, 10],
                allowsEditing: true,
                quality: 1
            })
            if (!result.cancelled) {
                this.setState({
                    image: result.data
                })

                // console.log(result.uri)
                this.uploadImage(result.uri)
            }

        }

        catch (E) {
            console.log(E)
        }
    }




    render() {
        return (
            <View style={{alignItems:"center", marginTop:400}}>
                <Button title="Take a picture from Gallary" color="red" onPress={this.pickImage}/>
                <Text>{result.data}</Text>
            </View>
        )
    }
}
