import React, { useState, useEffect,useRef } from 'react';
import { StyleSheet,ScrollView,Dimensions, LogBox ,Platform, Linking, Image} from 'react-native'
import { Block, theme, Text, } from "galio-framework";
const { height, width } = Dimensions.get('screen');
import { Language } from '../constants';
import config from "./../config";
import settings from "./../services/settings";
import MapView , { Marker } from 'react-native-maps';
import moment from "moment";
import Fancy from "./../components/Fancy"
import { TouchableOpacity } from 'react-native-gesture-handler';
import InfoBox from "../components/InfoBox"
import API from './../services/api'
import Button from "../components//Button";
import 'moment/locale/es';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';



/**
   * Open on the map the location of the restaurant
   * @param {Float} lat
   * @param {Float} long
   */
 function openExternalApp(lat, long) {
  var scheme = Platform.OS === 'ios' ? 'apple' : 'google'
  Linking.canOpenURL('http://maps.' + scheme + '.com/maps?daddr=' + lat + ',' + long).then(supported => {
    if (supported) {
      Linking.openURL('http://maps.' + scheme + '.com/maps?daddr=' + lat + ',' + long);
    } else {

    }
  });
}


/**
   * Call the restaurant function
   * @param {String} phoneNumber
   */
 function openPhoneApp(phoneNumber) {
  console.log(phoneNumber)
  var number = "tel:" + phoneNumber
  Linking.canOpenURL(number).then(supported => {
    if (supported) {
      Linking.openURL(number);
    } else {

    }
  });
}




function OrderDetails({navigation,route}){
    const [order,setOrder]=useState(route.params.order);
    const [driver_percent_from_deliver,setDriverPercentFromDeliver]=useState(100);
    const [action,setAction]=useState("");
    const [item,setItem]=useState("");
    const [objeto,setObjeto]=useState("");
    const [operador,setOperador]=useState("");
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(()=>{
      if(config.DRIVER_APP){
        //Driver get orders
        API.getDriverOrder(order.id,(ordersResponse)=>{
          ordersResponse.restorant=order.restorant;
          ordersResponse.client=order.client;
          ordersResponse.address=order.address;
          ordersResponse.items=order.items;
          setOrder(ordersResponse);
          setRefreshing(false);
        },(error)=>{alert(error)})
      }else{
      }
    },[refreshing])

    useEffect(()=>{
      settings.getSettingsKey(driver_percent_from_deliver,'driver_percent_from_deliver',100)
    },[])

    //Timer
    useEffect(() => {
      const interval = setInterval(() => {
        setRefreshing(true);
      }, 20000);
      return () => clearInterval(interval);
    }, []);


    function showActions(){
      if(config.DRIVER_APP||config.VENDOR_APP){
        if(order.actions.buttons.length>0||order.actions.message){
          return (
            <InfoBox title={Language.actions}>
              <Block center  height={order.actions.buttons.length==0?50:null}>
              {
                order.actions.buttons.map((action)=>{
                  return (<Button onPress={()=>{setAction(action); API.updateOrderStatus(order.id,action,"",(data)=>{
                    setAction("");
                    setOrder(data[0]);
                  })}} style={{opacity:(action.indexOf('reject')>-1?0.5:1)}} size="large" color={action.indexOf('reject')>-1?"error":"success"} >{Language[action].toUpperCase()}</Button>)
                })
              }
              <Text  size={14} muted >{order.actions.message}</Text>
              </Block>
          </InfoBox>
          )
        }else{
          return null
        }
      }else{
        return null
      }

    }

    function showDeliveryAddress(){
        if(order.delivery_method==1&&order.address){
         return (
            <InfoBox title={Language.deliveryAddress}>
                 <Text  size={14} style={styles.cardTitle}>{order.address.address}</Text>
                 <Block row center>
                          <Button onPress={()=>{openPhoneApp(order.client.phone)}}  size="small" color={"default"} >{Language.call.toUpperCase()}</Button>
                          <Button onPress={()=>{openExternalApp(order.address.lat,order.address.lng)}} size="small" color={"warning"} >{Language.directions.toUpperCase()}</Button>
                </Block>
            </InfoBox>

         )
        }else{
          return null;
        }
      }

      function showDriver(){
        if(order.delivery_method==1&&order.driver){
         return (
            <InfoBox title={Language.driver}>
                 <Text  size={14} style={styles.cardTitle}>{Language.driverName+": "}{order.driver.name}</Text>
                 <Text  size={14} style={styles.cardTitle}>{Language.driverPhone+": "}{order.driver.phone}</Text>
            </InfoBox>

         )
        }else{
          return null;
        }
      }

      function showMap(){
        if(order.delivery_method==1&&order.driver&&order.status[order.status.length-1].alias=="picked_up"){
         return (
            <InfoBox title={Language.orderTracking}>
                 <MapView
                    region={{
                        latitude: order.lat,
                        longitude:order.lng,
                        latitudeDelta: 0.008,
                        longitudeDelta: 0.009,
                    }}
                    style={[{height:300,marginVertical:10}]}
                    showsScale={true}
                    showsBuildings={true}
                >
                    <Marker
                key={1}
                coordinate={{latitude:order.lat,longitude:order.lng}}
                title={"Location"}
                description={""}
                />
                </MapView>
            </InfoBox>

         )
        }else{
          return null;
        }
      }

    return (
        <Block flex center style={styles.home}>

        <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.articles}>

                    <Block flex  >

                          <Fancy
                         visible={item != ""}
                         icon_ios={'ios-checkmark-circle-outline'} icon_android="md-checkmark-circle"
                         title={Language.borraritem} subtitle={Language.borraritem_sub}
                         button={Language.ok} closeAction={()=>{setItem("")}}
                         action={()=>{
                           API.removeItemOrder(item, order.id, (data)=>{
                             setItem("");
                             setOrder(data[0]);
                             setRefreshing(true);
                           })}}
                         ></Fancy>

                        {/* Show actions */}
                        {showActions()}

                        {/* info */}
                        <InfoBox title={Language.order}>
                            <Text size={14} style={styles.cardTitle}>{Language.orderNumber+": #"}{order.id}</Text>
                            <Text size={14} style={styles.cardTitle}>{Language.created+": "}{moment(order.created_at).format(config.dateTimeFormat)}</Text>
                            <Text bold size={14} style={styles.cardTitle}>{Language.status+": "}{order.last_status.length>0? Language[order.last_status[0].alias]:""}</Text>
                        </InfoBox>

                         {/* map */}
                         {showMap()}

                        {/* Driver */}
                        {showDriver()}

                        {/* Items */}
                        <InfoBox title={Language.items}>
                           {
                               order.items.map((item,index)=>{
                                return (
                                  <ScrollView
                                  showsVerticalScrollIndicator={false}
                                  
                                  >
                                    <Block style={{backgroundColor: "#5e72e4", padding:10, borderRadius:15, marginTop:10}}>
                                        <Block style={{ flexDirection: 'row'}}>
                                        <Image
                                        style={{width: 100, height: 100, borderRadius: 5, marginRight: 10, marginTop:10}}
                                        source={{uri: ""+item.image+"_large.jpg"}}
                                        />
                                        <Block style={{ marginBottom: 10, marginTop: 10}}>
                                          <Text color="white" size={14} style={styles.cardTitle}>{item.name}</Text>               
                                          <Text color="white" size={14} style={styles.cardTitle}>{item.pivot.qty+" x "+item.pivot.variant_price + config.currencySign}</Text>
                                          <Block style={{width: 40, height: 20, flexDirection: 'row', alignSelf: "flex-start"}}>
                                            <TouchableOpacity onPress={()=>{ API.updateItemOrderQty(item.pivot.id, order.id, "restar", 
                                              (data)=>{
                                                        setOrder(data[0]);
                                                        setRefreshing(true);
                                                      })}}
                                              style={{backgroundColor:"black", borderRadius: 5, padding: 10, marginRight: 5}}>
                                              <FontAwesomeIcon  style={{color: "red"}} icon={faMinus} />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={()=>{ API.updateItemOrderQty(item.pivot.id, order.id, "sumar", 
                                              (data)=>{
                                                        setOrder(data[0]);
                                                        setRefreshing(true);
                                                      })}} 
                                              style={{backgroundColor:"black", borderRadius: 5, padding: 10, marginRight: 10}}>
                                              <FontAwesomeIcon  style={{color: "lightgreen"}} icon={faPlus} />
                                            </TouchableOpacity>
                                          </Block>
                                        </Block>
                                        <Block style={{alignSelf: "flex-end", marginBottom: -5}}>
                                            <TouchableOpacity onPress={()=>{setItem(item.pivot.id)}} style={{backgroundColor:"black", borderRadius: 5, padding: 10}}>
                                              <FontAwesomeIcon  style={{color: "white"}} icon={faTrash} />
                                            </TouchableOpacity>
                                        </Block>
                                        </Block>
                                        <Block style={{ marginTop: 10 }}>
                                          {item.pivot.ingredientes != null && <Text color="white" size={14} style={styles.cardTitle}><FontAwesomeIcon icon={faCircleMinus} style={{color: "white"}} /> {"Quitar ingredientes: "+ item.pivot.ingredientes}</Text>}
                                          {JSON.parse(item.pivot.extras) !="" && <Text color="white" style={styles.cardTitle}><FontAwesomeIcon icon={faCirclePlus} style={{color: "white"}} /> {"Extras: "+JSON.parse(item.pivot.extras).join(', ')}</Text>}
                                        </Block>
                                    </Block>
                                  </ScrollView>
                                )
                                })
                           }
                        </InfoBox>

                        {/* Address */}
                        {showDeliveryAddress()}

                         {/* deliveryMethod */}

                         <InfoBox title={Language.deliveryMethod}>
                         <Text size={14} style={styles.cardTitle}>{Language.deliveryMethod+": "+(order.delivery_method == 3?Language.delivery:order.delivery_method == 2?Language.pickup:order.delivery_method == 4?Language.recogerenbarra:Language.nada)}</Text>
                         {order.delivery_method === 3 && <Text size={14} style={styles.cardTitle}>{"Mesa a la que entregar: "+order.table.name}</Text>}
                         {order.delivery_method === 3 && <Text size={14} style={styles.cardTitle}>{"Area: "+order.table.restoarea.name}</Text>}
                         {(order.delivery_method === 1 || order.deliver_method === 2)  &&  <Text size={14} style={styles.cardTitle}>{(order.delivery_method==2?Language.deliveryTime:Language.pickupTime)+": "+order.time_formated}</Text>}
                         </InfoBox>



                        {/* summary */}
                        <InfoBox title={Language.summary}>
                            <Block row space={"between"} style={{marginTop:16}}>
                                <Block><Text bold style={[styles.cardTitle]}>{Language.subtotal}</Text></Block>
                                <Block><Text  >{order.order_price}{config.currencySign}</Text></Block>
                            </Block>
                            <Block row space={"between"} style={{marginTop:0}}>
                                <Block><Text bold style={[styles.cardTitle]}>{Language.delivery}</Text></Block>
                                <Block><Text>{order.delivery_price}{config.currencySign}</Text></Block>
                            </Block>

                            <Block row space={"between"} style={{marginTop:16}}>
                                <Block><Text bold style={[styles.cardTitle]}>{Language.total}</Text></Block>
                                <Block><Text bold >{parseFloat(order.order_price)+parseFloat(order.delivery_price)}{config.currencySign}</Text></Block>
                            </Block>
                        </InfoBox>



                </Block>
            </ScrollView>
        </Block>
    )
}

export default OrderDetails

const styles = StyleSheet.create({
    home: {
        width: width,
      },
    card: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
        marginBottom: 16
      },
      cardTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6
      },
      cardDescription: {
        padding: theme.SIZES.BASE / 2
      },
      shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.1,
        elevation: 2,
      },
      articles: {
        width: width - theme.SIZES.BASE * 2,
        paddingVertical: theme.SIZES.BASE,
      },
})
