import APICaller from './api_callers';
import config from "./../config";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Login user
 * @param {*} email
 * @param {*} password
 * @param {*} callback
 */
function loginUser(email,password,callback){
    var link='client/auth/gettoken';
    if(config.DRIVER_APP){
      link='driver/auth/gettoken';
    }
    if(config.VENDOR_APP){
      link='vendor/auth/gettoken';
    }
    APICaller.publicAPI('POST',link,{
        email:email,
        password:password
       },(response)=>{
        setSettings();
        callback(response)
    },(error)=>{alert(error)});
   }
exports.loginUser=loginUser;

/**
 * Register user / vendor account
 * @param {*} name
 * @param {*} email
 * @param {*} password
 * @param {*} phone
 * @param {*} callback
 */
function registerUser(name,email,password,phone,callback){
    const data = {
      name: name,
      email:email,
      password:password,
      phone:phone,
      app_secret:config.APP_SECRET,
    };

    var link='client/auth/register';
    if(config.DRIVER_APP){
      link='driver/auth/register';
    }
    if(config.VENDOR_APP){
      link='vendor/auth/register';
      data.vendor_name=name;
    }
    APICaller.publicAPI('POST',link,data,(response)=>{
        setSettings();
        callback(response)
    },(error)=>{alert(error)})

}
exports.registerUser=registerUser;

/**
 * Set setting
 */
async function setSettings(){
    APICaller.authAPI('GET','client/settings',{},async (response)=>{
      await AsyncStorage.setItem('settings',JSON.stringify(response));
    },(error)=>{alert(error)})
}

/**
 * getNotifications
 * @param {*} callback
 */
exports.getNotifications=async (callback)=>{APICaller.authAPI('GET','client/notifications',{},callback,(error)=>{alert(error)})}


/**
 * Update orders status
 * @param {*} order_id
 * @param {*} status_slug
 * @param {*} comment
 * @param {*} callback
 */
exports.updateOrderStatus=async (order_id,status_slug,comment,callback)=>{
    var statuses={
        "just_created":"1",
        "accepted_by_admin":"2",
        "accepted_by_restaurant":"3",
        "assigned_to_driver":"4",
        "picked_up":"5",
        "delivered":"6",
        "rejected_by_admin":"7",
        "rejected_by_restaurant":"8",
        "updated":"9",
        "closed":"10",
        "rejected_by_driver":"11",
        "accepted_by_driver":"12"
    }
    var mode=config.DRIVER_APP?"driver":"vendor";
    APICaller.authAPI('GET',mode+'/orders/updateorderstatus/'+order_id+"/"+statuses[status_slug],{"comment":comment},callback,(error)=>{alert(error)})
};

exports.removeItemOrder=async (item_id, order_id, callback)=>{
  APICaller.authAPI('GET','vendor/orders/removeitemorder/'+order_id+"/"+item_id,{},callback,(error)=>{alert(error)})
};

exports.updateItemOrderQty=async (item_id, order_id, operador, callback)=>{
  APICaller.authAPI('GET','vendor/orders/updateitemorderqty/'+order_id+"/"+item_id+"/"+operador,{},callback,(error)=>{alert(error)})
};