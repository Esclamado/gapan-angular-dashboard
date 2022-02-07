export const urls = {
  get_token: '/api/token/get',
  admin_login: '/webapi/auth/login',
  /* dashboard */
  web_dashboard: '/webapi/dashboard/index',
  feed_consumption: '/webapi/feedconsumption/feedconsumption',
  med_consumption: '/webapi/medicineconsumption/medicineconsumption',
  harvest_status: '/webapi/harvestproductionstatus/harvestproductionstatus',
  harvest_rate: '/webapi/harvestproductionrate/harvestproductionrate',
  recent_transactions: '/webapi/recenttransactions/recenttransactions',
  staff_activities: '/webapi/recentstaffactivities/recentstaffactivities',
  /* house */
  house_listing: '/webapi/house/listing',
  house_delete: '/webapi/house/delete',
  house_save: '/webapi/house/save',
  /* staff */
  staff_listing: '/webapi/staff/listing',
  staff_view: '/webapi/staff/view',
  staff_profile: '/webapi/staff/staffprofile',
  staff_update: '/webapi/staff/update',
  staff_index: '/webapi/staff/index',
  /* customer */
  customer_listing: '/webapi/customers/listing',
  customer_view: '/webapi/customer/view',
  customer_profile: '/webapi/customer/profile',
  customer_update: '/webapi/customer/update',
  customer_index: '/webapi/customer/index',
  customer_delete: '/webapi/customers/delete',
  customer_type_listing: '/webapi/customertype/listing',
  /* daily reports */
  daily_listing: '/webapi/dailyreports/listing',
  daily_index: '/webapi/dailyreports/index',
  /* transactions/orders */
  transaction_listing: '/webapi/transactions/listing',
  transaction_index: '/webapi/transactions/index',
  /* orders */
  order_save: '/webapi/orders/save',
  order_approve: '/webapi/orders/approve',
  order_decline: '/webapi/orders/decline',
  order_cancel: '/webapi/orders/cancel',
  order_forrelease: '/webapi/orders/forrelease',
  order_collectibles: '/webapi/orders/collectibles',
  /* trays inventory */
  tray_listing: '/webapi/trayinventory/listing',
  tray_view: '/webapi/trayinventory/view',
  /* sacks inventory */
  sack_listing: '/webapi/sackinventory/listing',
  sack_view: '/webapi/sackinventory/view',
  /* feeds management */
  feeds_listing: '/webapi/feedmanagement/listing',
  feeds_index: '/webapi/feedmanagement/index',
  feeds_save: '/webapi/feedmanagement/save',
  feeds_delete: '/webapi/feedmanagement/delete',
  /* medicine management */
  medicine_listing: '/webapi/medicinemanagement/listing',
  medicine_index: '/webapi/medicinemanagement/index',
  medicine_save: '/webapi/medicinemanagement/save',
  medicine_delete: '/webapi/medicinemanagement/delete',
  /* medicine units */
  medicineunits_listing: '/webapi/medicineunits/listing',
  medicineunits_save: '/webapi/medicineunits/save',
  medicineunits_delete: '/webapi/medicineunits/delete',
  /* confirm password */
  user_confirmpass: '/webapi/user/confirmpassword',
  user_add: '/webapi/user/add',
  user_update: '/webapi/user/update',
  user_delete: '/webapi/user/delete',
  /* fresh eggs */
  freshegg_listing: '/webapi/freshegginventory/listing',
  freshegg_view: '/webapi/freshegginventory/view',
  freshegg_index: '/webapi/freshegginventory/index',
  /* price management */
  price_management_listing: '/webapi/pricemanagement/listing',
  price_management_view: '/webapi/pricemanagement/view',
  price_management_save: '/webapi/pricemanagement/save',
  /* general activity */
  general_activity: '/webapi/general/activity',
  /* egg type */
  eggtype_listing: '/webapi/eggtype/listing',
  eggtype_save: '/webapi/eggtype/save',
  /* badge */
  status_count: '/webapi/badge/statuscount',


  /* webapi_sortingreport_index */
  daily_sorting_index: '/webapi/sortingreport/index',

  /* mode of payment approve */
  mop_approve: '/webapi/mop/approve',

  show_egg_stocks: '/api/inventory/search',
  
  /* generate password */
  generate_password: '/webapi/generate/password',

  performancereport_productionhouse: '/webapi/performancereport/productionhouse',
  performancereport_productioneggsize: '/webapi/performancereport/productioneggsize',
  performancereport_overallsales: '/webapi/performancereport/overallsales',
  performancereport_saleseggsizes: '/webapi/performancereport/saleseggsizes',
  performancereport_stocks: '/webapi/performancereport/stocks',
  performancereport_feeds: '/webapi/performancereport/feeds',
  performancereport_medicine: '/webapi/performancereport/medicine',
  /* feeds and medicine consumption */
  feedsmeds_consumption: '/webapi/feedsmedicineconsumption/view',
  feedsmeds_validate: '/webapi/feedsmedicineconsumption/validate',

  /* feeds and medicine consumption listing */
  feedsmeds_listing: '/webapi/feedsmedicineconsumption/listing',
  /* payment attachments */
  paymentattachments_listing: '/webapi/paymentattachments/listing',
  paymentattachments_save: '/webapi/paymentattachments/save',
  paymentattachments_delete: '/webapi/paymentattachments/delete',

  /* add discount */
  discount_save: '/webapi/discount/save',

  /* feeds meds update */
  feeds_update: '/webapi/feedsmedicineconsumption/updatefeeds',

  /* activity log */
  activity_log: '/webapi/recentstaffactivities/activitylog',

  /* get all medicine */
  medicinemanage_getall: '/webapi/medicinemanagement/getall',

  /* get all feeds */
  feedmanage_getall: '/webapi/feedmanagement/getall',

  /* add medicine */
  feedsmeds_add: '/webapi/feedsmedicineconsumption/save',

  /* remove monthly record */
  feedsmeds_remove: '/webapi/feedsmedicineconsumption/delete',

  /* notifications */
  notificationslisting: '/api/notification/listing',
  notificationsmarkasread: '/api/notification/markasread',

  /* get single daily house harvest record */
  feedsmeds_index: '/webapi/feedsmedicineconsumption/index',

  /* update medicine consumption */
  feedsmeds_updatemed: '/webapi/feedsmedicineconsumption/updatemedicine',

  /* location with highest orders */
  production_highestorders: '/webapi/performancereport/locationhighestorders',

  /* credit balance chart */
  production_creditbalance: '/webapi/performancereport/creditbalance',

  /* update Feeds and Medicine Management */
  feedsmedsmanagement_update: '/webapi/feedsmedicinemanagement/update',
};