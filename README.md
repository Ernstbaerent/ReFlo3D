# ReFlo3D

One-Page-Website für **ReFlo3D**, den 3D-Druck-Shop von Rebekka und Flo aus Friedrichshafen am Bodensee.
Live unter **https://reflo3d.de** (GitHub Pages, eigene Domain über `CNAME`).

Reines HTML, CSS und Vanilla-JavaScript: kein Framework, kein Build-Schritt, keine Cookies, kein Tracking,
keine externen Skripte oder Schriften.

## Struktur

```
index.html            Startseite
impressum.html        Impressum
datenschutz.html      Datenschutzerklärung
assets/css/style.css  Gestaltung (Farben als CSS-Variablen in :root)
assets/js/main.js     Header, Menü, Zähler, Einblendungen, Video, Aktionsleiste
assets/img/           Logo, Favicons, Bilder
assets/video/         Zeitraffer-Video (stumm, Loop)
assets/fonts/         Bricolage Grotesque + Figtree (woff2, SIL OFL)
robots.txt, sitemap.xml, CNAME, .nojekyll
```

## Bilder und Video austauschen

Hero, Herbst, Winter, Galerie 1–4 und das OG-Bild sind echte Produktfotos. Noch gezeichnete
Platzhalter sind `kategorie-wohnen.jpg`, `galerie-5.jpg`, `galerie-6.jpg`, `video-poster.jpg`
und das Video. Bilder einfach durch Fotos mit **gleichem Dateinamen** ersetzen
(Metadaten wie EXIF/GPS vorher entfernen):

| Datei | Format |
| --- | --- |
| `assets/img/hero.jpg` | 1620 × 1080 oder größer (3:2, Motiv eher rechts) |
| `assets/img/video-poster.jpg` | 1080 × 1350 (4:5), erstes/schönstes Bild des Videos |
| `assets/img/kategorie-herbst.jpg`, `-winter.jpg`, `-wohnen.jpg` | 1200 × 960 (5:4) |
| `assets/img/galerie-1.jpg` … `galerie-6.jpg` | 900 × 900 (quadratisch) |
| `assets/img/og-image.jpg` | 1200 × 630 (Vorschaubild beim Teilen) |
| `assets/video/druck-zeitraffer.mp4` | H.264, stumm, wenige MB, idealerweise 4:5 |

Andere Seitenverhältnisse gehen auch, die Bilder werden passend zugeschnitten. Bei abweichender Größe
die Angaben `width`/`height` im HTML anpassen und die Alt-Texte zum neuen Motiv prüfen.

## Lokal ansehen

```
npx serve .
```
