import { NgModule } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatNativeDateModule, MatExpansionModule, MatListModule, MatMenuModule, MatIconModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TimeagoModule } from 'ngx-timeago';
import { MatTabsModule } from '@angular/material/tabs';
/* import { CountDown } from './../countdown/countdown'; */
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatBadgeModule } from '@angular/material/badge';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatPaginatorModule } from '@angular/material/paginator';

import { MatProgressButtonsModule } from 'mat-progress-buttons';

const MaterialComponents = [
  MatToolbarModule,
  MatListModule,
  MatExpansionModule,
  MatIconModule,
  MatMenuModule,
  MatButtonModule,
  MatSlideToggleModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatDatepickerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatCheckboxModule,
  MatSelectModule,
  MatChipsModule,
  SatDatepickerModule,
  SatNativeDateModule,
  TimeagoModule,
  MatAutocompleteModule,
  MatTabsModule,
  MatBadgeModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatProgressButtonsModule
]

@NgModule({
  declarations: [
    /* CountDown */
  ],
  imports: [
    MaterialComponents
  ],
  exports: [
    MaterialComponents,
    /* CountDown */
  ]
})
export class MaterialModule { }
