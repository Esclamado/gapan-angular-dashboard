import { BrowserModule } from "@angular/platform-browser";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { DatePipe } from '@angular/common';
import { EventsModule } from 'angular4-events';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { NgxWebstorageModule } from "ngx-webstorage";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

/* Default Layouts */
import { TemplateComponent } from './layout/template/template.component';
import { MaterialModule } from "./components/modules/material/material.module";
import { MatNativeDateModule } from '@angular/material';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
/* import { ClickOutsideModule } from 'ng-click-outside'; */

import { ImageCropperModule } from 'ngx-image-cropper';
import { MomentModule } from 'ngx-moment';

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

import { PriceManagementListingComponent } from './pages/main/price-management/price-management-listing/price-management-listing.component';
import { PriceManagementViewComponent } from './pages/main/price-management/price-management-view/price-management-view.component';

import { StaffCreateComponent } from './pages/main/staff/staff-create/staff-create.component';
import { StaffListingComponent } from './pages/main/staff/staff-listing/staff-listing.component';
import { StaffUpdateComponent } from './pages/main/staff/staff-update/staff-update.component';
import { StaffViewComponent } from './pages/main/staff/staff-view/staff-view.component';

import { TransactionsCreateComponent } from './pages/main/transactions/transactions-create/transactions-create.component';
import { TransactionsListingComponent } from './pages/main/transactions/transactions-listing/transactions-listing.component';
import { TransactionsListingByOrderStatusComponent } from './pages/main/transactions/transactions-listing-by-order-status/transactions-listing-by-order-status.component';
import { TransactionsListingByPaymentStatusComponent } from './pages/main/transactions/transactions-listing-by-payment-status/transactions-listing-by-payment-status.component';
import { TransactionsViewComponent } from './pages/main/transactions/transactions-view/transactions-view.component';
import { NgxMasonryModule } from 'ngx-masonry';

import { HouseModalComponent } from './components/modals/house-modal/house-modal.component';
import { ConfirmPasswordModalComponent } from './components/modals/confirm-password-modal/confirm-password-modal.component';
import { GeneralModalComponent } from './components/modals/general-modal/general-modal.component';
import { ReportsButtonsComponent } from './components/reports/reports-buttons/reports-buttons.component';
import { MedicineUnitModalComponent } from './components/modals/medicine-unit-modal/medicine-unit-modal.component';

import { TimeagoModule } from 'ngx-timeago';
import { PriceModalComponent } from './components/modals/price-modal/price-modal.component';
import { TransactionCreateModalComponent } from './components/modals/transaction-create-modal/transaction-create-modal.component';
import { ActivityListingComponent } from './pages/main/activity/activity-listing/activity-listing.component';

import { FreshEggInventoryModalComponent } from './components/modals/fresh-egg-inventory-modal/fresh-egg-inventory-modal.component';
import { LayoutModule } from '@angular/cdk/layout';
import { StaffMyProfileComponent } from './pages/main/staff/staff-my-profile/staff-my-profile.component';
import { TransactionsCreatePreviewComponent } from './pages/main/transactions/transactions-create-preview/transactions-create-preview.component';
import { ViewPaymentModalComponent } from './components/modals/view-payment-modal/view-payment-modal.component';
import { PaymentListingComponent } from './pages/main/payment/payment-listing/payment-listing.component';
import { PaymentUpdateComponent } from './pages/main/payment/payment-update/payment-update.component';
import { PaymentPrintComponent } from './pages/main/payment/payment-print/payment-print.component';

import { NgxPrintModule } from 'ngx-print';
import { AddDiscountModalComponent } from './components/modals/add-discount-modal/add-discount-modal.component';

import { ChartsModule } from 'ng2-charts';
import { ReportProductionByEggSizeComponent } from './components/modals/reports/report-production-by-egg-size/report-production-by-egg-size.component';

import { ExportAsModule } from 'ngx-export-as';
import { ReportOverallSalesComponent } from './components/modals/reports/report-overall-sales/report-overall-sales.component';
import { ReportDailyHouseComponent } from './components/modals/reports/report-daily-house/report-daily-house.component';
import { ReportDailyComponent } from './components/modals/reports/report-daily/report-daily.component';
import { ReportEggPriceComponent } from './components/modals/reports/report-egg-price/report-egg-price.component';
import { ReportPriceTrendComponent } from './components/modals/reports/report-price-trend/report-price-trend.component';
import { ReportSalesEggComponent } from './components/modals/reports/report-sales-egg/report-sales-egg.component';
import { ReportStocksComponent } from './components/modals/reports/report-stocks/report-stocks.component';
import { ReportProductionPerHouseComponent } from './components/modals/reports/report-production-per-house/report-production-per-house.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from './../environments/environment';
import { ReportFeedsConsumptionComponent } from './components/modals/reports/report-feeds-consumption/report-feeds-consumption.component';
import { MedicineConsumptionUpdateModalComponent } from './components/modals/medicine-consumption-update-modal/medicine-consumption-update-modal.component';
import { ReportFreshEggsComponent } from './components/modals/reports/report-fresh-eggs/report-fresh-eggs.component';
import { ReportTraysComponent } from './components/modals/reports/report-trays/report-trays.component';
import { ReportSacksComponent } from './components/modals/reports/report-sacks/report-sacks.component';
import { ReportDailyViewComponent } from './components/modals/reports/report-daily-view/report-daily-view.component';
import { ReportMonthlyRecordComponent } from './components/modals/reports/report-monthly-record/report-monthly-record.component';
import { ReportFreshEggsViewComponent } from './components/modals/reports/report-fresh-eggs-view/report-fresh-eggs-view.component';
import { FeedConsumptionUpdateModalComponent } from './components/modals/feed-consumption-update-modal/feed-consumption-update-modal.component';
import { ReportMedicineComponent } from './components/modals/reports/report-medicine/report-medicine.component';
import { ReportFooterComponent } from './components/modals/reports/report-footer/report-footer.component';
import { AddEggModalComponent } from './components/modals/add-egg-modal/add-egg-modal.component';
import { FeedsMedicineConsumptionUpdateComponent } from './pages/main/feeds-medicine-consumption/feeds-medicine-consumption-update/feeds-medicine-consumption-update.component';
import { FeedsMedicineManagementUpdateModalComponent } from './components/modals/feeds-medicine-management-update-modal/feeds-medicine-management-update-modal.component';
import { TimezonePipe } from './components/pipes/timezone.pipe';

import { MatProgressButtonsModule } from 'mat-progress-buttons';

import { NgxSpinnerModule } from "ngx-spinner";
import { ReportTraysViewComponent } from './components/modals/reports/report-trays-view/report-trays-view.component';
import { ReportSacksViewComponent } from './components/modals/reports/report-sacks-view/report-sacks-view.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,

    LoginComponent,

    CustomerCreateComponent,
    CustomerListingComponent,
    CustomerUpdateComponent,
    CustomerViewComponent,

    DailyReportsHouseListingComponent,
    DailyReportsListingComponent,
    DailyReportsViewComponent,

    DashboardComponent,

    FeedsMedicineConsumptionCreateComponent,
    FeedsMedicineConsumptionListingComponent,
    FeedsMedicineConsumptionViewComponent,

    FeedsCreateComponent,
    FeedsListingComponent,
    FeedsUpdateComponent,

    MedicineCreateComponent,
    MedicineListingComponent,
    MedicineUpdateComponent,

    HouseListingComponent,
    HouseModalComponent,

    FreshEggsListingComponent,
    FreshEggsViewComponent,

    SacksListingComponent,
    SacksViewComponent,

    TraysListingComponent,
    TraysViewComponent,

    FeedsComponent,
    MedicineComponent,

    ProductionByEggSizeComponent,
    ProductionPerHouseComponent,

    OverallSalesComponent,
    SalesByEggSizeComponent,

    StocksListingComponent,
    StocksViewComponent,

    PriceManagementListingComponent,
    PriceManagementViewComponent,

    StaffCreateComponent,
    StaffListingComponent,
    StaffUpdateComponent,
    StaffViewComponent,

    TransactionsCreateComponent,
    TransactionsListingComponent,
    TransactionsListingByOrderStatusComponent,
    TransactionsListingByPaymentStatusComponent,
    TransactionsViewComponent,
    ConfirmPasswordModalComponent,
    GeneralModalComponent,
    ReportsButtonsComponent,
    MedicineUnitModalComponent,
    PriceModalComponent,
    TransactionCreateModalComponent,
    ActivityListingComponent,
    FreshEggInventoryModalComponent,
    StaffMyProfileComponent,
    TransactionsCreatePreviewComponent,
    ViewPaymentModalComponent,
    PaymentListingComponent,
    PaymentUpdateComponent,
    PaymentPrintComponent,
    AddDiscountModalComponent,
    ReportProductionByEggSizeComponent,
    ReportOverallSalesComponent,
    ReportDailyHouseComponent,
    ReportDailyComponent,
    ReportEggPriceComponent,
    ReportPriceTrendComponent,
    ReportSalesEggComponent,
    ReportStocksComponent,
    ReportProductionPerHouseComponent,
    ReportFeedsConsumptionComponent,
    MedicineConsumptionUpdateModalComponent,
    ReportFreshEggsComponent,
    ReportTraysComponent,
    ReportSacksComponent,
    ReportDailyViewComponent,
    ReportMonthlyRecordComponent,
    ReportFreshEggsViewComponent,
    FeedConsumptionUpdateModalComponent,
    ReportMedicineComponent,
    ReportFooterComponent,
    AddEggModalComponent,
    FeedsMedicineConsumptionUpdateComponent,
    FeedsMedicineManagementUpdateModalComponent,
    TimezonePipe,
    ReportTraysViewComponent,
    ReportSacksViewComponent
  ],
  entryComponents: [
    HouseModalComponent,
    MedicineUnitModalComponent,
    ConfirmPasswordModalComponent,
    GeneralModalComponent,
    PriceModalComponent,
    TransactionCreateModalComponent,
    FreshEggInventoryModalComponent,
    ViewPaymentModalComponent,
    AddDiscountModalComponent,
    ReportProductionByEggSizeComponent,
    ReportOverallSalesComponent,
    ReportDailyComponent,
    ReportDailyHouseComponent,
    ReportEggPriceComponent,
    ReportPriceTrendComponent,
    ReportSalesEggComponent,
    ReportStocksComponent,
    ReportProductionPerHouseComponent,
    ReportFeedsConsumptionComponent,
    MedicineConsumptionUpdateModalComponent,
    ReportFreshEggsComponent,
    ReportTraysComponent,
    ReportSacksComponent,
    ReportDailyViewComponent,
    ReportMonthlyRecordComponent,
    ReportFreshEggsViewComponent,
    FeedConsumptionUpdateModalComponent,
    ReportMedicineComponent,
    AddEggModalComponent,
    FeedsMedicineManagementUpdateModalComponent,
    ReportTraysViewComponent,
    ReportSacksViewComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    NgxWebstorageModule.forRoot(),
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot(),
    EventsModule.forRoot(),
    MaterialModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    /* ClickOutsideModule, */
    ImageCropperModule,
    MomentModule,
    NgxMasonryModule,
    TimeagoModule.forRoot(),
    LayoutModule,
    NgxPrintModule,
    ChartsModule,
    ExportAsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    MatProgressButtonsModule.forRoot(),
    NgxSpinnerModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ 
    MatNativeDateModule,
    DatePipe,
    AngularFirestore,
    TimezonePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
