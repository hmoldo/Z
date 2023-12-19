// Date utils
import {
    roundToNearestMinutes,
    addMinutes,
    addDays,
    isSameDay,
    isToday,
    isTomorrow,
    isEqual,
    add,
    format,
    max,
    min,
    differenceInHours,
} from 'date-fns';
export {
    roundToNearestMinutes,
    addMinutes,
    addDays,
    isSameDay,
    isToday,
    isTomorrow,
    isEqual,
    add,
    format,
    max,
    min,
    differenceInHours,
};

export const dateID = date => parseInt(format(date, 'yyyyMMdd'));
export const time = date => format(date, 'HH:mm');
export const prefix = date => (isToday(date) ? 'Today' : isTomorrow(date) ? 'Tomorrow' : null);

// https://date-fns.org/v2.0.0-alpha.25/docs/format
export const ics = date => format(date, "yyyyMMdd'T'HHmmss");
export const datetime = date => (date ? format(date, "yyyy-MM-dd'T'HH:mm") : null);
export const rfc3339 = date => (date ? format(date, "yyyy-MM-dd'T'HH:mm:ssXXX") : null);
export const rfc3339Z = date => (date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : null);
export const utc = date => (date ? format(new Date(...toUtcArray(date)), "yyyy-MM-dd'T'HH:mm:ss'Z'") : null);

export const toUtcArray = date => [
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
];

export function formatStr(dateStr, formatStr, empty = null) {
    try {
        return format(date(dateStr), formatStr);
    } catch {
        return empty;
    }
}

export const addDaysOr = (date, days) => (date && !isNaN(days) ? addDays(date, days) : null);

/**
 *
 * @param {*} date
 * @param {*} days
 * @returns {Date}
 */
export function getRange(date, days) {
    if (!date) return null;
    date = addDays(new Date(date), days);
    return datetime(date);
}

export const date = v => (v ? new Date(v) : null);

export const formatInput = (rfc3339, f) => (rfc3339 ? format(new Date(rfc3339), f) : '');

export function slice(start, end, gap) {
    let intervals = [];
    for (let time = start; time < end; time = add(time, gap))
        intervals.push({
            start: time,
            end: add(time, gap),
        });
    return intervals;
}

// TODO: add options and comments examples
export function relative(date) {
    return isToday(date) ? prefix(date) + ' at ' + time(date) : format(date, 'dd-MM-yyyy HH:mm');
}

function randomDateNumber(start, end) {
    return start.getTime() + Math.random() * (end.getTime() - start.getTime());
}

export function random(start, end) {
    return new Date(randomDateNumber(start, end));
}

export function randomInterval({ date, duration }) {
    let start = roundToNearestMinutes(random(date.max, date.min), { nearestTo: 10 }),
        end = new Date(start.getTime()),
        mins = Z.randInt(duration.min, duration.max) * duration.step;
    end = addMinutes(end, mins);
    return { start, end };
}

/**
 * From a start date to an end date, get dates not in "dates" array
 * @param {*} dates Array of dates
 * @param {*} startDate Start date
 * @param {*} endDate End date
 * @returns {Array} found dates out of date interval
 */
export function datesNotIn(dates, startDate, endDate) {
    let notInDates = [],
        stamps = dates.map(d => new Date(d.toDateString()).getTime());
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        let stamp = new Date(d.toDateString()).getTime();
        if (!stamps.includes(stamp)) notInDates.push(new Date(d));
    }
    return notInDates;
}

export function createIcsCalendar({ id, tzid, events }) {
    const now = new Date();
    if (!Z.is.array(events)) events = [events];
    let ics_lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'PRODID:-//' + id,
        'METHOD:PUBLISH',
        'X-PUBLISHED-TTL:PT1H',
    ];
    ics_lines.push(...createIcsZone(tzid));
    events.forEach(ev => ics_lines.push(...createIcsEvent(ev, now, tzid)));
    ics_lines.push('END:VCALENDAR');
    return Z.mime.get('ics') + encodeURIComponent(ics_lines.join('\r\n'));
}

function createIcsZone(tzid = DEFAULT_ZONE) {
    let zone = zones[tzid];
    if (!zone) zone = zones[DEFAULT_ZONE];
    let [from, to, standard_month, standard_day, daylight_month, daylight_day] = zone;
    let arr = [
        'BEGIN:VTIMEZONE',
        'TZID:' + tzid,

        'BEGIN:DAYLIGHT',
        'TZOFFSETFROM:' + icsZoneTime(to),
        'RRULE:FREQ=YEARLY;BYMONTH=' + daylight_month + ';BYDAY=' + daylight_day,
        'DTSTART:20070311T020000',
        'TZNAME:GMT' + from,
        'TZOFFSETTO:' + icsZoneTime(from),
        'END:DAYLIGHT',

        'BEGIN:STANDARD',
        'TZOFFSETFROM:' + icsZoneTime(from),
        'RRULE:FREQ=YEARLY;BYMONTH=' + standard_month + ';BYDAY=' + standard_day,
        'DTSTART:20071104T020000',
        'TZNAME:GMT' + to,
        'TZOFFSETTO:' + icsZoneTime(to),
        'END:STANDARD',

        'END:VTIMEZONE',
    ];
    return arr;
}

function createIcsEvent(event, date, tzid) {
    let { location, icsStart, icsEnd } = event;
    tzid = tzid || event.tzid;
    let lines = [
        'BEGIN:VEVENT',
        'UID:' + event.uid,
        'DTSTAMP:' + ics(date),
        // 'ORGANIZER;CN='+app.organizer.name+John Doe:MAILTO:john.doe@example.com
        'DTSTART' + (tzid ? ';TZID=' + tzid + ':' + icsStart : ':' + icsStart + 'Z'),
        'DTEND' + (tzid ? ';TZID=' + tzid + ':' + icsEnd : ':' + icsEnd + 'Z'),
        'SUMMARY:' + event.title,
    ];
    if (location) lines.push('LOCATION:' + location.title);
    lines.push('STATUS:CONFIRMED', 'LAST-MODIFIED:' + date, 'SEQUENCE:0', 'END:VEVENT');
    return lines;
}

// [ from, to, standard_month, standard_day, daylight_month, daylight_day ]
// TODO: fill array with all zones all use a service or send the data in the api feed
const zones = {
    'America/New_York': [-4, -5, 11, '1SU', 3, '2SU'],
    'Europe/Amsterdam': [+1, +2, 10, '-1SU', 3, '-1SU'],
};
// TODO: ensure main event has a timezone
const DEFAULT_ZONE = 'Europe/Amsterdam';

function icsZoneTime(h) {
    let sign = h < 0 ? '-' : '+',
        abs = Math.abs(h);
    return sign + (abs < 10 ? '0' : '') + abs + '00';
}
