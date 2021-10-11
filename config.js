exports.domain = "https://enlamesa.es/api/v2";
exports.APP_SECRET="cleqsZQ0FQGaaEpuNR228wvo02JTLgsj2Qko9Y9N4LI="; //Your app secret - same as in the .env file in your web project 
exports.APP_NAME="EnLaMesa";
exports.LOGO="https://enlamesa.es/logo.png";

exports.SINGLE_MODE=false;
exports.SINGLE_MODE_ID=1;
exports.SINGLE_MODE_NAME="Restaurant Name";

exports.MULTI_CITY=true;


//Currency
exports.currency="EUR";
exports.currencySign="€";

//COD setup
exports.enableCOD=true;  //Cash on deliver

//Stripe settup
exports.enableStripe=true; 
exports.stripePublishKey="pk_test_51H2qh6I5MlgeNwEZ2wTFsK6RmGdVIPimmBq3kAzqsGyN3EjRMifG2DyMNkcDtDuAAccw3Ys6GQjELp6vKDto3Evu00Ji6LihEP";

//Other payment gateways
exports.enablePayPal=true; 
exports.enableMollie=false; 
exports.enablePayStack=false; 

//Date format
exports.dateTimeFormat="Do MMMM YYYY, h:mm a";
exports.dateFormat="Do MMMM YYYY";

//OneSignal APP KEY
exports.ONESIGNAL_APP_ID="YOUR_ONESIGNAL_APP_ID";

//Google setup
exports.GOOGLE_API_KEY="AIzaSyAOsayYWWARZlfe0N-6sPMce6fAGu7FhPk";
exports.queryTypes="address"
exports.queryCountries=['es']; //{['pl', 'fr','us']}


/*
    searchRadius={500}
    searchLatitude={51.905070}
    searchLongitude={19.458834}
*/
exports.searchLatitude=null;
exports.searchLongitude=null;
exports.searchRadius=null;
