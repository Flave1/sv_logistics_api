export enum CommonEvents {
  connection = "connection",
  gateway_health = "gateway_health",
  get_connected_clients = 'get_connected_clients',
  join_room = 'join_room',
  leave_room = 'leave_room'
}

export enum UserManagementEvents {
  get_all_staff_event = 'get_all_staff_event',
  get_all_drivers_event = 'get_all_drivers_event',
  get_all_customers_event = 'get_all_customers_event'
}

export enum MenuManagementEvents {
  get_restaurant_menu_categories_event = 'get_restaurant_menu_categories_event',
  get_restaurant_menu_event = 'get_restaurant_menu_event',
  get_restaurant_menu_by_category_event = 'get_restaurant_menu_by_category_event'
}

export enum CountryManagementEvents {
  get_countries_event = 'get_countries_event'
}