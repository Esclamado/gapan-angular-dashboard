import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timezone'
})

export class TimezonePipe implements PipeTransform {

  server_timezone = /* 'Canada/Atlantic'; */'Asia/Manila';

  transform(date: Date): any  {
    date = new Date(date);
    var invdate = new Date(date.toLocaleString('en-US', {
      timeZone: this.server_timezone
    }));
    var diff = date.getTime() - invdate.getTime();
    return new Date(date.getTime() + diff);
  }

}
