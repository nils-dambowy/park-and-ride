/**
 * Ticket & Fee Advisor Service
 * Evaluates Deutschlandticket applicability, ÖPNV fare estimates, and P+R/B+R parking fees
 */

export class TicketService {
  getTicketInfo(originCountry = "DE", destinationCountry = "DE", transitType = "RE") {
    const isGermanyInternal = originCountry === "DE" && destinationCountry === "DE";

    if (isGermanyInternal) {
      return {
        deutschlandticketValid: true,
        deutschlandticketNote: "Im Deutschlandticket (49 € / Monat) komplett enthalten",
        singleTicketEstimate: "3.80 € - 5.60 € (Einzelfahrschein)",
        prParkingFee: "2.00 € / Tag (Kostenlos für ÖPNV-Abonnenten)",
        brBoxFee: "0.00 € (Überdachter Fahrradstellplatz kostenlos)"
      };
    } else {
      return {
        deutschlandticketValid: false,
        deutschlandticketNote: "Grenzüberschreitende / internationale Route",
        singleTicketEstimate: "14.50 € - 28.00 € (Internationales Ticket)",
        prParkingFee: "3.50 € / Tag",
        brBoxFee: "1.00 € / Tag (Gesicherte Fahrradbox)"
      };
    }
  }
}

export const ticketService = new TicketService();
