import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TemplateComponent } from "./layout/template/template.component";
import { AuthGuard } from './guard/auth/auth.guard';
import { LoginComponent } from "./pages/auth/login/login.component";

import { CustomerCreateComponent } from './pages/main/customer/customer-create/customer-create.component';
import { CustomerListingComponent } from './pages/main/customer/customer-listing/customer-listing.component';
import { CustomerUpdateComponent } from './pages/main/customer/customer-update/customer-update.component';
import { CustomerViewComponent } from './pages/main/customer/customer-view/customer-view.component';

import { DailyReportsHouseListingComponent } from './pages/main/daily-reports/daily-reports-house-listing/daily-reports-house-listing.component';
import { DailyReportsListingComponent } from './pages/main/daily-reports/daily-reports-listing/daily-reports-listing.component';
import { DailyReportsViewComponent } from './pages/main/daily-reports/daily-reports-view/daily-reports-view.component';

import { DashboardComponent } from './pages/main/dashboard/dashboard.component';

import { FeedsMedicineConsumptionCreateComponent } from './pages/main/feeds-medicine-consumption/feeds-medicine-consumption-create/feeds-medicine-consumption-create.component';
import { FeedsMedicineConsumptionListingComponent } from './pages/main/feeds-medicine-consumption/feeds-medicine-consumption-listing/feeds-medicine-consumption-listing.component';
import { FeedsMedicineConsumptionViewComponent } from './pages/main/feeds-medicine-consumption/feeds-medicine-consumption-view/feeds-medicine-consumption-view.component';
import { FeedsMedicineConsumptionUpdateComponent } from './pages/main/feeds-medicine-consumption/feeds-medicine-consumption-update/feeds-medicine-consumption-update.component';

import { FeedsCreateComponent } from './pages/main/feeds-medicine-management/feeds/feeds-create/feeds-create.component';
import { FeedsListingComponent } from './pages/main/feeds-medicine-management/feeds/feeds-listing/feeds-listing.component';
import { FeedsUpdateComponent } from './pages/main/feeds-medicine-management/feeds/feeds-update/feeds-update.component';

import { MedicineCreateComponent } from './pages/main/feeds-medicine-management/medicine/medicine-create/medicine-create.component';
import { MedicineListingComponent } from './pages/main/feeds-medicine-management/medicine/medicine-listing/medicine-listing.component';
import { MedicineUpdateComponent } from './pages/main/feeds-medicine-management/medicine/medicine-update/medicine-update.component';

import { HouseListingComponent } from './pages/main/house/house-listing/house-listing.component';

import { FreshEggsListingComponent } from './pages/main/inventory-stocks/fresh-eggs/fresh-eggs-listing/fresh-eggs-listing.component';
import { FreshEggsViewComponent } from './pages/main/inventory-stocks/fresh-eggs/fresh-eggs-view/fresh-eggs-view.component';

import { SacksListingComponent } from './pages/main/inventory-stocks/sacks/sacks-listing/sacks-listing.component';
import { SacksViewComponent } from './pages/main/inventory-stocks/sacks/sacks-view/sacks-view.component';

import { TraysListingComponent } from './pages/main/inventory-stocks/trays/trays-listing/trays-listing.component';
import { TraysViewComponent } from './pages/main/inventory-stocks/trays/trays-view/trays-view.component';

import { FeedsComponent } from './pages/main/performance-report/consumption/feeds/feeds.component';
import { MedicineComponent } from './pages/main/performance-report/consumption/medicine/medicine.component';

import { ProductionByEggSizeComponent } from './pages/main/performance-report/harvested/production-by-egg-size/production-by-egg-size.component';
import { ProductionPerHouseComponent } from './pages/main/performance-report/harvested/production-per-house/production-per-house.component';

import { OverallSalesComponent } from './pages/main/performance-report/sales/overall-sales/overall-sales.component';
import { SalesByEggSizeComponent } from './pages/main/performance-report/sales/sales-by-egg-size/sales-by-egg-size.component';

import { StocksListingComponent } from './pages/main/performance-report/stocks/stocks-listing/stocks-listing.component';
import { StocksViewComponent } from './pages/main/performance-report/stocks/stocks-view/stocks-view.component';

import { PaymentListingComponent } from './pages/main/payment/payment-listing/payment-listing.component';
import { PaymentUpdateComponent } from './pages/main/payment/payment-update/payment-update.component';
import { PaymentPrintComponent } from './pages/main/payment/payment-print/payment-print.component';

import { PriceManagementListingComponent } from './pages/main/price-management/price-management-listing/price-management-listing.component';
import { PriceManagementViewComponent } from './pages/main/price-management/price-management-view/price-management-view.component';

import { StaffCreateComponent } from './pages/main/staff/staff-create/staff-create.component';
import { StaffListingComponent } from './pages/main/staff/staff-listing/staff-listing.component';
import { StaffUpdateComponent } from './pages/main/staff/staff-update/staff-update.component';
import { StaffViewComponent } from './pages/main/staff/staff-view/staff-view.component';
import { StaffMyProfileComponent } from './pages/main/staff/staff-my-profile/staff-my-profile.component';

import { TransactionsCreateComponent } from './pages/main/transactions/transactions-create/transactions-create.component';
import { TransactionsCreatePreviewComponent } from './pages/main/transactions/transactions-create-preview/transactions-create-preview.component';
import { TransactionsListingComponent } from './pages/main/transactions/transactions-listing/transactions-listing.component';
import { TransactionsListingByOrderStatusComponent } from './pages/main/transactions/transactions-listing-by-order-status/transactions-listing-by-order-status.component';
import { TransactionsListingByPaymentStatusComponent } from './pages/main/transactions/transactions-listing-by-payment-status/transactions-listing-by-payment-status.component';
import { TransactionsViewComponent } from './pages/main/transactions/transactions-view/transactions-view.component';
import { ActivityListingComponent } from './pages/main/activity/activity-listing/activity-listing.component';

const routes: Routes = [
  {
    path: "",
    component: TemplateComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      { path: "dashboard", component: DashboardComponent },
      /* HOUSE : START */
      {
        path: 'house',
        component: HouseListingComponent
      },
      /* HOUSE : END */
      /* STAFF : START */
      {
        path: 'staffs/create',
        component: StaffCreateComponent
      },
      {
        path: 'staffs',
        component: StaffListingComponent
      },
      {
        path: 'staffs/update/:id',
        component: StaffUpdateComponent
      },
      {
        path: 'staffs/view/:id',
        component: StaffViewComponent
      },
      /* STAFF : END */
      /* MY PROFILE : START */
      {
        path: 'my-profile',
        component: StaffMyProfileComponent
      },
      /* MY PROFILE : END */
      /* CUSTOMER : START */
      {
        path: 'customers/create',
        component: CustomerCreateComponent
      },
      {
        path: 'customers',
        component: CustomerListingComponent
      },
      {
        path: 'customers/update/:id',
        component: CustomerUpdateComponent
      },
      {
        path: 'customers/view/:id',
        component: CustomerViewComponent
      },
      /* CUSTOMER : END */
      /* FEEDS MEDICINE MANAGEMENT : START */
      {
        path: 'feeds-medicine-management/feeds/create',
        component: FeedsCreateComponent
      },
      {
        path: 'feeds-medicine-management/feeds',
        component: FeedsListingComponent
      },
      {
        path: 'feeds-medicine-management/feeds/update/:id',
        component: FeedsUpdateComponent
      },
      {
        path: 'feeds-medicine-management/medicine/create',
        component: MedicineCreateComponent
      },
      {
        path: 'feeds-medicine-management/medicine',
        component: MedicineListingComponent
      },
      {
        path: 'feeds-medicine-management/medicine/update/:id',
        component: MedicineUpdateComponent
      },
      /* FEEDS MEDICINE MANAGEMENT : END */
      /* FEEDS MEDICINE CONSUMPTION : START */
      {
        path: 'feeds-medicine-consumption/create',
        component: FeedsMedicineConsumptionCreateComponent
      },
      /* {
        path: 'feeds-medicine-consumption/update/:id',
        component: FeedsMedicineConsumptionCreateComponent
      }, */
      {
        path: 'feeds-medicine-consumption',
        component: FeedsMedicineConsumptionListingComponent
      },
      {
        path: 'feeds-medicine-consumption/view/:house_id',
        component: FeedsMedicineConsumptionViewComponent
      },
      {
        path: 'feeds-medicine-consumption/update/:house_id',
        component: FeedsMedicineConsumptionUpdateComponent
      },
      /* FEEDS MEDICINE CONSUMPTION : START */
      /* DAILY REPORTS : START */
      {
        path: 'daily-reports-house/:id',
        component: DailyReportsHouseListingComponent
      },
      {
        path: 'daily-reports',
        component: DailyReportsListingComponent
      },
      {
        path: 'daily-reports/view/:id',
        component: DailyReportsViewComponent
      },
      /* DAILY REPORTS : END */
      /* PAYMENT : START */
      {
        path: 'transactions/update-payment/:id',
        component: PaymentUpdateComponent
      },
      {
        path: 'transactions/payments/:id',
        component: PaymentListingComponent
      },
      /* {
        path: 'transactions/payments/print/:id',
        component: PaymentPrintComponent
      }, */
      {
        path: 'transactions/payments/print/:id/:from',
        component: PaymentPrintComponent
      },
      /* PAYMENT : END */
      /* TRANSACTIONS " START */
      {
        path: 'transactions/create',
        component: TransactionsCreateComponent
      },
      {
        path: 'transactions/create/preview',
        component: TransactionsCreatePreviewComponent
      },
      {
        path: 'transactions',
        component: TransactionsListingComponent
      },
      {
        path: 'transactions-status/:status',
        component: TransactionsListingByOrderStatusComponent
      },
      {
        path: 'transactions-payment/:status',
        component: TransactionsListingByPaymentStatusComponent
      },
      {
        path: 'transactions/view/:id',
        component: TransactionsViewComponent
      },
      /* TRANSACTIONS : END */
      /* PRICE MANAGEMENT : START */
      {
        path: 'price-management',
        component: PriceManagementListingComponent
      },
      {
        path: 'price-management/view/:id',
        component: PriceManagementViewComponent
      },
      /* PRICE MANAGEMENT : END */
      /* PERFORMANCE REPORT : START */
      {
        path: 'performance-report/harvested/production-by-egg-size',
        component: ProductionByEggSizeComponent
      },
      {
        path: 'performance-report/harvested/production-per-house',
        component: ProductionPerHouseComponent
      },
      {
        path: 'performance-report/sales/overall-sales',
        component: OverallSalesComponent
      },
      {
        path: 'performance-report/sales/sales-by-egg-size',
        component: SalesByEggSizeComponent
      },
      {
        path: 'performance-report/consumption/feeds',
        component: FeedsComponent
      },
      {
        path: 'performance-report/consumption/medicine',
        component: MedicineComponent
      },
      {
        path: 'performance-report/stocks',
        component: StocksListingComponent
      },
      {
        path: 'performance-report/stocks/view/:id',
        component: StocksViewComponent
      },
      /* PERFORMANCE REPORT : END */
      /* INVENTORY STOCKS : START */
      {
        path: 'inventory-stocks/fresh-eggs',
        component: FreshEggsListingComponent
      },
      {
        path: 'inventory-stocks/fresh-eggs/view/:date',
        component: FreshEggsViewComponent
      },
      {
        path: 'inventory-stocks/trays',
        component: TraysListingComponent
      },
      {
        path: 'inventory-stocks/trays/view/:id',
        component: TraysViewComponent
      },
      {
        path: 'inventory-stocks/sacks',
        component: SacksListingComponent
      },
      {
        path: 'inventory-stocks/sacks/view/:id',
        component: SacksViewComponent
      },
      /* INVENTORY STOCKS : END */
      /* ACTIVITY LOGS : START */
      {
        path : 'activity-log/activity',
        component: ActivityListingComponent
      },
      /* ACTIVITY LOGS : END */
      { path: "", redirectTo: "dashboard", pathMatch: "full" }
    ]
  },
  { path: "login", component: LoginComponent },
  { path: "**", redirectTo: "login" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
