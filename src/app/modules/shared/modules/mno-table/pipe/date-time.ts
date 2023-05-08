import * as  momentTimeZone from 'moment-timezone';
// Angular
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'TimezoneDateTime' })
export class TimezoneDateTime implements PipeTransform {

    /**
     * Tp transform the ngbDate to date to be shown in User Interface;
     * @param value
     */
    transform(value: string, format) {
        return this.tranformToTimeZoneWithDateTime(value, format);
    }

    public tranformToTimeZoneWithDateTime(value, format) {
        const timeZone = 'Asia/Calcutta';
        return momentTimeZone.utc(value).tz(timeZone).format(format);
    }
}