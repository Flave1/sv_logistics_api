export declare enum CommonEvents {
    connection = "connection",
    gateway_health = "gateway_health",
    get_connected_clients = "get_connected_clients",
    join_room = "join_room",
    leave_room = "leave_room"
}
export declare enum UserManagementEvents {
}
export declare enum MenuManagementEvents {
}
export declare enum CountryManagementEvents {
    get_countries_event = "get_countries_event"
}
export declare enum RestaurantManagementEvents {
    get_restaurants_event = "get_restaurants_event"
}
export declare class AdminOrderEvents {
    static get_order(restaurantId: number): string;
}
