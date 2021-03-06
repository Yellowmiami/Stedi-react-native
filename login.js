import { useState } from "react";
import { SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Text } from "react-native";

async function sendText(phoneNumber){
  console.log("Phone Number:",phoneNumber);
  await fetch('https://dev.stedi.me/twofactorlogin/'+phoneNumber, 
  {
    method: "POST",
    headers:
    {
      'content-type':'application/text'
    }
  });
}

const getToken= async({oneTimePassword, phoneNumber, setUserLoggedIn, setUserName}) =>
{
  console.log("This should log you in");
  const tokenResponse=await fetch("https://dev.stedi.me/twofactorlogin",
  {
    method: 'POST',
    headers:
    {
      "content-type":"application/json"
    },
    body:JSON.stringify({oneTimePassword, phoneNumber})
  });
  const response=tokenResponse.status;
  
  console.log("Response status", response) 
    if (response==200) {    
    setUserLoggedIn(true);
  }
  const tokenResponseString= await tokenResponse.text();
  const name= await fetch ("https://dev.stedi.me/validate/" + tokenResponseString,
  
{
  method: "GET",
  headers:  {
    "content-type": "application/json"
  },
});

const userName= await name.text();
console.log ("Username is", userName);
setUserName(userName);
}

  const Login=(props) =>{
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oneTimePassword, setOneTimePassword] = useState(null);


  return (
    <SafeAreaView style={styles.margin}>
      <TextInput
        style={styles.input}
        onChangeText={setPhoneNumber}
        value={phoneNumber}
        placeholder="760-998-6756"
        placeholderTextColor='#4251f5'
      />
      <TextInput
        style={styles.input}
        onChangeText={setOneTimePassword}
        value={oneTimePassword}
        placeholder="1234"
        placeholderTextColor='#4251f5'
        keyboardType="numeric"
        secureTextEntry={true}
      />
      <TouchableOpacity
      style={styles.button}
      onPress={()=>{sendText(phoneNumber)}}
      >
      <Text> Send Text </Text> 
      </TouchableOpacity>
      <TouchableOpacity

        style={styles.button}
        onPress={()=>{
          getToken({phoneNumber, oneTimePassword, setUserLoggedIn:props.setUserLoggedIn, setUserName:props.setUserName});
        }}      
        >
        <Text>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  }, margin: {
    marginTop: 100
  }
},

);

export default Login;