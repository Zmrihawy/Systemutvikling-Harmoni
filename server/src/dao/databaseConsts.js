// @flow

module.exports = class Constants {

EVENT_TABLE: string;
EVENT_ID :string;
EVENT_NAME :string;
EVENT_HOST_ID :string;
EVENT_ACTIVE :string;
EVENT_LOCATION :string;
EVENT_LONGITUDE :string;
EVENT_LATITUDE :string;
EVENT_DESCRIPTION :string;
EVENT_START_TIME :string;
EVENT_END_TIME :string;
EVENT_PICTURE :string;

TICKET_TABLE :string;
TICKET_NAME :string;
TICKET_EVENT_ID :string;
TICKET_PRICE :string;
TICKET_AMOUNT :string;
TICKET_DESCRIPTION :string;

USER_TABLE :string;
USER_ID :string;
USER_USERNAME :string;
USER_PASSWORD :string;
USER_SALT :string;
USER_EMAIL :string;
USER_PHONE :string;
USER_FIRST_NAME :string;
USER_LAST_NAME :string;
USER_PICTURE :string;
USER_ARTIST :string;

PERFORMANCE_TABLE :string;
PERFORMANCE_ID :string;
PERFORMANCE_ARTIST_ID :string;
PERFORMANCE_EVENT_ID :string;
PERFORMANCE_START_TIME :string;
PERFORMANCE_END_TIME :string;
PERFORMANCE_CONTRACT :string;
PERFORMANCE_NAME :string;

RIDER_TABLE :string;
RIDER_PERFORMANCE_ID :string;
RIDER_NAME :string;
RIDER_AMOUNT :string;

CREW_TABLE :string;
CREW_ID :string;
CREW_PROFESSION :string;
CREW_NAME :string;
CREW_CONTACT_INFO :string;
CREW_EVENT_ID :string;

PASSWORD_TABLE :string;
PASSWORD_ID : string;
PASSWORD_USER_ID: string;
PASSWORD_PASSWORD: string;
PASSWORD_AUTOGEN : string;

    constructor() {
        this.EVENT_TABLE = "event";
        this.EVENT_ID = "event_id";
        this.EVENT_NAME = "name";
        this.EVENT_HOST_ID = "host_id";
        this.EVENT_ACTIVE = "active";
        this.EVENT_LOCATION = "location";
        this.EVENT_LONGITUDE = "longitude";
        this.EVENT_LATITUDE = "latitude";
        this.EVENT_DESCRIPTION = "description";
        this.EVENT_START_TIME = "start_time";
        this.EVENT_END_TIME = "end_time";
        this.EVENT_PICTURE = "picture";

        this.TICKET_TABLE = "ticket";
        this.TICKET_NAME = "name";
        this.TICKET_EVENT_ID = "event_id";
        this.TICKET_PRICE = "price";
        this.TICKET_AMOUNT = "amount";
        this.TICKET_DESCRIPTION = "description";

        this.USER_TABLE = "user";
        this.USER_ID = "user_id";
        this.USER_USERNAME = "username";
        this.USER_PASSWORD = "password";
        this.USER_SALT = "salt";
        this.USER_EMAIL = "email";
        this.USER_PHONE = "phone";
        this.USER_FIRST_NAME = "first_name";
        this.USER_LAST_NAME = "surname";
        this.USER_PICTURE = "picture";
        this.USER_ARTIST = "artist";

        this.PERFORMANCE_TABLE = "performance";
        this.PERFORMANCE_ID = "performance_id";
        this.PERFORMANCE_ARTIST_ID = "user_id";
        this.PERFORMANCE_EVENT_ID = "event_id";
        this.PERFORMANCE_START_TIME = "start_time";
        this.PERFORMANCE_END_TIME = "end_time";
        this.PERFORMANCE_CONTRACT = "contract";
        this.PERFORMANCE_NAME = "name";

        this.RIDER_TABLE = "rider";
        this.RIDER_PERFORMANCE_ID = "performance_id";
        this.RIDER_NAME = "name";
        this.RIDER_AMOUNT = "amount";

        this.CREW_TABLE = "crew";
        this.CREW_ID = "crew_id";
        this.CREW_PROFESSION = "profession";
        this.CREW_NAME = "name";
        this.CREW_CONTACT_INFO = "contact_info";
        this.CREW_EVENT_ID = "event_id";

        this.PASSWORD_TABLE = "password";
        this.PASSWORD_ID = "password_id";
        this.PASSWORD_USER_ID = "user_id";
        this.PASSWORD_PASSWORD = "password_hex";
        this.PASSWORD_AUTOGEN  = "autogen";
    }
};