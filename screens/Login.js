import React, { useContext,useState, useRef } from "react";
import {
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  Linking
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import config from '../config';
import { Button, Icon, Input } from "../components";

import { Images, argonTheme, Language } from "../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");
import Toast from 'react-native-easy-toast'
import AuthContext from './../store/auth'
import { SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


const Login = ({navigation}) => {
  const toastok = useRef(null);
  const toasterror = useRef(null);

  const { signIn } = useContext(AuthContext);
  const [email, setEmail ] = useState("");
  const [cargando, setCargando] = useState("false");
  const [ password, setPassword ] = useState("");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white", paddingTop: 25}}>
    <Block style={{alignItems: "center"}}>
        <Image  middle source={Images.food_tiger_logo} style={{alignItems: "center", width: (487/2),height: (144/2)}}/>
    </Block>
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} keyboardShouldPersistTaps='handled'>
    <Block stlye="alignItems: center" flex middle>
          <Block flex middle>
              <Block flex>
                <Block flex={0.17} middle style={{marginTop:20}}>
                  <Text muted></Text>
                </Block>

                <Block flex={false} >
                    <Text h1 bold>¡Hola!</Text>
                    <Block margin={0} style={{paddingBottom: 25}}>
                        <Text h6>Introduzca sus datos</Text>
                        <Text h6 style={{ marginTop: 10 }}>para iniciar sesión</Text>
                    </Block>
                </Block>

                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >

                    <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                      <Input
                       value ={email}
                        borderless
                        onChangeText={text => setEmail(text)}
                        placeholder={"Email"}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />
                    </Block>


                    <Block width={width * 0.8}>
                      <Input
                       value ={password}
                        password
                        borderles
                        placeholder={"Contraseña"}
                        onChangeText={text => setPassword(text)}
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                      />

                    </Block>








                    <Block row space="evenly" style={{marginVertical:10}} >
                      <Block>
                          <TouchableOpacity onPress={()=>  Linking.openURL(config.domain.replace("/api/v2",'')+"/password/reset").catch(err => console.error("Couldn't load page", err)) } >
                            <Text  size={14} color={argonTheme.COLORS.PRIMARY}>
                            {Language.forgotPassword}
                            </Text>
                          </TouchableOpacity>
                        </Block>

                    </Block>



                    <Block middle>
                      <Button color="primary" style={styles.createButton} onPress={()=>{setCargando("true"); signIn({email:email,password:password,toastok:toastok,toasterror:toasterror})}}>
                        {cargando === "true" ? <ActivityIndicator size="small" color="white" /> :
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>{Language.login}
                        </Text>}
                      </Button>
                      <Block flex={false} margin={5}>
                          <Text center>Servicio propiedad de EnLaMesa</Text>
                      </Block>
                    </Block>

                  </KeyboardAvoidingView>
                </Block>
              </Block>
          </Block>

        <Toast ref={toastok} style={{backgroundColor:argonTheme.COLORS.SUCCESS}}/>
        <Toast ref={toasterror} style={{backgroundColor:argonTheme.COLORS.ERROR}}/>
      </Block>
      <Block flex={false} style={{ alignItems: "flex-end" }} margin={-60}>
          <ImageBackground source={Images.Footer}
              style={styles.footerImage}
              resizeMethod="resize"
          />
      </Block>
      </KeyboardAwareScrollView>
      </SafeAreaView>
  );
};

export default Login;


const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  },
  footerImage: {
      width: 220,
      height: 190,
      transform: [{ rotate: '310deg' }]
  }
});
