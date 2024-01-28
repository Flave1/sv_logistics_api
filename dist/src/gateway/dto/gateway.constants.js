"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminOrderEvents = exports.RestaurantManagementEvents = exports.CountryManagementEvents = exports.MenuManagementEvents = exports.UserManagementEvents = exports.CommonEvents = void 0;
var CommonEvents;
(function (CommonEvents) {
    CommonEvents["connection"] = "connection";
    CommonEvents["gateway_health"] = "gateway_health";
    CommonEvents["get_connected_clients"] = "get_connected_clients";
    CommonEvents["join_room"] = "join_room";
    CommonEvents["leave_room"] = "leave_room";
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
var CountryManagementEvents;
(function (CountryManagementEvents) {
    CountryManagementEvents["get_countries_event"] = "get_countries_event";
})(CountryManagementEvents || (exports.CountryManagementEvents = CountryManagementEvents = {}));
var RestaurantManagementEvents;
(function (RestaurantManagementEvents) {
    RestaurantManagementEvents["get_restaurants_event"] = "get_restaurants_event";
})(RestaurantManagementEvents || (exports.RestaurantManagementEvents = RestaurantManagementEvents = {}));
class AdminOrderEvents {
    static get_order(restaurantId) {
        return `get_order_${restaurantId}`;
    }
}
exports.AdminOrderEvents = AdminOrderEvents;
//# sourceMappingURL=gateway.constants.js.map