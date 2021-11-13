import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Language } from './../constants'

// screens
import Login from "./../screens/Login";
import Register from "./../screens/Register";


// header for screens
import Header from "./../components/Header";


const Stack = createStackNavigator();

export default function  AuthStack(props) {
    return (
        <Stack.Navigator presentation="card" >
            <Stack.Screen
                name="Iniciar Sesion"
                component={Login}
                options={{
                    headerMode:"screen",
                    headerShown: false,
                    headerTransparent: true,
                    cardStyle: { backgroundColor: "white" }
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    header: ({ navigation, scene }) => (
                        <Header back transparent white title={Language.register} routeName={"Register"}  navigation={navigation} scene={scene} />
                    ),
                    headerTransparent: true,
                    cardStyle: { backgroundColor: "#F8F9FE" }
                }}
            />
        </Stack.Navigator>
    )
}
