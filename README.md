# AirFloor

**Which floor should you live on? Ask the air.**

AirFloor scores every floor of an apartment building in India for how clean and healthy the air is to breathe, using live air-quality data and the real ground elevation for any place in the country. Find the best floors to breathe before you rent or buy.

Live: **https://yashkotha.github.io/airfloor/**
Source: **https://github.com/yashkotha/airfloor**

Free and open source. Made in India, for India.

## What it does

Pick any area, PIN code, district or city in India, enter your building's height, and AirFloor computes a 0 to 100 air-health score for every floor. It combines:

- **Live air quality** at your location (PM2.5, PM10, NO2, O3, CO, US AQI)
- **Real ground elevation** from a global digital terrain model
- **Atmospheric physics** for how pollution, night inversion, ventilation and oxygen change with height

The result is a per-floor score, a "sweet-spot" band, and a plain-language read on what it means, in English, Telugu and Kannada. You can also export the report as a PDF.

## Why floors matter

The air you breathe is not the same on every floor. Street fumes and the trapped night-inversion layer sit low; the very top loses on wind and daily-life friction, not oxygen. AirFloor makes that trade-off visible so you can choose well.

## Data sources

- Air quality: Open-Meteo Air Quality API (Copernicus CAMS)
- Elevation: Open-Meteo Elevation API (Copernicus DEM GLO-90)
- Place and PIN lookup: Open-Meteo Geocoding, Photon (OpenStreetMap) and the India Post PIN directory

Location and data are restricted to India.

## Tech

No framework, no build step. Two files (`index.html`, `app.js`) plus a small amount of vanilla JavaScript, canvas charts and the Motion library for interaction. Deployed as a static site.

## Run it locally

Clone the repo and serve the folder with any static server:

```
npx serve .
```

Then open the printed URL. That is all, there is nothing to build.

## Deploy

Any static host works, since there is no build step. This project is served by GitHub Pages straight from `main` at the repository root. A `.nojekyll` file is present so Pages serves `.well-known/` as-is; push to `main` and the site rebuilds.

## Privacy

AirFloor collects nothing. No accounts, no cookies, no analytics, no trackers, and no backend of its own. Searches go straight from your browser to open data services. Full details in the [Privacy Policy](privacy.html), written to align with the spirit of India's Digital Personal Data Protection Act, 2023.

## Contributing

Issues and pull requests are welcome, especially for more natural Telugu and Kannada copy, more Indian locations, and accessibility. Please keep it dependency-light and India-focused. All participation is covered by the [Code of Conduct](CODE_OF_CONDUCT.md).

## Disclaimer

AirFloor is an independent environmental and building-microclimate tool. It is a transparent, physics-informed guide for decisions, not a certified site measurement and not medical advice.

## Copyright and license

Created by Yashwanth Kotha. Copyright (c) 2026 Yashwanth Kotha. All rights reserved.

Made in India, for India. Free for anyone to use under these licenses:

- Source code: [MIT License](LICENSE)
- Site text and report content: [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
