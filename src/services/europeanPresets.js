/**
 * European & Worldwide Location Presets & P+R / B+R Hub Dataset
 */

export const EUROPEAN_PRESETS = [
  {
    id: "preset_rossdorf",
    label: "Roßdorf (b. Darmstadt) → Mainz Hbf (P+R / B+R)",
    originName: "36, Thomas-Mann-Straße, 64380 Roßdorf",
    originCoords: { lat: 49.8550, lng: 8.7520 },
    destinationName: "Mainz Hbf, Bahnhofplatz 1, 55116 Mainz",
    destinationCoords: { lat: 50.0010, lng: 8.2590 },
    hubName: "Darmstadt Hauptbahnhof",
    hubAddress: "Am Hauptbahnhof 20, 64293 Darmstadt",
    hubCoords: { lat: 49.8725, lng: 8.6300 }
  },
  {
    id: "preset_berlin",
    label: "Potsdam → Berlin Alexanderplatz (P+R S-Bahn)",
    originName: "Potsdam West, Werder Damm, 14471 Potsdam",
    originCoords: { lat: 52.3920, lng: 12.9810 },
    destinationName: "Berlin Alexanderplatz, 10178 Berlin",
    destinationCoords: { lat: 52.5219, lng: 13.4132 },
    hubName: "Potsdam Hauptbahnhof",
    hubAddress: "Friedrich-Engels-Straße 99, 14473 Potsdam",
    hubCoords: { lat: 52.3916, lng: 13.0667 }
  },
  {
    id: "preset_munich",
    label: "Starnberg → München Hauptbahnhof (P+R / B+R)",
    originName: "Starnberg Nord, Hanfelder Str., 82319 Starnberg",
    originCoords: { lat: 48.0080, lng: 11.3450 },
    destinationName: "München Hauptbahnhof, 80335 München",
    destinationCoords: { lat: 48.1403, lng: 11.5583 },
    hubName: "Bahnhof Starnberg Nord",
    hubAddress: "Bahnhofplatz 1, 82319 Starnberg",
    hubCoords: { lat: 48.0050, lng: 11.3520 }
  },
  {
    id: "preset_hamburg",
    label: "Pinneberg → Hamburg Jungfernstieg (B+R S-Bahn)",
    originName: "Pinneberg, Elmshorner Str., 25421 Pinneberg",
    originCoords: { lat: 53.6620, lng: 9.7900 },
    destinationName: "Hamburg Jungfernstieg, 20354 Hamburg",
    destinationCoords: { lat: 53.5530, lng: 9.9930 },
    hubName: "Pinneberg S-Bahn Station",
    hubAddress: "Rockvillestr. 1, 25421 Pinneberg",
    hubCoords: { lat: 53.6550, lng: 9.7960 }
  },
  {
    id: "preset_zurich",
    label: "Thun → Zürich Hauptbahnhof (P+R SBB Express)",
    originName: "Thun, Bernstrasse, 3600 Thun",
    originCoords: { lat: 46.7620, lng: 7.6250 },
    destinationName: "Zürich Hauptbahnhof, 8001 Zürich",
    destinationCoords: { lat: 47.3781, lng: 8.5402 },
    hubName: "SBB Bahnhof Thun",
    hubAddress: "Seestrasse 2, 3600 Thun, Schweiz",
    hubCoords: { lat: 46.7550, lng: 7.6290 }
  },
  {
    id: "preset_paris",
    label: "Versailles → Paris Gare de Lyon (P+R Transilien)",
    originName: "Versailles, Rue de Paris, 78000 Versailles",
    originCoords: { lat: 48.8048, lng: 2.1301 },
    destinationName: "Paris Gare de Lyon, 75012 Paris",
    destinationCoords: { lat: 48.8443, lng: 2.3744 },
    hubName: "Gare de Versailles Chantiers",
    hubAddress: "Place Raymond Poincaré, 78000 Versailles, Frankreich",
    hubCoords: { lat: 48.7950, lng: 2.1350 }
  }
];
