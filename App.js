import React, {useState} from 'react'; 
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Button,
  Alert,
  Text
} from 'react-native';

import crypto from 'crypto-js';
  

const App = () => {
  const [privateKey, setPrivateKey] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const binanceConfig = {
    API_KEY: '',
    API_SECRET: '',
    HOST_URL: 'https://api.binance.com',
    END_POINT : '/wapi/v3/withdraw.html'
  };
 
  
  const toPayment = ({privateKey,publicKey}) => {
    try {
      const dataQueryString = 'asset=XRP&address=xrpAdress&addressTag=xrpAdressTag&amount=0.01&description=deneme&timestamp=' + Date.now();
      const signature = crypto.HmacSHA256(dataQueryString,binanceConfig.API_SECRET).toString(crypto.enc.Hex);
      console.log(signature);
      console.log(Date.now());
        fetch(`${binanceConfig.HOST_URL + binanceConfig.END_POINT + '?' + dataQueryString + '&signature=' + signature}`,{
          method:'post',
          headers: {
            'X-MBX-APIKEY' : binanceConfig.API_KEY
          }
        })
        .then(response => response.json())
        .then (data => {
          console.log(data.success)
          if(data.success === false){
            Alert.alert("İşlem Başarısız...");
          }else{
            Alert.alert("Gönderim Başarılı...");
          }
        })
    } catch (error) {
        console.log("err", error)
    }

    setPublicKey('')
    setPrivateKey('')
  }
  return (
    <>
      <View style={styles.container}>
        <TextInput style={styles.input}  placeholder="Public Key" onChangeText={(val) => setPublicKey(val)} />
        <TextInput style={styles.input}  placeholder="Private Key" onChangeText={(val) => setPrivateKey(val)}/>
        <Button color='orange' onPress={() => toPayment({privateKey, publicKey})} title="Ödeme Yap"/> 
      </View>

      <Text>{privateKey} + {publicKey}</Text>
    </>
  );
};

const styles = StyleSheet.create({
  container:{ 
    flex:1,
    backgroundColor:'#eee',
    justifyContent:'center',
    alignItems:'center'
  },
  input:{
    borderBottomWidth:1, 
    width:300,
    textAlign:'center',
    marginBottom:30
  },  
});

export default App;
