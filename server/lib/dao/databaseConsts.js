"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

module.exports = function Constants() {
  _classCallCheck(this, Constants);

  this.EVENT_TABLE = "event";
  this.EVENT_ID = "event_id";
  this.EVENT_NAME = "name";
  this.EVENT_HOST_ID = "host_id";
  this.EVENT_ACTIVE = "active";
  this.EVENT_LOCATION = "location";
  this.EVENT_START_TIME = "start_time";
  this.EVENT_END_TIME = "end_time";
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
  this.PERFORMANCE_TABLE = "performance";
  this.PERFORMANCE_ID = "performance_id";
  this.PERFORMANCE_ARTIST_ID = "user_id";
  this.PERFORMANCE_EVENT_ID = "event_id";
  this.PERFORMANCE_START_TIME = "start_time";
  this.PERFORMANCE_END_TIME = "end_time";
  this.PERFORMANCE_CONTRACT = "contract";
  this.RIDER_TABLE = "rider";
  this.RIDER_PERFORMANCE_ID = "performance_id";
  this.RIDER_NAME = "name";
  this.RIDER_AMOUNT = "amount";
};