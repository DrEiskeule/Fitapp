# FitPulse Web-App (Windows + iPhone)

## Was ist das?
Eine mobile Web-App (PWA) im dunklen FitPulse-Design. Sie läuft im Browser, merkt sich Eingaben lokal und kann nach Veröffentlichung als Symbol auf dem iPhone-Homescreen installiert werden.

## Enthalten
- Kalorien und Lebensmittel manuell eintragen
- Barcode-Nummer eingeben und Produktdaten über Open Food Facts suchen
- Foto/Kamera als Gedächtnisstütze auswählen
- Workouts, Trainingsminuten, geschätzte Kalorien, Sätze und Wiederholungen erfassen
- Wasserziel, Schritte und aktive Kalorien manuell protokollieren
- Lokale Speicherung mit localStorage
- PWA-Manifest und Service Worker für Homescreen/Offline-Grundgerüst

## Grenzen
- Ein Foto berechnet nicht automatisch zuverlässig Kalorien; Portionsgröße und Nährwerte müssen bestätigt/eingetragen werden.
- Diese Browser-App kann nicht direkt Apple Health/HealthKit auslesen. Dafür ist eine native iOS-App oder eine separate unterstützte Brücke nötig.
- Barcode-Suche braucht Internet und hängt von der Datenbankabdeckung ab.
- Daten bleiben in dem Browser auf dem Gerät; keine Konto- oder Cloud-Synchronisierung.
- Für den Homescreen muss die App unter einer HTTPS-Adresse erreichbar sein (z. B. GitHub Pages). `file://` reicht nicht für PWA-Funktionen.

## Auf Windows testen
Einfach `index.html` doppelklicken, um die Oberfläche zu testen. Für PWA/Service Worker wird HTTPS-Hosting benötigt.

## Kostenlos veröffentlichen (GitHub Pages)
1. GitHub-Konto öffnen/anlegen und ein neues öffentliches Repository erstellen.
2. Inhalt dieses Ordners hochladen (Dateien direkt im Hauptverzeichnis, nicht den übergeordneten Ordner).
3. In Repository Settings → Pages, bei Build and deployment „Deploy from a branch“ wählen; Branch `main`, Folder `/ (root)`, speichern.
4. Nach Veröffentlichung die von GitHub angezeigte HTTPS-URL am iPhone in Safari öffnen.
5. Teilen → „Zum Home-Bildschirm“ / „Zum Home-Bildschirm hinzufügen“ → „Als Web-App öffnen“ aktivieren, falls angezeigt → „Hinzufügen“.

## Datenschutz
Die Eingaben werden lokal im Browser gespeichert. Barcode-Produktabfragen senden die Barcode-Nummer an Open Food Facts. Es werden keine Benutzerkonten erstellt.
