import React, { Component } from 'react';
import { ScrollView, View, Button, Image } from 'react-native';
import { Input } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../shared/baseUrl';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUrl: baseUrl + 'images/logo.png',
      username: '',
      password: ''
    }
  }
  render() {
    return (
      <ScrollView>
        <View style={{ justifyContent: 'center', margin: 20 }}>
          <View style={{ flex: 1, flexDirection: 'row', margin: 20 }}>
            <Image style={{ margin: 10, width: 80, height: 60 }} source={{ uri: this.state.imageUrl }} />
            <View style={{ justifyContent: 'center' }}>
              <Button title='Camera' onPress={() => this.getImageFromCamera()} />
            </View>
          </View>
          <Input placeholder='Username' leftIcon={{ type: 'font-awesome', name: 'user-o' }} value={this.state.username}
            onChangeText={(username) => this.setState({ username })} />
          <Input placeholder='Password' leftIcon={{ type: 'font-awesome', name: 'key' }} value={this.state.password}
            onChangeText={(password) => this.setState({ password })} />
          <View style={{ marginTop: 20 }}>
            <Button title='Register' color='#7cc' onPress={() => this.handleRegister()} />
          </View>
        </View>
      </ScrollView>
    );
  }
  async getImageFromCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status === 'granted') {
      const capturedImage = await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [4, 3] });
      if (!capturedImage.canceled) {
        this.setState({ imageUrl: capturedImage.assets[0].uri });
      }
    }
  }
  handleRegister() {
    alert('Coming soon!');
  }
}
export default Register; 

// import React, { Component } from 'react';
// import { ScrollView, View, Button, Image, Alert } from 'react-native';
// import { Input } from 'react-native-elements';
// import * as ImagePicker from 'expo-image-picker';
// import * as ImageManipulator from 'expo-image-manipulator';
// import { baseUrl } from '../shared/baseUrl';

// class Register extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       imageUrl: baseUrl + 'images/logo.png',
//       username: '',
//       password: '',
//     };
//   }

//   render() {
//     return (
//       <ScrollView>
//         <View style={{ justifyContent: 'center', margin: 20 }}>
//           <View style={{ flex: 1, flexDirection: 'row', margin: 20, alignItems: 'center' }}>
//             <Image
//               style={{ margin: 10, width: 80, height: 60 }}
//               source={{ uri: this.state.imageUrl }}
//             />
//             <View style={{ justifyContent: 'center', marginLeft: 10 }}>
//               <Button title="Camera" onPress={() => this.getImageFromCamera()} />
//             </View>
//             <View style={{ justifyContent: 'center', marginLeft: 10 }}>
//               <Button title="Choose From Library" onPress={() => this.getImageFromLibrary()} />
//             </View>
//           </View>

//           <Input
//             placeholder="Username"
//             leftIcon={{ type: 'font-awesome', name: 'user-o' }}
//             value={this.state.username}
//             onChangeText={(username) => this.setState({ username })}
//           />
//           <Input
//             placeholder="Password"
//             leftIcon={{ type: 'font-awesome', name: 'key' }}
//             value={this.state.password}
//             onChangeText={(password) => this.setState({ password })}
//           />
//           <View style={{ marginTop: 20 }}>
//             <Button title="Register" color="#7cc" onPress={() => this.handleRegister()} />
//           </View>
//         </View>
//       </ScrollView>
//     );
//   }

//   async getImageFromCamera() {
//     try {
//       const { status } = await ImagePicker.requestCameraPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Camera permission is required to take a photo.');
//         return;
//       }

//       const result = await ImagePicker.launchCameraAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         const uri = result.assets?.[0]?.uri ?? result.uri;
//         await this.processAndSetImage(uri);
//       }
//     } catch (err) {
//       console.log('Error taking image: ', err);
//       Alert.alert('Error', 'Could not take photo.');
//     }
//   }

//   async getImageFromLibrary() {
//     try {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       if (status !== 'granted') {
//         Alert.alert('Permission required', 'Permission to access media library is required.');
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });

//       if (!result.canceled) {
//         const uri = result.assets?.[0]?.uri ?? result.uri;
//         await this.processAndSetImage(uri);
//       }
//     } catch (err) {
//       console.log('Error picking image from library: ', err);
//       Alert.alert('Error', 'Could not pick image from library.');
//     }
//   }

//   // Resize image and convert to PNG, then update state with new local uri
//   async processAndSetImage(uri) {
//     try {
//       // Resize to width 400 (keeps aspect ratio). Adjust width if needed.
//       const manipResult = await ImageManipulator.manipulateAsync(
//         uri,
//         [{ resize: { width: 400 } }],
//         { compress: 1, format: ImageManipulator.SaveFormat.PNG }
//       );

//       // manipResult.uri points to the resized PNG file (local)
//       this.setState({ imageUrl: manipResult.uri });
//     } catch (err) {
//       console.log('Image manipulation error:', err);
//       Alert.alert('Error', 'Failed to process the image.');
//     }
//   }

//   handleRegister() {
//     Alert.alert('Register', 'Coming soon!');
//   }
// }

// export default Register;