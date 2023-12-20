"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManagementEvents = exports.CommonEvents = void 0;
var CommonEvents;
(function (CommonEvents) {
    CommonEvents["connection"] = "connection";
    CommonEvents["gateway_health"] = "gateway_health";
    CommonEvents["get_connected_clients"] = "get_connected_clients";
    CommonEvents["join_room"] = "join_room";
})(CommonEvents || (exports.CommonEvents = CommonEvents = {}));
var UserManagementEvents;
(function (UserManagementEvents) {
    UserManagementEvents["get_all_staff_event"] = "get_all_staff_event";
    UserManagementEvents["get_all_drivers_event"] = "get_all_drivers_event";
    UserManagementEvents["get_all_customers_event"] = "get_all_customers_event";
})(UserManagementEvents || (exports.UserManagementEvents = UserManagementEvents = {}));
//# sourceMappingURL=gateway.constants.js.map