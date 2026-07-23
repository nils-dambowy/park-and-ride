/**
 * Calendar (.ics) & QR Code Export Utility
 */

export function downloadCalendarEvent(routeData) {
  const title = `P+R Route: ${routeData.firstMile.modeBadge} + ${routeData.transitLeg.lineName}`;
  const description = `Intermodale Route von ${routeData.transitLeg.fromHub} nach ${routeData.transitLeg.toHub}. Abfahrt: ${routeData.transitLeg.departureTime} Gleis ${routeData.transitLeg.platform}. Gesamtdauer: ${routeData.totalDurationMinutes} Min.`;

  const now = new Date();
  const startDateStr = now.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';
  
  const endTime = new Date(now.getTime() + routeData.totalDurationMinutes * 60000);
  const endDateStr = endTime.toISOString().replace(/-|:|\.\d+/g, '').substring(0, 15) + 'Z';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Park & Ride Calculator//DE',
    'BEGIN:VEVENT',
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `DTSTART:${startDateStr}`,
    `DTEND:${endDateStr}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'pr-route-termin.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
