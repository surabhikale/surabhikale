// const BASE_URL = 'https://absoluteweb.org/clubmanagement/api/public/v1';
const BASE_URL = 'https://yourclubworld.com/api/public/v1';

export const APP_VERSION = '1.0.1';

export const CLUB_CODE = 'KapolYCMumbai';
// export const CLUB_CODE = 'kapmum';

export const SUPER_ADMIN_ID = 'NxOpZowo9GmjKqdR';
export const ADMIN_ID = 'XbPW7awNkzl83LD6';
export const COMMITTEE_MEMBER_ID = 'aYOxlpzRMwrX3gD7';
export const MEMBER_ID = '39n0Z12OZGKERJgW';

//*************************
//***** API-ENDPOINTS *****
//*************************

export const SPLASH_SCREEN = `${BASE_URL}/getsplashscreendata`;

export const LOGIN = `${BASE_URL}/tenantuser/login`;

export const VERIFY_OTP = `${BASE_URL}/verifyotps`;

export const GET_ID_COORDS = `${BASE_URL}/geticarddesignbytenant`;

export const GET_USER_INFO = `${BASE_URL}/gettenantuser`;

export const UPDATE_USER_INFO = `${BASE_URL}/updatetenantusers/`;

export const EVENT_LISTING = `${BASE_URL}/eventslistingbytenantid`;

export const EVENT_DETAILS = `${BASE_URL}/getalleventsdetailsbyid/`;

export const EVENT_REGISTER_TRANSACTION = `${BASE_URL}/createeventusertransaction`;

export const ENROLL_USER = `${BASE_URL}/updateeventusertransaction/`;

export const GET_ALL_ENROLLED_USERS = `${BASE_URL}/getalleventusertransaction`;

export const COLLECTION_CENTER = `${BASE_URL}/getcollectioncentersbyid/`;

export const PRIVACY_POLICY = `${BASE_URL}/getprivacypolicy`;

export const TERMS_CONDITIONS = `${BASE_URL}/gettermsandconditions`;

export const GETMESSAGECOUNT = `${BASE_URL}/getusermessagecounts`;

export const GETMESSAGEDETAILS = `${BASE_URL}/geteventmessagecenter`;

export const UPDATEMESSAGE = `${BASE_URL}/updateusereventmessage`;
