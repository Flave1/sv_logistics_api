"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenuManagementEvents = exports.UserManagementEvents = exports.CommonEvents = void 0;
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
var MenuManagementEvents;
(function (MenuManagementEvents) {
    MenuManagementEvents["get_restaurant_menu_categories_event"] = "get_restaurant_menu_categories_event";
    MenuManagementEvents["get_restaurant_menu_event"] = "get_restaurant_menu_event";
    MenuManagementEvents["get_restaurant_menu_by_category_event"] = "get_restaurant_menu_by_category_event";
})(MenuManagementEvents || (exports.MenuManagementEvents = MenuManagementEvents = {}));
//# sourceMappingURL=gateway.constants.js.map