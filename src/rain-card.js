/*
 * Rain Card for Home Assistant
 * https://github.com/juju35/ha-rain-card
 *
 * Lovelace cards for the rain in the next hour: the 60-minute rain forecast of Météo-France
 * (https://www.home-assistant.io/integrations/meteo_france/, its "next rain" sensor), or the hourly precipitation
 * of any weather entity (weather.get_forecasts), drawn as a ribbon of twelve 5-minute bars.
 */

const VERSION = "__VERSION__";

const STRINGS = {
  en: {
    title: "Rain",
    pill_dry: "Dry",
    pill_soon: "In {min} min",
    pill_raining: "Raining",
    pill_stopping: "Stops in {min} min",
    pill_stale: "Outdated",
    pill_unknown: "No data",
    pill_unavailable: "Unavailable",
    head_dry: "Dry for the next hour",
    head_soon: "Rain at {time}",
    head_raining: "Raining until about {time}",
    head_stopping: "Rain stops at {time}",
    head_stale: "Forecast out of date",
    head_unknown: "No forecast right now",
    head_unavailable: "Forecast unavailable",
    sub_dry: "No rain expected before {time}",
    sub_until: "{level} · until {time}",
    sub_beyond: "{level} · until at least {time}",
    sub_all_hour: "{level} · all through the next hour",
    sub_dry_from: "{level} · dry from {time}",
    sub_stale: "Last forecast at {time}",
    sub_unknown: "The source gives no rain data for the next hour",
    sub_unavailable: "The forecast entity is unavailable",
    no_hourly: "This weather entity gives no hourly forecast",
    level_1: "Light",
    level_2: "Moderate",
    level_3: "Heavy",
    level_rain: "Rain",
    bar_dry: "dry",
    bar_none: "no data",
    axis_now: "Now",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Rain over the next hour",
    updated: "updated {time}",
    hourly: "hourly forecast",
    no_source: "No rain forecast found. Set up Météo-France, or give the card a weather entity.",
    unknown_entity: "Entity not found",
    entity: "Forecast entity (optional, found automatically)",
    entity_helper: "Météo-France next rain sensor, or a weather entity (hourly forecast)",
    name: "Title (optional)",
    location: "Location (optional, read from the forecast)",
    show_title: "Show title",
    show_subtitle: "Show location",
    show_details: "Show intensity and end time",
    show_ribbon: "Show the 60-minute ribbon",
    show_source: "Show source and update time",
    language: "Language",
    lang_auto: "Automatic",
    zoom: "Detail button",
    zoom_helper: "Button at the top right that switches the mini card to the full card and back",
    zoom_in: "Show the full card",
    zoom_out: "Show the compact card",
    illustration: "Animated illustration",
    illustration_theme: "Illustration theme",
    theme_auto: "Automatic (sun or dark theme)",
    theme_day: "Day",
    theme_night: "Night",
  },
  fr: {
    title: "Pluie",
    pill_dry: "Sec",
    pill_soon: "Dans {min} min",
    pill_raining: "Il pleut",
    pill_stopping: "Fin dans {min} min",
    pill_stale: "Périmée",
    pill_unknown: "Aucune donnée",
    pill_unavailable: "Indisponible",
    head_dry: "Pas de pluie dans l'heure",
    head_soon: "Pluie à {time}",
    head_raining: "Pluie jusque vers {time}",
    head_stopping: "Fin de la pluie à {time}",
    head_stale: "Prévision périmée",
    head_unknown: "Pas de prévision pour l'instant",
    head_unavailable: "Prévision indisponible",
    sub_dry: "Pas de pluie prévue avant {time}",
    sub_until: "{level} · jusqu'à {time}",
    sub_beyond: "{level} · au moins jusqu'à {time}",
    sub_all_hour: "{level} · pendant toute l'heure",
    sub_dry_from: "{level} · sec à partir de {time}",
    sub_stale: "Dernière prévision à {time}",
    sub_unknown: "La source ne donne aucune donnée de pluie pour l'heure à venir",
    sub_unavailable: "L'entité de prévision est indisponible",
    no_hourly: "Cette entité météo ne donne pas de prévision horaire",
    level_1: "Faible",
    level_2: "Modérée",
    level_3: "Forte",
    level_rain: "Pluie",
    bar_dry: "sec",
    bar_none: "pas de donnée",
    axis_now: "Maintenant",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Pluie dans l'heure",
    updated: "mise à jour {time}",
    hourly: "prévision horaire",
    no_source: "Aucune prévision de pluie trouvée. Configurez Météo-France ou donnez une entité météo à la carte.",
    unknown_entity: "Entité introuvable",
    entity: "Entité de prévision (facultative, trouvée automatiquement)",
    entity_helper: "Capteur « prochaine pluie » de Météo-France, ou entité météo (prévision horaire)",
    name: "Titre (facultatif)",
    location: "Lieu (facultatif, lu dans la prévision)",
    show_title: "Afficher le titre",
    show_subtitle: "Afficher le lieu",
    show_details: "Afficher l'intensité et l'heure de fin",
    show_ribbon: "Afficher le ruban de 60 minutes",
    show_source: "Afficher la source et l'heure de mise à jour",
    language: "Langue",
    lang_auto: "Automatique",
    zoom: "Bouton détail",
    zoom_helper: "Bouton en haut à droite qui passe de la mini-carte à la carte complète et inversement",
    zoom_in: "Afficher la carte complète",
    zoom_out: "Afficher la carte compacte",
    illustration: "Illustration animée",
    illustration_theme: "Thème de l’illustration",
    theme_auto: "Automatique (soleil ou thème sombre)",
    theme_day: "Jour",
    theme_night: "Nuit",
  },
  de: {
    title: "Regen",
    pill_dry: "Trocken",
    pill_soon: "In {min} Min.",
    pill_raining: "Es regnet",
    pill_stopping: "Endet in {min} Min.",
    pill_stale: "Veraltet",
    pill_unknown: "Keine Daten",
    pill_unavailable: "Nicht verfügbar",
    head_dry: "Trocken in der nächsten Stunde",
    head_soon: "Regen um {time}",
    head_raining: "Regen bis etwa {time}",
    head_stopping: "Regen endet um {time}",
    head_stale: "Vorhersage veraltet",
    head_unknown: "Derzeit keine Vorhersage",
    head_unavailable: "Vorhersage nicht verfügbar",
    sub_dry: "Kein Regen erwartet vor {time}",
    sub_until: "{level} · bis {time}",
    sub_beyond: "{level} · mindestens bis {time}",
    sub_all_hour: "{level} · die ganze nächste Stunde",
    sub_dry_from: "{level} · trocken ab {time}",
    sub_stale: "Letzte Vorhersage um {time}",
    sub_unknown: "Die Quelle liefert keine Regendaten für die nächste Stunde",
    sub_unavailable: "Die Vorhersage-Entität ist nicht verfügbar",
    no_hourly: "Diese Wetter-Entität liefert keine stündliche Vorhersage",
    level_1: "Leicht",
    level_2: "Mäßig",
    level_3: "Stark",
    level_rain: "Regen",
    bar_dry: "trocken",
    bar_none: "keine Daten",
    axis_now: "Jetzt",
    axis_30: "+30 Min.",
    axis_60: "+60 Min.",
    ribbon_label: "Regen in der nächsten Stunde",
    updated: "aktualisiert {time}",
    hourly: "stündliche Vorhersage",
    no_source: "Keine Regenvorhersage gefunden. Richte Météo-France ein oder gib der Karte eine Wetter-Entität.",
    unknown_entity: "Entität nicht gefunden",
    entity: "Vorhersage-Entität (optional, wird automatisch gefunden)",
    entity_helper: "Météo-France-Sensor „nächster Regen“ oder eine Wetter-Entität (stündliche Vorhersage)",
    name: "Titel (optional)",
    location: "Ort (optional, aus der Vorhersage gelesen)",
    show_title: "Titel anzeigen",
    show_subtitle: "Ort anzeigen",
    show_details: "Intensität und Endzeit anzeigen",
    show_ribbon: "60-Minuten-Band anzeigen",
    show_source: "Quelle und Aktualisierungszeit anzeigen",
    language: "Sprache",
    lang_auto: "Automatisch",
    zoom: "Detail-Schaltfläche",
    zoom_helper: "Schaltfläche oben rechts, die von der Mini-Karte zur vollständigen Karte und zurück wechselt",
    zoom_in: "Vollständige Karte anzeigen",
    zoom_out: "Kompakte Karte anzeigen",
    illustration: "Animierte Illustration",
    illustration_theme: "Thema der Illustration",
    theme_auto: "Automatisch (Sonne oder dunkles Design)",
    theme_day: "Tag",
    theme_night: "Nacht",
  },
  es: {
    title: "Lluvia",
    pill_dry: "Seco",
    pill_soon: "En {min} min",
    pill_raining: "Lloviendo",
    pill_stopping: "Para en {min} min",
    pill_stale: "Desactualizada",
    pill_unknown: "Sin datos",
    pill_unavailable: "No disponible",
    head_dry: "Seco durante la próxima hora",
    head_soon: "Lluvia a las {time}",
    head_raining: "Lluvia hasta las {time} aprox.",
    head_stopping: "La lluvia para a las {time}",
    head_stale: "Previsión desactualizada",
    head_unknown: "Sin previsión por ahora",
    head_unavailable: "Previsión no disponible",
    sub_dry: "No se espera lluvia antes de las {time}",
    sub_until: "{level} · hasta las {time}",
    sub_beyond: "{level} · al menos hasta las {time}",
    sub_all_hour: "{level} · durante toda la próxima hora",
    sub_dry_from: "{level} · seco desde las {time}",
    sub_stale: "Última previsión a las {time}",
    sub_unknown: "La fuente no da datos de lluvia para la próxima hora",
    sub_unavailable: "La entidad de previsión no está disponible",
    no_hourly: "Esta entidad meteorológica no da previsión por horas",
    level_1: "Débil",
    level_2: "Moderada",
    level_3: "Fuerte",
    level_rain: "Lluvia",
    bar_dry: "seco",
    bar_none: "sin datos",
    axis_now: "Ahora",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Lluvia en la próxima hora",
    updated: "actualizado a las {time}",
    hourly: "previsión por horas",
    no_source: "No se encontró ninguna previsión de lluvia. Configura Météo-France o indica una entidad meteorológica a la tarjeta.",
    unknown_entity: "Entidad no encontrada",
    entity: "Entidad de previsión (opcional, se encuentra automáticamente)",
    entity_helper: "Sensor «próxima lluvia» de Météo-France, o una entidad meteorológica (previsión por horas)",
    name: "Título (opcional)",
    location: "Lugar (opcional, leído de la previsión)",
    show_title: "Mostrar el título",
    show_subtitle: "Mostrar el lugar",
    show_details: "Mostrar la intensidad y la hora de fin",
    show_ribbon: "Mostrar la cinta de 60 minutos",
    show_source: "Mostrar la fuente y la hora de actualización",
    language: "Idioma",
    lang_auto: "Automático",
    zoom: "Botón de detalle",
    zoom_helper: "Botón arriba a la derecha que cambia de la minitarjeta a la tarjeta completa y viceversa",
    zoom_in: "Mostrar la tarjeta completa",
    zoom_out: "Mostrar la tarjeta compacta",
    illustration: "Ilustración animada",
    illustration_theme: "Tema de la ilustración",
    theme_auto: "Automático (sol o tema oscuro)",
    theme_day: "Día",
    theme_night: "Noche",
  },
  it: {
    title: "Pioggia",
    pill_dry: "Asciutto",
    pill_soon: "Tra {min} min",
    pill_raining: "Piove",
    pill_stopping: "Smette tra {min} min",
    pill_stale: "Non aggiornata",
    pill_unknown: "Nessun dato",
    pill_unavailable: "Non disponibile",
    head_dry: "Asciutto nella prossima ora",
    head_soon: "Pioggia alle {time}",
    head_raining: "Pioggia fino alle {time} circa",
    head_stopping: "La pioggia smette alle {time}",
    head_stale: "Previsione non aggiornata",
    head_unknown: "Nessuna previsione al momento",
    head_unavailable: "Previsione non disponibile",
    sub_dry: "Nessuna pioggia prevista prima delle {time}",
    sub_until: "{level} · fino alle {time}",
    sub_beyond: "{level} · almeno fino alle {time}",
    sub_all_hour: "{level} · per tutta la prossima ora",
    sub_dry_from: "{level} · asciutto dalle {time}",
    sub_stale: "Ultima previsione alle {time}",
    sub_unknown: "La fonte non fornisce dati sulla pioggia per la prossima ora",
    sub_unavailable: "L'entità di previsione non è disponibile",
    no_hourly: "Questa entità meteo non fornisce previsioni orarie",
    level_1: "Debole",
    level_2: "Moderata",
    level_3: "Forte",
    level_rain: "Pioggia",
    bar_dry: "asciutto",
    bar_none: "nessun dato",
    axis_now: "Ora",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Pioggia nella prossima ora",
    updated: "aggiornato alle {time}",
    hourly: "previsione oraria",
    no_source: "Nessuna previsione di pioggia trovata. Configura Météo-France o indica alla scheda un'entità meteo.",
    unknown_entity: "Entità non trovata",
    entity: "Entità di previsione (facoltativa, trovata automaticamente)",
    entity_helper: "Sensore «prossima pioggia» di Météo-France, o un'entità meteo (previsione oraria)",
    name: "Titolo (facoltativo)",
    location: "Luogo (facoltativo, letto dalla previsione)",
    show_title: "Mostra il titolo",
    show_subtitle: "Mostra il luogo",
    show_details: "Mostra intensità e ora di fine",
    show_ribbon: "Mostra il nastro di 60 minuti",
    show_source: "Mostra fonte e ora di aggiornamento",
    language: "Lingua",
    lang_auto: "Automatica",
    zoom: "Pulsante dettagli",
    zoom_helper: "Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa",
    zoom_in: "Mostra la scheda completa",
    zoom_out: "Mostra la scheda compatta",
    illustration: "Illustrazione animata",
    illustration_theme: "Tema dell’illustrazione",
    theme_auto: "Automatico (sole o tema scuro)",
    theme_day: "Giorno",
    theme_night: "Notte",
  },
  nl: {
    title: "Regen",
    pill_dry: "Droog",
    pill_soon: "Over {min} min",
    pill_raining: "Het regent",
    pill_stopping: "Stopt over {min} min",
    pill_stale: "Verouderd",
    pill_unknown: "Geen gegevens",
    pill_unavailable: "Niet beschikbaar",
    head_dry: "Droog het komende uur",
    head_soon: "Regen om {time}",
    head_raining: "Regen tot ongeveer {time}",
    head_stopping: "Regen stopt om {time}",
    head_stale: "Verwachting verouderd",
    head_unknown: "Op dit moment geen verwachting",
    head_unavailable: "Verwachting niet beschikbaar",
    sub_dry: "Geen regen verwacht voor {time}",
    sub_until: "{level} · tot {time}",
    sub_beyond: "{level} · minstens tot {time}",
    sub_all_hour: "{level} · het hele komende uur",
    sub_dry_from: "{level} · droog vanaf {time}",
    sub_stale: "Laatste verwachting om {time}",
    sub_unknown: "De bron geeft geen regengegevens voor het komende uur",
    sub_unavailable: "De verwachtingsentiteit is niet beschikbaar",
    no_hourly: "Deze weerentiteit geeft geen verwachting per uur",
    level_1: "Licht",
    level_2: "Matig",
    level_3: "Zwaar",
    level_rain: "Regen",
    bar_dry: "droog",
    bar_none: "geen gegevens",
    axis_now: "Nu",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Regen in het komende uur",
    updated: "bijgewerkt {time}",
    hourly: "verwachting per uur",
    no_source: "Geen regenverwachting gevonden. Stel Météo-France in of geef de kaart een weerentiteit.",
    unknown_entity: "Entiteit niet gevonden",
    entity: "Verwachtingsentiteit (optioneel, wordt automatisch gevonden)",
    entity_helper: "Météo-France-sensor „volgende regen”, of een weerentiteit (verwachting per uur)",
    name: "Titel (optioneel)",
    location: "Locatie (optioneel, uit de verwachting gelezen)",
    show_title: "Titel tonen",
    show_subtitle: "Locatie tonen",
    show_details: "Intensiteit en eindtijd tonen",
    show_ribbon: "Band van 60 minuten tonen",
    show_source: "Bron en bijwerktijd tonen",
    language: "Taal",
    lang_auto: "Automatisch",
    zoom: "Detailknop",
    zoom_helper: "Knop rechtsboven die de minikaart naar de volledige kaart omschakelt en terug",
    zoom_in: "Volledige kaart tonen",
    zoom_out: "Compacte kaart tonen",
    illustration: "Geanimeerde illustratie",
    illustration_theme: "Thema van de illustratie",
    theme_auto: "Automatisch (zon of donker thema)",
    theme_day: "Dag",
    theme_night: "Nacht",
  },
  pt: {
    title: "Chuva",
    pill_dry: "Seco",
    pill_soon: "Dentro de {min} min",
    pill_raining: "A chover",
    pill_stopping: "Para dentro de {min} min",
    pill_stale: "Desatualizada",
    pill_unknown: "Sem dados",
    pill_unavailable: "Indisponível",
    head_dry: "Seco na próxima hora",
    head_soon: "Chuva às {time}",
    head_raining: "Chuva até cerca das {time}",
    head_stopping: "A chuva para às {time}",
    head_stale: "Previsão desatualizada",
    head_unknown: "Sem previsão de momento",
    head_unavailable: "Previsão indisponível",
    sub_dry: "Sem chuva prevista antes das {time}",
    sub_until: "{level} · até às {time}",
    sub_beyond: "{level} · pelo menos até às {time}",
    sub_all_hour: "{level} · durante toda a próxima hora",
    sub_dry_from: "{level} · seco a partir das {time}",
    sub_stale: "Última previsão às {time}",
    sub_unknown: "A fonte não dá dados de chuva para a próxima hora",
    sub_unavailable: "A entidade de previsão está indisponível",
    no_hourly: "Esta entidade meteorológica não dá previsão horária",
    level_1: "Fraca",
    level_2: "Moderada",
    level_3: "Forte",
    level_rain: "Chuva",
    bar_dry: "seco",
    bar_none: "sem dados",
    axis_now: "Agora",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Chuva na próxima hora",
    updated: "atualizado às {time}",
    hourly: "previsão horária",
    no_source: "Nenhuma previsão de chuva encontrada. Configure a Météo-France ou indique uma entidade meteorológica ao cartão.",
    unknown_entity: "Entidade não encontrada",
    entity: "Entidade de previsão (opcional, encontrada automaticamente)",
    entity_helper: "Sensor «próxima chuva» da Météo-France, ou uma entidade meteorológica (previsão horária)",
    name: "Título (opcional)",
    location: "Local (opcional, lido da previsão)",
    show_title: "Mostrar o título",
    show_subtitle: "Mostrar o local",
    show_details: "Mostrar a intensidade e a hora de fim",
    show_ribbon: "Mostrar a faixa de 60 minutos",
    show_source: "Mostrar a fonte e a hora de atualização",
    language: "Idioma",
    lang_auto: "Automático",
    zoom: "Botão de detalhe",
    zoom_helper: "Botão no canto superior direito que alterna entre o mini cartão e o cartão completo",
    zoom_in: "Mostrar o cartão completo",
    zoom_out: "Mostrar o cartão compacto",
    illustration: "Ilustração animada",
    illustration_theme: "Tema da ilustração",
    theme_auto: "Automático (sol ou tema escuro)",
    theme_day: "Dia",
    theme_night: "Noite",
  },
  pl: {
    title: "Deszcz",
    pill_dry: "Sucho",
    pill_soon: "Za {min} min",
    pill_raining: "Pada",
    pill_stopping: "Koniec za {min} min",
    pill_stale: "Nieaktualna",
    pill_unknown: "Brak danych",
    pill_unavailable: "Niedostępna",
    head_dry: "Sucho przez najbliższą godzinę",
    head_soon: "Deszcz o {time}",
    head_raining: "Deszcz do około {time}",
    head_stopping: "Deszcz ustanie o {time}",
    head_stale: "Prognoza nieaktualna",
    head_unknown: "Obecnie brak prognozy",
    head_unavailable: "Prognoza niedostępna",
    sub_dry: "Bez deszczu przed {time}",
    sub_until: "{level} · do {time}",
    sub_beyond: "{level} · co najmniej do {time}",
    sub_all_hour: "{level} · przez całą najbliższą godzinę",
    sub_dry_from: "{level} · sucho od {time}",
    sub_stale: "Ostatnia prognoza o {time}",
    sub_unknown: "Źródło nie podaje danych o deszczu na najbliższą godzinę",
    sub_unavailable: "Encja prognozy jest niedostępna",
    no_hourly: "Ta encja pogody nie podaje prognozy godzinowej",
    level_1: "Słaby",
    level_2: "Umiarkowany",
    level_3: "Silny",
    level_rain: "Deszcz",
    bar_dry: "sucho",
    bar_none: "brak danych",
    axis_now: "Teraz",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Deszcz w najbliższej godzinie",
    updated: "aktualizacja {time}",
    hourly: "prognoza godzinowa",
    no_source: "Nie znaleziono prognozy deszczu. Skonfiguruj Météo-France lub wskaż karcie encję pogody.",
    unknown_entity: "Nie znaleziono encji",
    entity: "Encja prognozy (opcjonalna, wykrywana automatycznie)",
    entity_helper: "Czujnik „następny deszcz” Météo-France lub encja pogody (prognoza godzinowa)",
    name: "Tytuł (opcjonalny)",
    location: "Miejsce (opcjonalne, odczytywane z prognozy)",
    show_title: "Pokaż tytuł",
    show_subtitle: "Pokaż miejsce",
    show_details: "Pokaż natężenie i godzinę końca",
    show_ribbon: "Pokaż pasek 60 minut",
    show_source: "Pokaż źródło i czas aktualizacji",
    language: "Język",
    lang_auto: "Automatyczny",
    zoom: "Przycisk szczegółów",
    zoom_helper: "Przycisk w prawym górnym rogu przełączający minikartę na pełną kartę i z powrotem",
    zoom_in: "Pokaż pełną kartę",
    zoom_out: "Pokaż kompaktową kartę",
    illustration: "Animowana ilustracja",
    illustration_theme: "Motyw ilustracji",
    theme_auto: "Automatycznie (słońce lub ciemny motyw)",
    theme_day: "Dzień",
    theme_night: "Noc",
  },
  sr: {
    title: "Киша",
    pill_dry: "Суво",
    pill_soon: "За {min} мин",
    pill_raining: "Пада киша",
    pill_stopping: "Престаје за {min} мин",
    pill_stale: "Застарела",
    pill_unknown: "Нема података",
    pill_unavailable: "Недоступно",
    head_dry: "Суво током наредног сата",
    head_soon: "Киша у {time}",
    head_raining: "Киша до око {time}",
    head_stopping: "Киша престаје у {time}",
    head_stale: "Прогноза је застарела",
    head_unknown: "Тренутно нема прогнозе",
    head_unavailable: "Прогноза недоступна",
    sub_dry: "Не очекује се киша пре {time}",
    sub_until: "{level} · до {time}",
    sub_beyond: "{level} · најмање до {time}",
    sub_all_hour: "{level} · током целог наредног сата",
    sub_dry_from: "{level} · суво од {time}",
    sub_stale: "Последња прогноза у {time}",
    sub_unknown: "Извор не даје податке о киши за наредни сат",
    sub_unavailable: "Ентитет прогнозе је недоступан",
    no_hourly: "Овај временски ентитет не даје прогнозу по сатима",
    level_1: "Слаба",
    level_2: "Умерена",
    level_3: "Јака",
    level_rain: "Киша",
    bar_dry: "суво",
    bar_none: "нема података",
    axis_now: "Сада",
    axis_30: "+30 мин",
    axis_60: "+60 мин",
    ribbon_label: "Киша у наредном сату",
    updated: "ажурирано у {time}",
    hourly: "прогноза по сатима",
    no_source: "Није пронађена прогноза кише. Подесите Météo-France или задајте картици временски ентитет.",
    unknown_entity: "Ентитет није пронађен",
    entity: "Ентитет прогнозе (опционо, проналази се аутоматски)",
    entity_helper: "Météo-France сензор „следећа киша” или временски ентитет (прогноза по сатима)",
    name: "Наслов (опционо)",
    location: "Место (опционо, чита се из прогнозе)",
    show_title: "Прикажи наслов",
    show_subtitle: "Прикажи место",
    show_details: "Прикажи јачину и време краја",
    show_ribbon: "Прикажи траку од 60 минута",
    show_source: "Прикажи извор и време ажурирања",
    language: "Језик",
    lang_auto: "Аутоматски",
    zoom: "Дугме за детаље",
    zoom_helper: "Дугме горе десно које пребацује мини картицу на пуну картицу и назад",
    zoom_in: "Прикажи пуну картицу",
    zoom_out: "Прикажи компактну картицу",
    illustration: "Анимирана илустрација",
    illustration_theme: "Тема илустрације",
    theme_auto: "Аутоматски (сунце или тамна тема)",
    theme_day: "Дан",
    theme_night: "Ноћ",
  },
  "sr-Latn": {
    title: "Kiša",
    pill_dry: "Suvo",
    pill_soon: "Za {min} min",
    pill_raining: "Pada kiša",
    pill_stopping: "Prestaje za {min} min",
    pill_stale: "Zastarela",
    pill_unknown: "Nema podataka",
    pill_unavailable: "Nedostupno",
    head_dry: "Suvo tokom narednog sata",
    head_soon: "Kiša u {time}",
    head_raining: "Kiša do oko {time}",
    head_stopping: "Kiša prestaje u {time}",
    head_stale: "Prognoza je zastarela",
    head_unknown: "Trenutno nema prognoze",
    head_unavailable: "Prognoza nedostupna",
    sub_dry: "Ne očekuje se kiša pre {time}",
    sub_until: "{level} · do {time}",
    sub_beyond: "{level} · najmanje do {time}",
    sub_all_hour: "{level} · tokom celog narednog sata",
    sub_dry_from: "{level} · suvo od {time}",
    sub_stale: "Poslednja prognoza u {time}",
    sub_unknown: "Izvor ne daje podatke o kiši za naredni sat",
    sub_unavailable: "Entitet prognoze je nedostupan",
    no_hourly: "Ovaj vremenski entitet ne daje prognozu po satima",
    level_1: "Slaba",
    level_2: "Umerena",
    level_3: "Jaka",
    level_rain: "Kiša",
    bar_dry: "suvo",
    bar_none: "nema podataka",
    axis_now: "Sada",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Kiša u narednom satu",
    updated: "ažurirano u {time}",
    hourly: "prognoza po satima",
    no_source: "Nije pronađena prognoza kiše. Podesite Météo-France ili zadajte kartici vremenski entitet.",
    unknown_entity: "Entitet nije pronađen",
    entity: "Entitet prognoze (opciono, pronalazi se automatski)",
    entity_helper: "Météo-France senzor „sledeća kiša” ili vremenski entitet (prognoza po satima)",
    name: "Naslov (opciono)",
    location: "Mesto (opciono, čita se iz prognoze)",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži mesto",
    show_details: "Prikaži jačinu i vreme kraja",
    show_ribbon: "Prikaži traku od 60 minuta",
    show_source: "Prikaži izvor i vreme ažuriranja",
    language: "Jezik",
    lang_auto: "Automatski",
    zoom: "Dugme za detalje",
    zoom_helper: "Dugme gore desno koje prebacuje mini karticu na punu karticu i nazad",
    zoom_in: "Prikaži punu karticu",
    zoom_out: "Prikaži kompaktnu karticu",
    illustration: "Animirana ilustracija",
    illustration_theme: "Tema ilustracije",
    theme_auto: "Automatski (sunce ili tamna tema)",
    theme_day: "Dan",
    theme_night: "Noć",
  },
  ro: {
    title: "Ploaie",
    pill_dry: "Uscat",
    pill_soon: "În {min} min",
    pill_raining: "Plouă",
    pill_stopping: "Se oprește în {min} min",
    pill_stale: "Învechită",
    pill_unknown: "Fără date",
    pill_unavailable: "Indisponibil",
    head_dry: "Uscat în ora următoare",
    head_soon: "Ploaie la {time}",
    head_raining: "Ploaie până pe la {time}",
    head_stopping: "Ploaia se oprește la {time}",
    head_stale: "Prognoză învechită",
    head_unknown: "Nicio prognoză momentan",
    head_unavailable: "Prognoză indisponibilă",
    sub_dry: "Nu se așteaptă ploaie înainte de {time}",
    sub_until: "{level} · până la {time}",
    sub_beyond: "{level} · cel puțin până la {time}",
    sub_all_hour: "{level} · toată ora următoare",
    sub_dry_from: "{level} · uscat de la {time}",
    sub_stale: "Ultima prognoză la {time}",
    sub_unknown: "Sursa nu oferă date despre ploaie pentru ora următoare",
    sub_unavailable: "Entitatea de prognoză este indisponibilă",
    no_hourly: "Această entitate meteo nu oferă prognoză orară",
    level_1: "Slabă",
    level_2: "Moderată",
    level_3: "Puternică",
    level_rain: "Ploaie",
    bar_dry: "uscat",
    bar_none: "fără date",
    axis_now: "Acum",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Ploaie în ora următoare",
    updated: "actualizat la {time}",
    hourly: "prognoză orară",
    no_source: "Nu s-a găsit nicio prognoză de ploaie. Configurați Météo-France sau dați cardului o entitate meteo.",
    unknown_entity: "Entitate negăsită",
    entity: "Entitate de prognoză (opțională, găsită automat)",
    entity_helper: "Senzorul „următoarea ploaie” Météo-France sau o entitate meteo (prognoză orară)",
    name: "Titlu (opțional)",
    location: "Locație (opțională, citită din prognoză)",
    show_title: "Afișează titlul",
    show_subtitle: "Afișează locația",
    show_details: "Afișează intensitatea și ora de final",
    show_ribbon: "Afișează banda de 60 de minute",
    show_source: "Afișează sursa și ora actualizării",
    language: "Limbă",
    lang_auto: "Automat",
    zoom: "Buton de detalii",
    zoom_helper: "Buton din dreapta sus care comută mini cardul în cardul complet și înapoi",
    zoom_in: "Afișează cardul complet",
    zoom_out: "Afișează cardul compact",
    illustration: "Ilustrație animată",
    illustration_theme: "Tema ilustrației",
    theme_auto: "Automat (soare sau temă întunecată)",
    theme_day: "Zi",
    theme_night: "Noapte",
  },
  da: {
    title: "Regn",
    pill_dry: "Tørt",
    pill_soon: "Om {min} min",
    pill_raining: "Det regner",
    pill_stopping: "Stopper om {min} min",
    pill_stale: "Forældet",
    pill_unknown: "Ingen data",
    pill_unavailable: "Utilgængelig",
    head_dry: "Tørt den næste time",
    head_soon: "Regn kl. {time}",
    head_raining: "Regn til omkring {time}",
    head_stopping: "Regnen stopper kl. {time}",
    head_stale: "Prognosen er forældet",
    head_unknown: "Ingen prognose lige nu",
    head_unavailable: "Prognose utilgængelig",
    sub_dry: "Ingen regn ventet før {time}",
    sub_until: "{level} · til {time}",
    sub_beyond: "{level} · mindst til {time}",
    sub_all_hour: "{level} · hele den næste time",
    sub_dry_from: "{level} · tørt fra {time}",
    sub_stale: "Seneste prognose kl. {time}",
    sub_unknown: "Kilden giver ingen regndata for den næste time",
    sub_unavailable: "Prognoseenheden er utilgængelig",
    no_hourly: "Denne vejrenhed giver ingen timeprognose",
    level_1: "Let",
    level_2: "Moderat",
    level_3: "Kraftig",
    level_rain: "Regn",
    bar_dry: "tørt",
    bar_none: "ingen data",
    axis_now: "Nu",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Regn den næste time",
    updated: "opdateret {time}",
    hourly: "timeprognose",
    no_source: "Ingen regnprognose fundet. Opsæt Météo-France, eller giv kortet en vejrenhed.",
    unknown_entity: "Enhed ikke fundet",
    entity: "Prognoseenhed (valgfri, findes automatisk)",
    entity_helper: "Météo-France-sensoren \"næste regn\" eller en vejrenhed (timeprognose)",
    name: "Titel (valgfri)",
    location: "Sted (valgfrit, læses fra prognosen)",
    show_title: "Vis titel",
    show_subtitle: "Vis sted",
    show_details: "Vis intensitet og sluttidspunkt",
    show_ribbon: "Vis 60-minutters båndet",
    show_source: "Vis kilde og opdateringstidspunkt",
    language: "Sprog",
    lang_auto: "Automatisk",
    zoom: "Detaljeknap",
    zoom_helper: "Knap øverst til højre, der skifter minikortet til det fulde kort og tilbage",
    zoom_in: "Vis det fulde kort",
    zoom_out: "Vis det kompakte kort",
    illustration: "Animeret illustration",
    illustration_theme: "Illustrationens tema",
    theme_auto: "Automatisk (sol eller mørkt tema)",
    theme_day: "Dag",
    theme_night: "Nat",
  },
  sv: {
    title: "Regn",
    pill_dry: "Uppehåll",
    pill_soon: "Om {min} min",
    pill_raining: "Det regnar",
    pill_stopping: "Slutar om {min} min",
    pill_stale: "Inaktuell",
    pill_unknown: "Inga data",
    pill_unavailable: "Otillgänglig",
    head_dry: "Uppehåll den närmaste timmen",
    head_soon: "Regn kl. {time}",
    head_raining: "Regn till ungefär {time}",
    head_stopping: "Regnet slutar kl. {time}",
    head_stale: "Prognosen är inaktuell",
    head_unknown: "Ingen prognos just nu",
    head_unavailable: "Prognos otillgänglig",
    sub_dry: "Inget regn väntas före {time}",
    sub_until: "{level} · till {time}",
    sub_beyond: "{level} · minst till {time}",
    sub_all_hour: "{level} · hela den närmaste timmen",
    sub_dry_from: "{level} · uppehåll från {time}",
    sub_stale: "Senaste prognos kl. {time}",
    sub_unknown: "Källan ger inga regndata för den närmaste timmen",
    sub_unavailable: "Prognosentiteten är otillgänglig",
    no_hourly: "Den här väderentiteten ger ingen timprognos",
    level_1: "Lätt",
    level_2: "Måttligt",
    level_3: "Kraftigt",
    level_rain: "Regn",
    bar_dry: "uppehåll",
    bar_none: "inga data",
    axis_now: "Nu",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Regn den närmaste timmen",
    updated: "uppdaterad {time}",
    hourly: "timprognos",
    no_source: "Ingen regnprognos hittades. Konfigurera Météo-France eller ge kortet en väderentitet.",
    unknown_entity: "Entiteten hittades inte",
    entity: "Prognosentitet (valfri, hittas automatiskt)",
    entity_helper: "Météo-France-sensorn \"nästa regn\" eller en väderentitet (timprognos)",
    name: "Titel (valfri)",
    location: "Plats (valfri, läses från prognosen)",
    show_title: "Visa titel",
    show_subtitle: "Visa plats",
    show_details: "Visa intensitet och sluttid",
    show_ribbon: "Visa 60-minutersbandet",
    show_source: "Visa källa och uppdateringstid",
    language: "Språk",
    lang_auto: "Automatiskt",
    zoom: "Detaljknapp",
    zoom_helper: "Knapp uppe till höger som växlar minikortet till hela kortet och tillbaka",
    zoom_in: "Visa hela kortet",
    zoom_out: "Visa det kompakta kortet",
    illustration: "Animerad illustration",
    illustration_theme: "Illustrationens tema",
    theme_auto: "Automatiskt (sol eller mörkt tema)",
    theme_day: "Dag",
    theme_night: "Natt",
  },
  bg: {
    title: "Дъжд",
    pill_dry: "Сухо",
    pill_soon: "След {min} мин",
    pill_raining: "Вали",
    pill_stopping: "Спира след {min} мин",
    pill_stale: "Остаряла",
    pill_unknown: "Няма данни",
    pill_unavailable: "Недостъпно",
    head_dry: "Сухо през следващия час",
    head_soon: "Дъжд в {time}",
    head_raining: "Дъжд до около {time}",
    head_stopping: "Дъждът спира в {time}",
    head_stale: "Прогнозата е остаряла",
    head_unknown: "В момента няма прогноза",
    head_unavailable: "Прогнозата е недостъпна",
    sub_dry: "Не се очаква дъжд преди {time}",
    sub_until: "{level} · до {time}",
    sub_beyond: "{level} · поне до {time}",
    sub_all_hour: "{level} · през целия следващ час",
    sub_dry_from: "{level} · сухо от {time}",
    sub_stale: "Последна прогноза в {time}",
    sub_unknown: "Източникът не дава данни за дъжд за следващия час",
    sub_unavailable: "Обектът на прогнозата е недостъпен",
    no_hourly: "Този метеорологичен обект не дава почасова прогноза",
    level_1: "Слаб",
    level_2: "Умерен",
    level_3: "Силен",
    level_rain: "Дъжд",
    bar_dry: "сухо",
    bar_none: "няма данни",
    axis_now: "Сега",
    axis_30: "+30 мин",
    axis_60: "+60 мин",
    ribbon_label: "Дъжд през следващия час",
    updated: "обновено в {time}",
    hourly: "почасова прогноза",
    no_source: "Не е намерена прогноза за дъжд. Настройте Météo-France или задайте на картата метеорологичен обект.",
    unknown_entity: "Обектът не е намерен",
    entity: "Обект на прогнозата (по избор, намира се автоматично)",
    entity_helper: "Сензор „следващ дъжд“ на Météo-France или метеорологичен обект (почасова прогноза)",
    name: "Заглавие (по избор)",
    location: "Място (по избор, чете се от прогнозата)",
    show_title: "Показване на заглавието",
    show_subtitle: "Показване на мястото",
    show_details: "Показване на силата и часа на края",
    show_ribbon: "Показване на лентата от 60 минути",
    show_source: "Показване на източника и часа на обновяване",
    language: "Език",
    lang_auto: "Автоматично",
    zoom: "Бутон за подробности",
    zoom_helper: "Бутон горе вдясно, който превключва мини картата към пълната карта и обратно",
    zoom_in: "Показване на пълната карта",
    zoom_out: "Показване на компактната карта",
    illustration: "Анимирана илюстрация",
    illustration_theme: "Тема на илюстрацията",
    theme_auto: "Автоматично (слънце или тъмна тема)",
    theme_day: "Ден",
    theme_night: "Нощ",
  },
  ru: {
    title: "Дождь",
    pill_dry: "Сухо",
    pill_soon: "Через {min} мин",
    pill_raining: "Идёт дождь",
    pill_stopping: "Закончится через {min} мин",
    pill_stale: "Устарел",
    pill_unknown: "Нет данных",
    pill_unavailable: "Недоступно",
    head_dry: "Без дождя в ближайший час",
    head_soon: "Дождь в {time}",
    head_raining: "Дождь примерно до {time}",
    head_stopping: "Дождь закончится в {time}",
    head_stale: "Прогноз устарел",
    head_unknown: "Сейчас прогноза нет",
    head_unavailable: "Прогноз недоступен",
    sub_dry: "Дождя не ожидается до {time}",
    sub_until: "{level} · до {time}",
    sub_beyond: "{level} · как минимум до {time}",
    sub_all_hour: "{level} · весь ближайший час",
    sub_dry_from: "{level} · сухо с {time}",
    sub_stale: "Последний прогноз в {time}",
    sub_unknown: "Источник не даёт данных о дожде на ближайший час",
    sub_unavailable: "Объект прогноза недоступен",
    no_hourly: "Этот объект погоды не даёт почасового прогноза",
    level_1: "Слабый",
    level_2: "Умеренный",
    level_3: "Сильный",
    level_rain: "Дождь",
    bar_dry: "сухо",
    bar_none: "нет данных",
    axis_now: "Сейчас",
    axis_30: "+30 мин",
    axis_60: "+60 мин",
    ribbon_label: "Дождь в ближайший час",
    updated: "обновлено в {time}",
    hourly: "почасовой прогноз",
    no_source: "Прогноз дождя не найден. Настройте Météo-France или укажите карточке объект погоды.",
    unknown_entity: "Объект не найден",
    entity: "Объект прогноза (необязательно, находится автоматически)",
    entity_helper: "Датчик «следующий дождь» Météo-France или объект погоды (почасовой прогноз)",
    name: "Заголовок (необязательно)",
    location: "Место (необязательно, берётся из прогноза)",
    show_title: "Показывать заголовок",
    show_subtitle: "Показывать место",
    show_details: "Показывать силу и время окончания",
    show_ribbon: "Показывать ленту на 60 минут",
    show_source: "Показывать источник и время обновления",
    language: "Язык",
    lang_auto: "Автоматически",
    zoom: "Кнопка подробностей",
    zoom_helper: "Кнопка в правом верхнем углу, переключающая мини-карточку на полную карточку и обратно",
    zoom_in: "Показать полную карточку",
    zoom_out: "Показать компактную карточку",
    illustration: "Анимированная иллюстрация",
    illustration_theme: "Тема иллюстрации",
    theme_auto: "Автоматически (солнце или тёмная тема)",
    theme_day: "День",
    theme_night: "Ночь",
  },
  uk: {
    title: "Дощ",
    pill_dry: "Сухо",
    pill_soon: "За {min} хв",
    pill_raining: "Іде дощ",
    pill_stopping: "Припиниться за {min} хв",
    pill_stale: "Застарів",
    pill_unknown: "Немає даних",
    pill_unavailable: "Недоступно",
    head_dry: "Без дощу найближчу годину",
    head_soon: "Дощ о {time}",
    head_raining: "Дощ приблизно до {time}",
    head_stopping: "Дощ припиниться о {time}",
    head_stale: "Прогноз застарів",
    head_unknown: "Наразі прогнозу немає",
    head_unavailable: "Прогноз недоступний",
    sub_dry: "Дощу не очікується до {time}",
    sub_until: "{level} · до {time}",
    sub_beyond: "{level} · щонайменше до {time}",
    sub_all_hour: "{level} · усю найближчу годину",
    sub_dry_from: "{level} · сухо з {time}",
    sub_stale: "Останній прогноз о {time}",
    sub_unknown: "Джерело не дає даних про дощ на найближчу годину",
    sub_unavailable: "Об'єкт прогнозу недоступний",
    no_hourly: "Цей об'єкт погоди не дає погодинного прогнозу",
    level_1: "Слабкий",
    level_2: "Помірний",
    level_3: "Сильний",
    level_rain: "Дощ",
    bar_dry: "сухо",
    bar_none: "немає даних",
    axis_now: "Зараз",
    axis_30: "+30 хв",
    axis_60: "+60 хв",
    ribbon_label: "Дощ найближчої години",
    updated: "оновлено о {time}",
    hourly: "погодинний прогноз",
    no_source: "Прогноз дощу не знайдено. Налаштуйте Météo-France або вкажіть картці об'єкт погоди.",
    unknown_entity: "Об'єкт не знайдено",
    entity: "Об'єкт прогнозу (необов'язково, знаходиться автоматично)",
    entity_helper: "Датчик «наступний дощ» Météo-France або об'єкт погоди (погодинний прогноз)",
    name: "Заголовок (необов'язково)",
    location: "Місце (необов'язково, береться з прогнозу)",
    show_title: "Показувати заголовок",
    show_subtitle: "Показувати місце",
    show_details: "Показувати силу й час закінчення",
    show_ribbon: "Показувати стрічку на 60 хвилин",
    show_source: "Показувати джерело й час оновлення",
    language: "Мова",
    lang_auto: "Автоматично",
    zoom: "Кнопка деталей",
    zoom_helper: "Кнопка вгорі праворуч, що перемикає міні-картку на повну картку й назад",
    zoom_in: "Показати повну картку",
    zoom_out: "Показати компактну картку",
    illustration: "Анімована ілюстрація",
    illustration_theme: "Тема ілюстрації",
    theme_auto: "Автоматично (сонце або темна тема)",
    theme_day: "День",
    theme_night: "Ніч",
  },
  hu: {
    title: "Eső",
    pill_dry: "Száraz",
    pill_soon: "{min} perc múlva",
    pill_raining: "Esik",
    pill_stopping: "{min} perc múlva eláll",
    pill_stale: "Elavult",
    pill_unknown: "Nincs adat",
    pill_unavailable: "Nem elérhető",
    head_dry: "Száraz a következő órában",
    head_soon: "Eső {time}-kor",
    head_raining: "Eső kb. {time}-ig",
    head_stopping: "Az eső {time}-kor eláll",
    head_stale: "Az előrejelzés elavult",
    head_unknown: "Jelenleg nincs előrejelzés",
    head_unavailable: "Előrejelzés nem elérhető",
    sub_dry: "{time} előtt nem várható eső",
    sub_until: "{level} · {time}-ig",
    sub_beyond: "{level} · legalább {time}-ig",
    sub_all_hour: "{level} · a következő órában végig",
    sub_dry_from: "{level} · {time}-tól száraz",
    sub_stale: "Utolsó előrejelzés: {time}",
    sub_unknown: "A forrás nem ad esőadatot a következő órára",
    sub_unavailable: "Az előrejelzési entitás nem elérhető",
    no_hourly: "Ez az időjárási entitás nem ad óránkénti előrejelzést",
    level_1: "Gyenge",
    level_2: "Mérsékelt",
    level_3: "Erős",
    level_rain: "Eső",
    bar_dry: "száraz",
    bar_none: "nincs adat",
    axis_now: "Most",
    axis_30: "+30 perc",
    axis_60: "+60 perc",
    ribbon_label: "Eső a következő órában",
    updated: "frissítve: {time}",
    hourly: "óránkénti előrejelzés",
    no_source: "Nem található eső-előrejelzés. Állítsa be a Météo-France-t, vagy adjon meg egy időjárási entitást a kártyának.",
    unknown_entity: "Az entitás nem található",
    entity: "Előrejelzési entitás (opcionális, automatikusan megtalálva)",
    entity_helper: "A Météo-France „következő eső” érzékelője vagy egy időjárási entitás (óránkénti előrejelzés)",
    name: "Cím (opcionális)",
    location: "Hely (opcionális, az előrejelzésből olvasva)",
    show_title: "Cím megjelenítése",
    show_subtitle: "Hely megjelenítése",
    show_details: "Erősség és befejezési idő megjelenítése",
    show_ribbon: "A 60 perces sáv megjelenítése",
    show_source: "Forrás és frissítési idő megjelenítése",
    language: "Nyelv",
    lang_auto: "Automatikus",
    zoom: "Részletek gomb",
    zoom_helper: "Jobb felső gomb, amely a mini kártyát a teljes kártyára váltja és vissza",
    zoom_in: "Teljes kártya megjelenítése",
    zoom_out: "Kompakt kártya megjelenítése",
    illustration: "Animált illusztráció",
    illustration_theme: "Az illusztráció témája",
    theme_auto: "Automatikus (nap vagy sötét téma)",
    theme_day: "Nappal",
    theme_night: "Éjszaka",
  },
  sk: {
    title: "Dážď",
    pill_dry: "Sucho",
    pill_soon: "O {min} min",
    pill_raining: "Prší",
    pill_stopping: "Prestane o {min} min",
    pill_stale: "Zastaraná",
    pill_unknown: "Žiadne údaje",
    pill_unavailable: "Nedostupné",
    head_dry: "Sucho počas najbližšej hodiny",
    head_soon: "Dážď o {time}",
    head_raining: "Dážď približne do {time}",
    head_stopping: "Dážď prestane o {time}",
    head_stale: "Predpoveď je zastaraná",
    head_unknown: "Momentálne bez predpovede",
    head_unavailable: "Predpoveď nedostupná",
    sub_dry: "Pred {time} sa dážď neočakáva",
    sub_until: "{level} · do {time}",
    sub_beyond: "{level} · aspoň do {time}",
    sub_all_hour: "{level} · celú najbližšiu hodinu",
    sub_dry_from: "{level} · sucho od {time}",
    sub_stale: "Posledná predpoveď o {time}",
    sub_unknown: "Zdroj neposkytuje údaje o daždi na najbližšiu hodinu",
    sub_unavailable: "Entita predpovede je nedostupná",
    no_hourly: "Táto entita počasia neposkytuje hodinovú predpoveď",
    level_1: "Slabý",
    level_2: "Mierny",
    level_3: "Silný",
    level_rain: "Dážď",
    bar_dry: "sucho",
    bar_none: "žiadne údaje",
    axis_now: "Teraz",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Dážď počas najbližšej hodiny",
    updated: "aktualizované o {time}",
    hourly: "hodinová predpoveď",
    no_source: "Nenašla sa žiadna predpoveď dažďa. Nastavte Météo-France alebo zadajte karte entitu počasia.",
    unknown_entity: "Entita sa nenašla",
    entity: "Entita predpovede (voliteľné, nájde sa automaticky)",
    entity_helper: "Senzor „ďalší dážď“ Météo-France alebo entita počasia (hodinová predpoveď)",
    name: "Názov (voliteľný)",
    location: "Miesto (voliteľné, číta sa z predpovede)",
    show_title: "Zobraziť názov",
    show_subtitle: "Zobraziť miesto",
    show_details: "Zobraziť intenzitu a čas konca",
    show_ribbon: "Zobraziť 60-minútový pás",
    show_source: "Zobraziť zdroj a čas aktualizácie",
    language: "Jazyk",
    lang_auto: "Automaticky",
    zoom: "Tlačidlo podrobností",
    zoom_helper: "Tlačidlo vpravo hore, ktoré prepína minikartu na celú kartu a späť",
    zoom_in: "Zobraziť celú kartu",
    zoom_out: "Zobraziť kompaktnú kartu",
    illustration: "Animovaná ilustrácia",
    illustration_theme: "Téma ilustrácie",
    theme_auto: "Automaticky (slnko alebo tmavá téma)",
    theme_day: "Deň",
    theme_night: "Noc",
  },
  cs: {
    title: "Déšť",
    pill_dry: "Sucho",
    pill_soon: "Za {min} min",
    pill_raining: "Prší",
    pill_stopping: "Přestane za {min} min",
    pill_stale: "Zastaralá",
    pill_unknown: "Žádná data",
    pill_unavailable: "Nedostupné",
    head_dry: "Sucho během příští hodiny",
    head_soon: "Déšť v {time}",
    head_raining: "Déšť přibližně do {time}",
    head_stopping: "Déšť přestane v {time}",
    head_stale: "Předpověď je zastaralá",
    head_unknown: "Momentálně bez předpovědi",
    head_unavailable: "Předpověď nedostupná",
    sub_dry: "Před {time} se déšť neočekává",
    sub_until: "{level} · do {time}",
    sub_beyond: "{level} · alespoň do {time}",
    sub_all_hour: "{level} · celou příští hodinu",
    sub_dry_from: "{level} · sucho od {time}",
    sub_stale: "Poslední předpověď v {time}",
    sub_unknown: "Zdroj neposkytuje data o dešti na příští hodinu",
    sub_unavailable: "Entita předpovědi je nedostupná",
    no_hourly: "Tato entita počasí neposkytuje hodinovou předpověď",
    level_1: "Slabý",
    level_2: "Mírný",
    level_3: "Silný",
    level_rain: "Déšť",
    bar_dry: "sucho",
    bar_none: "žádná data",
    axis_now: "Nyní",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Déšť během příští hodiny",
    updated: "aktualizováno v {time}",
    hourly: "hodinová předpověď",
    no_source: "Nebyla nalezena žádná předpověď deště. Nastavte Météo-France nebo zadejte kartě entitu počasí.",
    unknown_entity: "Entita nenalezena",
    entity: "Entita předpovědi (volitelné, najde se automaticky)",
    entity_helper: "Senzor „další déšť“ Météo-France nebo entita počasí (hodinová předpověď)",
    name: "Název (volitelný)",
    location: "Místo (volitelné, čte se z předpovědi)",
    show_title: "Zobrazit název",
    show_subtitle: "Zobrazit místo",
    show_details: "Zobrazit intenzitu a čas konce",
    show_ribbon: "Zobrazit 60minutový pás",
    show_source: "Zobrazit zdroj a čas aktualizace",
    language: "Jazyk",
    lang_auto: "Automaticky",
    zoom: "Tlačítko podrobností",
    zoom_helper: "Tlačítko vpravo nahoře, které přepíná minikartu na celou kartu a zpět",
    zoom_in: "Zobrazit celou kartu",
    zoom_out: "Zobrazit kompaktní kartu",
    illustration: "Animovaná ilustrace",
    illustration_theme: "Motiv ilustrace",
    theme_auto: "Automaticky (slunce nebo tmavý motiv)",
    theme_day: "Den",
    theme_night: "Noc",
  },
  sl: {
    title: "Dež",
    pill_dry: "Suho",
    pill_soon: "Čez {min} min",
    pill_raining: "Dežuje",
    pill_stopping: "Preneha čez {min} min",
    pill_stale: "Zastarela",
    pill_unknown: "Ni podatkov",
    pill_unavailable: "Ni na voljo",
    head_dry: "Suho v naslednji uri",
    head_soon: "Dež ob {time}",
    head_raining: "Dež do približno {time}",
    head_stopping: "Dež preneha ob {time}",
    head_stale: "Napoved je zastarela",
    head_unknown: "Trenutno ni napovedi",
    head_unavailable: "Napoved ni na voljo",
    sub_dry: "Pred {time} ni pričakovati dežja",
    sub_until: "{level} · do {time}",
    sub_beyond: "{level} · vsaj do {time}",
    sub_all_hour: "{level} · vso naslednjo uro",
    sub_dry_from: "{level} · suho od {time}",
    sub_stale: "Zadnja napoved ob {time}",
    sub_unknown: "Vir ne daje podatkov o dežju za naslednjo uro",
    sub_unavailable: "Entiteta napovedi ni na voljo",
    no_hourly: "Ta vremenska entiteta ne daje urne napovedi",
    level_1: "Šibek",
    level_2: "Zmeren",
    level_3: "Močan",
    level_rain: "Dež",
    bar_dry: "suho",
    bar_none: "ni podatkov",
    axis_now: "Zdaj",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Dež v naslednji uri",
    updated: "posodobljeno ob {time}",
    hourly: "urna napoved",
    no_source: "Napovedi dežja ni bilo mogoče najti. Nastavite Météo-France ali kartici določite vremensko entiteto.",
    unknown_entity: "Entitete ni mogoče najti",
    entity: "Entiteta napovedi (neobvezno, najdena samodejno)",
    entity_helper: "Senzor »naslednji dež« Météo-France ali vremenska entiteta (urna napoved)",
    name: "Naslov (neobvezno)",
    location: "Kraj (neobvezno, prebran iz napovedi)",
    show_title: "Prikaži naslov",
    show_subtitle: "Prikaži kraj",
    show_details: "Prikaži jakost in čas konca",
    show_ribbon: "Prikaži 60-minutni trak",
    show_source: "Prikaži vir in čas posodobitve",
    language: "Jezik",
    lang_auto: "Samodejno",
    zoom: "Gumb za podrobnosti",
    zoom_helper: "Gumb zgoraj desno, ki preklopi mini kartico v polno kartico in nazaj",
    zoom_in: "Prikaži polno kartico",
    zoom_out: "Prikaži kompaktno kartico",
    illustration: "Animirana ilustracija",
    illustration_theme: "Tema ilustracije",
    theme_auto: "Samodejno (sonce ali temna tema)",
    theme_day: "Dan",
    theme_night: "Noč",
  },
  lv: {
    title: "Lietus",
    pill_dry: "Sauss",
    pill_soon: "Pēc {min} min",
    pill_raining: "Līst",
    pill_stopping: "Beigsies pēc {min} min",
    pill_stale: "Novecojusi",
    pill_unknown: "Nav datu",
    pill_unavailable: "Nav pieejams",
    head_dry: "Sauss nākamajā stundā",
    head_soon: "Lietus plkst. {time}",
    head_raining: "Lietus līdz aptuveni {time}",
    head_stopping: "Lietus beigsies plkst. {time}",
    head_stale: "Prognoze ir novecojusi",
    head_unknown: "Pašlaik nav prognozes",
    head_unavailable: "Prognoze nav pieejama",
    sub_dry: "Lietus nav gaidāms līdz {time}",
    sub_until: "{level} · līdz {time}",
    sub_beyond: "{level} · vismaz līdz {time}",
    sub_all_hour: "{level} · visu nākamo stundu",
    sub_dry_from: "{level} · sauss no {time}",
    sub_stale: "Pēdējā prognoze plkst. {time}",
    sub_unknown: "Avots nesniedz lietus datus nākamajai stundai",
    sub_unavailable: "Prognozes vienība nav pieejama",
    no_hourly: "Šī laikapstākļu vienība nesniedz stundu prognozi",
    level_1: "Vājš",
    level_2: "Mērens",
    level_3: "Stiprs",
    level_rain: "Lietus",
    bar_dry: "sauss",
    bar_none: "nav datu",
    axis_now: "Tagad",
    axis_30: "+30 min",
    axis_60: "+60 min",
    ribbon_label: "Lietus nākamajā stundā",
    updated: "atjaunināts {time}",
    hourly: "stundu prognoze",
    no_source: "Lietus prognoze nav atrasta. Iestatiet Météo-France vai norādiet kartītei laikapstākļu vienību.",
    unknown_entity: "Vienība nav atrasta",
    entity: "Prognozes vienība (neobligāti, tiek atrasta automātiski)",
    entity_helper: "Météo-France sensors “nākamais lietus” vai laikapstākļu vienība (stundu prognoze)",
    name: "Virsraksts (neobligāti)",
    location: "Vieta (neobligāti, nolasīta no prognozes)",
    show_title: "Rādīt virsrakstu",
    show_subtitle: "Rādīt vietu",
    show_details: "Rādīt intensitāti un beigu laiku",
    show_ribbon: "Rādīt 60 minūšu joslu",
    show_source: "Rādīt avotu un atjaunināšanas laiku",
    language: "Valoda",
    lang_auto: "Automātiski",
    zoom: "Detaļu poga",
    zoom_helper: "Poga augšējā labajā stūrī, kas pārslēdz mini kartīti uz pilno kartīti un atpakaļ",
    zoom_in: "Rādīt pilno kartīti",
    zoom_out: "Rādīt kompakto kartīti",
    illustration: "Animēta ilustrācija",
    illustration_theme: "Ilustrācijas motīvs",
    theme_auto: "Automātiski (saule vai tumšā tēma)",
    theme_day: "Diena",
    theme_night: "Nakts",
  },
  el: {
    title: "Βροχή",
    pill_dry: "Χωρίς βροχή",
    pill_soon: "Σε {min} λεπ.",
    pill_raining: "Βρέχει",
    pill_stopping: "Σταματά σε {min} λεπ.",
    pill_stale: "Παλιά",
    pill_unknown: "Χωρίς δεδομένα",
    pill_unavailable: "Μη διαθέσιμο",
    head_dry: "Χωρίς βροχή την επόμενη ώρα",
    head_soon: "Βροχή στις {time}",
    head_raining: "Βροχή έως περίπου τις {time}",
    head_stopping: "Η βροχή σταματά στις {time}",
    head_stale: "Η πρόγνωση είναι παλιά",
    head_unknown: "Καμία πρόγνωση αυτή τη στιγμή",
    head_unavailable: "Η πρόγνωση δεν είναι διαθέσιμη",
    sub_dry: "Δεν αναμένεται βροχή πριν τις {time}",
    sub_until: "{level} · έως τις {time}",
    sub_beyond: "{level} · τουλάχιστον έως τις {time}",
    sub_all_hour: "{level} · όλη την επόμενη ώρα",
    sub_dry_from: "{level} · χωρίς βροχή από τις {time}",
    sub_stale: "Τελευταία πρόγνωση στις {time}",
    sub_unknown: "Η πηγή δεν δίνει δεδομένα βροχής για την επόμενη ώρα",
    sub_unavailable: "Η οντότητα πρόγνωσης δεν είναι διαθέσιμη",
    no_hourly: "Αυτή η οντότητα καιρού δεν δίνει ωριαία πρόγνωση",
    level_1: "Ασθενής",
    level_2: "Μέτρια",
    level_3: "Ισχυρή",
    level_rain: "Βροχή",
    bar_dry: "χωρίς βροχή",
    bar_none: "χωρίς δεδομένα",
    axis_now: "Τώρα",
    axis_30: "+30 λεπ.",
    axis_60: "+60 λεπ.",
    ribbon_label: "Βροχή την επόμενη ώρα",
    updated: "ενημέρωση {time}",
    hourly: "ωριαία πρόγνωση",
    no_source: "Δεν βρέθηκε πρόγνωση βροχής. Ρυθμίστε το Météo-France ή δώστε στην κάρτα μια οντότητα καιρού.",
    unknown_entity: "Η οντότητα δεν βρέθηκε",
    entity: "Οντότητα πρόγνωσης (προαιρετικό, βρίσκεται αυτόματα)",
    entity_helper: "Αισθητήρας «επόμενη βροχή» του Météo-France ή οντότητα καιρού (ωριαία πρόγνωση)",
    name: "Τίτλος (προαιρετικό)",
    location: "Τοποθεσία (προαιρετικό, από την πρόγνωση)",
    show_title: "Εμφάνιση τίτλου",
    show_subtitle: "Εμφάνιση τοποθεσίας",
    show_details: "Εμφάνιση έντασης και ώρας λήξης",
    show_ribbon: "Εμφάνιση της ταινίας 60 λεπτών",
    show_source: "Εμφάνιση πηγής και ώρας ενημέρωσης",
    language: "Γλώσσα",
    lang_auto: "Αυτόματα",
    zoom: "Κουμπί λεπτομερειών",
    zoom_helper: "Κουμπί πάνω δεξιά που αλλάζει τη μίνι κάρτα στην πλήρη κάρτα και πίσω",
    zoom_in: "Εμφάνιση της πλήρους κάρτας",
    zoom_out: "Εμφάνιση της συμπαγούς κάρτας",
    illustration: "Κινούμενη εικονογράφηση",
    illustration_theme: "Θέμα εικονογράφησης",
    theme_auto: "Αυτόματο (ήλιος ή σκοτεινό θέμα)",
    theme_day: "Ημέρα",
    theme_night: "Νύχτα",
  },
};

// ---------------------------------------------------------------------------
// Icons (24 × 24)
// ---------------------------------------------------------------------------

const ICONS = {
  // Cloud and three drops of mdiWeatherPouring, kept apart so that the drops can fall.
  cloud:
    "M17,10V9A5,5 0 0,0 12,4C9.5,4 7.45,5.82 7.06,8.19C6.73,8.07 6.37,8 6,8A3,3 0 0,0 3,11C3,12.11 3.6,13.08 4.5,13.6C5,13.87 5.14,14.5 4.87,14.96C4.59,15.43 4,15.6 3.5,15.32C2,14.47 1,12.85 1,11A5,5 0 0,1 6,6C7,3.65 9.3,2 12,2C15.43,2 18.24,4.66 18.5,8.03L19,8A4,4 0 0,1 23,12C23,13.5 22.2,14.77 21,15.46C20.5,15.73 19.91,15.57 19.63,15.09C19.36,14.61 19.5,14 20,13.72C20.6,13.39 21,12.74 21,12A2,2 0 0,0 19,10H17Z",
  drops: [
    "M9,12C9.53,12.14 9.85,12.69 9.71,13.22L8.41,18.05C8.27,18.59 7.72,18.9 7.19,18.76C6.65,18.62 6.34,18.07 6.5,17.54L7.78,12.71C7.92,12.17 8.47,11.86 9,12Z",
    "M13,12C13.53,12.14 13.85,12.69 13.71,13.22L11.64,20.95C11.5,21.5 10.95,21.8 10.41,21.66C9.88,21.5 9.56,20.97 9.7,20.43L11.78,12.71C11.92,12.17 12.47,11.86 13,12Z",
    "M17,12C17.53,12.14 17.85,12.69 17.71,13.22L16.41,18.05C16.27,18.59 15.72,18.9 15.19,18.76C14.65,18.62 14.34,18.07 14.5,17.54L15.78,12.71C15.92,12.17 16.47,11.86 17,12Z",
  ],
  expand: "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  collapse: "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
};

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MIN = 60e3;
const STEP = 5; // minutes per bar
const BARS = 12; // 12 × 5 min = the next hour
const WINDOW = STEP * BARS * MIN;
// Météo-France refreshes its rain forecast every 5 minutes: a reference time older than this is out of date.
const MF_STALE_MS = 20 * MIN;
// A weather forecast fetched longer ago than this is fetched again (also whenever the weather entity changes).
const WX_REFRESH_MS = 15 * MIN;
// …and one older than this, which could not be refreshed, is out of date.
const WX_STALE_MS = 3 * 60 * MIN;
// Rain rate (mm/h) thresholds of the intensities: light, moderate, heavy (the usual 2.5 / 7.6 mm/h scale).
const RATE_LEVELS = [0.1, 2.5, 7.6];
const RAINY_CONDITIONS = { rainy: 1, "snowy-rainy": 1, "lightning-rainy": 2, pouring: 3, hail: 2 };
// Integration names shown under the ribbon (the platform of the forecast entity).
const SOURCE_NAMES = {
  meteo_france: "Météo-France",
  met: "Met.no",
  openweathermap: "OpenWeatherMap",
  accuweather: "AccuWeather",
  pirateweather: "Pirate Weather",
  tomorrowio: "Tomorrow.io",
  buienradar: "Buienradar",
  dwd_weather: "DWD",
  smhi: "SMHI",
  ipma: "IPMA",
  aemet: "AEMET",
  knmi: "KNMI",
  nws: "NWS",
  environment_canada: "Environment Canada",
  meteoswiss: "MeteoSwiss",
  open_meteo: "Open-Meteo",
  google_weather: "Google Weather",
  weatherflow_cloud: "WeatherFlow",
};

// State of the next hour → color class of the pill and the badge.
const STATE_CLASS = { dry: "ok", soon: "soon", raining: "rain", stopping: "stop", stale: "idle", unknown: "idle", unavailable: "crit" };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region) when its base
// matches the card language, else that language; a bare "pt" (European Portuguese for Home Assistant) is "pt-PT".
const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

// The whole width of an element's text in its own font, an ellipsised one included.
const textWidth = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return range.getBoundingClientRect().width;
};

const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

const TIME_FMT = {};
// "14:35" in the language, in Home Assistant's time zone when the profile asks for the server's, 12 or 24 h as set.
const fmtTime = (ms, hass, locale) => {
  const tz = hass?.locale?.time_zone === "server" ? hass.config?.time_zone : undefined;
  const tf = hass?.locale?.time_format;
  const hour12 = tf === "12" ? true : tf === "24" ? false : undefined;
  const key = `${locale}|${tz}|${hour12}`;
  TIME_FMT[key] ??= new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", ...(tz ? { timeZone: tz } : {}), ...(hour12 === undefined ? {} : { hour12 }) });
  return TIME_FMT[key].format(ms);
};

// ---------------------------------------------------------------------------
// Météo-France: 1_hour_forecast → twelve 5-minute bars
// ---------------------------------------------------------------------------

// A rain label of Météo-France → intensity 0 (dry) to 3 (heavy), null for "no data". Météo-France writes French
// ("Temps sec", "Pluie faible", "Pluie modérée", "Pluie forte", "Données indisponibles"), its API can answer in
// English ("Dry weather", "Light rain"…), and the rain codes 1 to 4 (0: no data) may come as numbers.
const LEVEL_WORDS = [
  [null, /indisponible|unavailable|no data|non disponible|inconnu|unknown|n\/a/],
  [0, /\bsec\b|\bdry\b|no rain|pas de pluie|pas de pr[ée]cipitation|aucune|\bnone\b|trocken|\bseco\b|asciutto/],
  [3, /\bfort|heavy|intense|strong|stark|fuerte|violent/],
  [2, /mod[ée]r|moderate|medium|moyen|m[äa]ßig|moderad|moderat/],
  [1, /faible|light|weak|slight|\bfine\b|bruine|drizzle|leicht|d[ée]bil|liger|debole/],
  [1, /pluie|rain|pr[ée]cipitation|averse|shower|regen|lluvia|pioggia/],
];
const rainLevel = (raw) => {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === "number" || /^\s*\d+\s*$/.test(String(raw))) {
    const n = Number(raw);
    return n >= 1 && n <= 4 ? n - 1 : null;
  }
  const s = String(raw).toLowerCase().trim();
  if (!s) return null;
  for (const [level, re] of LEVEL_WORDS) if (re.test(s)) return level;
  return null;
};

// Météo-France gives 5-minute steps for the first half hour ("0 min" … "25 min") then 10-minute steps, keyed by
// their middle ("35 min", "45 min", "55 min"): each slot is mapped onto the 5-minute bars it covers. A 10-minute slot
// keyed by its start ("30 min", "40 min", "50 min") is read as well. Returns 12 levels (0–3), null where there is no
// data.
const mfBars = (forecast) => {
  const spans = Object.entries(forecast && typeof forecast === "object" ? forecast : {})
    .map(([k, v]) => ({ o: Number.parseInt(String(k).replace(/^\D*/, ""), 10), v: rainLevel(v) }))
    .filter((s) => Number.isFinite(s.o))
    .map(({ o, v }) => {
      if (o < 30) return { from: o, to: o + STEP, v };
      const from = o % 10 === 5 ? o - 5 : o;
      return { from, to: from + 10, v };
    });
  return Array.from({ length: BARS }, (_, b) => spans.find((sp) => b * STEP >= sp.from && b * STEP < sp.to)?.v ?? null);
};

// ---------------------------------------------------------------------------
// Weather entities: hourly (or finer) precipitation → twelve 5-minute bars
// ---------------------------------------------------------------------------

const rateLevel = (rate) => (rate < RATE_LEVELS[0] ? 0 : rate < RATE_LEVELS[1] ? 1 : rate < RATE_LEVELS[2] ? 2 : 3);

// Forecast entries ({ datetime, precipitation, condition }) → 12 levels from `start`. Each bar takes the entry whose
// period covers its middle (an hour for an hourly forecast): its precipitation turned into a rate in mm/h, else, when
// it gives none, its condition (rainy, pouring…). No interpolation: an hourly forecast does not tell when in the hour
// the rain falls, so a rainy hour reads as rain from its start, which is what the card says ("hourly forecast").
// null where no entry covers the bar.
const weatherBars = (entries, start) => {
  const list = (Array.isArray(entries) ? entries : [])
    .map((e) => ({ t: Date.parse(e?.datetime), p: e?.precipitation === null || e?.precipitation === undefined ? null : Number(e.precipitation), c: e?.condition }))
    .map((e) => ({ ...e, p: Number.isFinite(e.p) ? e.p : null }))
    .filter((e) => Number.isFinite(e.t))
    .sort((a, b) => a.t - b.t);
  if (!list.length) return { bars: Array(BARS).fill(null), coarse: false };
  const gaps = list.slice(1).map((e, i) => e.t - list[i].t);
  const period = gaps.length ? Math.min(...gaps) : 60 * MIN;
  const bars = Array.from({ length: BARS }, (_, b) => {
    const at = start + (b * STEP + STEP / 2) * MIN;
    // The current period may be missing (a forecast starting at the next hour): the first one stands for it.
    const cover = list.find((e) => at >= e.t && at < e.t + period) ?? (at < list[0].t && list[0].t - at < period ? list[0] : null);
    if (!cover) return null;
    return cover.p === null ? (RAINY_CONDITIONS[cover.c] ?? 0) : rateLevel((cover.p * 60 * MIN) / period);
  });
  return { bars, coarse: period >= 30 * MIN };
};

// ---------------------------------------------------------------------------
// The next hour, read from the bars
// ---------------------------------------------------------------------------

// { state, level, start, end, windowEnd, pos, index }: state among dry, soon, raining, stopping, stale, unknown and
// unavailable; `pos` the place of now along the ribbon (0 to 12 bars), `index` the bar now falls in.
const analyse = (fc, now) => {
  const windowEnd = fc.start + WINDOW;
  const pos = Math.max(0, Math.min(BARS, (now - fc.start) / (STEP * MIN)));
  const index = Math.min(BARS - 1, Math.floor(pos));
  const base = { pos, index, windowEnd };
  if (fc.unavailable) return { ...base, state: "unavailable" };
  if (fc.stale || now >= windowEnd) return { ...base, state: "stale" };
  const bars = fc.bars;
  if (bars.slice(index).every((v) => v === null)) return { ...base, state: "unknown" };
  const at = (i) => fc.start + i * STEP * MIN;
  // A shower from bar `from`: its strongest level and its end (null when it lasts past the hour or into bars
  // without data, where the end is not known).
  const episode = (from) => {
    let j = from;
    while (j < BARS && bars[j] > 0) j++;
    return { level: Math.max(...bars.slice(from, j)), end: j < BARS && bars[j] === 0 ? at(j) : null };
  };
  if (bars[index] > 0) {
    const ep = episode(index);
    return { ...base, state: ep.end ? "stopping" : "raining", level: ep.level, end: ep.end ?? windowEnd };
  }
  const next = bars.findIndex((v, i) => i > index && v > 0);
  if (next < 0) return { ...base, state: "dry" };
  const ep = episode(next);
  return { ...base, state: "soon", level: ep.level, start: at(next), end: ep.end };
};

// ---------------------------------------------------------------------------
// Sources
// ---------------------------------------------------------------------------

// A Météo-France next rain sensor: its 60-minute forecast attribute, or its registry entry (an unavailable sensor has
// no attributes left).
const isMf = (s, hass) => {
  if (!s?.entity_id.startsWith("sensor.")) return false;
  if (s.attributes?.["1_hour_forecast"] !== undefined) return true;
  const e = hass?.entities?.[s.entity_id];
  return e?.platform === "meteo_france" && e.translation_key === "next_rain";
};
const HOURLY = 2; // WeatherEntityFeature.FORECAST_HOURLY

// The forecast entity: the `entity` option, else the first Météo-France next rain sensor, else the first weather
// entity with an hourly forecast (or a forecast attribute), in the order of the entity ids.
const findSource = (hass, config) => {
  if (config.entity) return hass.states[config.entity] ? { id: config.entity } : { error: "unknown_entity" };
  const all = Object.values(hass.states || {}).sort((a, b) => a.entity_id.localeCompare(b.entity_id));
  const mf = all.find((s) => isMf(s, hass) && !hass.entities?.[s.entity_id]?.hidden);
  if (mf) return { id: mf.entity_id };
  const wx = all.find((s) => s.entity_id.startsWith("weather.") && (s.attributes?.supported_features & HOURLY || Array.isArray(s.attributes?.forecast)));
  return wx ? { id: wx.entity_id } : { error: "no_source" };
};

// The city of a Météo-France device ("Météo-France forecast for city Lyon - Rhône (69) - FR" → "Lyon").
const cityOf = (name) => String(name ?? "").match(/(?:for city|pour la ville)\s+(.+?)(?:\s+-\s+|$)/i)?.[1] ?? "";

// The place the forecast is for: the `location` option, the city of the Météo-France device, the name of a weather
// entity without its device's name in front ("Forecast Home" → kept as is), else Home Assistant's location name.
const locationOf = (hass, config, id) => {
  if (config.location) return config.location;
  const ent = hass.entities?.[id];
  const dev = ent?.device_id ? hass.devices?.[ent.device_id] : undefined;
  const city = cityOf(dev?.name);
  if (city) return city;
  const fn = String(hass.states[id]?.attributes?.friendly_name ?? "");
  if (id.startsWith("weather.") && fn) {
    const devName = dev?.name_by_user || dev?.name || "";
    const rest = devName && fn.startsWith(devName) ? fn.slice(devName.length).trim() : fn;
    return rest || fn;
  }
  return hass.config?.location_name || "";
};

const sourceName = (hass, id) => {
  const p = hass.entities?.[id]?.platform;
  if (p) return SOURCE_NAMES[p] || p.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());
  return isMf(hass.states[id], hass) ? SOURCE_NAMES.meteo_france : hass.states[id]?.attributes?.friendly_name || id;
};

// ---------------------------------------------------------------------------
// DOM patching
// ---------------------------------------------------------------------------

// Patches `root` to the markup `html` in place: elements of the same tag are kept (their attributes and text
// updated), so that animations and transitions run on instead of restarting, and the focus stays where it is.
// Where there is no DOM to parse with (unit tests), the markup is set as is.
const morph = (root, html) => {
  const tpl = typeof document !== "undefined" && document.createElement?.("template");
  if (!tpl || !("content" in tpl) || !root.childNodes) {
    root.innerHTML = html;
    return;
  }
  tpl.innerHTML = html;
  patchChildren(root, tpl.content);
};
const patchChildren = (to, from) => {
  const old = [...to.childNodes];
  const fresh = [...from.childNodes];
  fresh.forEach((n, i) => {
    const o = old[i];
    if (!o) to.appendChild(n);
    else if (o.nodeType !== n.nodeType || o.nodeName !== n.nodeName) to.replaceChild(n, o);
    else if (o.nodeType !== 1) {
      if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue;
    } else {
      for (const a of [...o.attributes]) if (!n.hasAttribute(a.name)) o.removeAttribute(a.name);
      for (const a of [...n.attributes]) if (o.getAttribute(a.name) !== a.value) o.setAttribute(a.name, a.value);
      patchChildren(o, n);
    }
  });
  for (let i = old.length - 1; i >= fresh.length; i--) to.removeChild(old[i]);
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const BASE_STYLE = `
  :host { --rc-accent: #1e88e5; --rc-ok: var(--success-color, #43a047); --rc-soon: var(--warning-color, #ffa600);
          --rc-rain: #1e88e5; --rc-stop: #00acc1;
          /* Shades of the bars, the same in light and dark themes: pale for light rain, deep for heavy rain. */
          --rc-light: #90caf9; --rc-moderate: #42a5f5; --rc-heavy: #1976d2; --rc-crit: var(--error-color, #db4437); --rc-idle: var(--disabled-text-color, #9e9e9e); }
  ha-card { overflow: hidden; container: rc-card / inline-size; }
  /* A size container has no width of its own: this zero-height grid gives the card a natural width without a minimum. */
  :host { display: block; min-width: 0; --rc-natural-width: 360px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--rc-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--rc-accent)); outline-offset: 2px; border-radius: 4px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .ok { --c: var(--rc-ok); } .soon { --c: var(--rc-soon); } .rain { --c: var(--rc-rain); } .stop { --c: var(--rc-stop); }
  .idle { --c: var(--rc-idle); } .crit { --c: var(--rc-crit); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c, var(--rc-accent)); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c, var(--rc-accent)) 15%, transparent); color: color-mix(in srgb, var(--c, var(--rc-accent)) 50%, var(--primary-text-color));
          flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box; transition: background-color .3s ease, color .3s ease; }
  .chip-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  .titles { flex: 1 1 0; min-width: 5ch; }
  /* The status pill right after the title, centred on it, while the title stays whole and the pill's whole label fits
     beside it; otherwise (measured by the card, see _fitPill) the pill on its own line under a one-line subtitle, and
     if even that would not fit in the header, its dot alone (the label stays in title and aria-label). */
  .titles { display: flex; flex-direction: column; }
  .trow { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .trow .name { flex: 0 1 auto; min-width: 0; }
  .trow .chip { flex: none; max-width: none; }
  .titles.below { display: grid; grid-template-columns: minmax(0, 1fr); justify-items: start; }
  .titles.below .trow { display: contents; }
  .titles.below .name { max-width: 100%; }
  .titles.below > .sub { justify-self: stretch; }
  .titles.below .chip { grid-row: 3; margin-top: 2px; max-width: 100%; }
  .titles.pill-dot .chip { padding: 4px; }
  .titles.pill-dot .chip-text { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .type-icon { position: relative; display: flex; flex: none; width: 40px; height: 40px; border-radius: 50%; align-items: center; justify-content: center;
               --rc-tint: var(--c, var(--rc-accent)); background: color-mix(in srgb, var(--rc-tint) 16%, transparent); transition: background-color .3s ease; }
  .type-icon svg { width: 24px; height: 24px; overflow: visible; fill: color-mix(in srgb, var(--rc-tint) 60%, var(--primary-text-color)); transition: fill .3s ease; }
  .type-icon .drop { opacity: .9; }
  .type-icon.falling .drop { animation: rc-fall 1s linear infinite; }
  .type-icon.falling .drop.d2 { animation-delay: -.33s; }
  .type-icon.falling .drop.d3 { animation-delay: -.66s; }
  @keyframes rc-fall { 0% { transform: translateY(-3px); opacity: 0; } 25% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateY(4px); opacity: 0; } }
  .warning { padding: 16px; color: color-mix(in srgb, var(--rc-soon) 50%, var(--primary-text-color)); }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -2px -4px 0 0; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--rc-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--rc-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--rc-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--rc-accent)); outline-offset: 1px; }
  /* The ribbon: 12 bars of 5 minutes, their height and shade by intensity, a thin neutral bar when dry. */
  .ribbon { position: relative; }
  .bars { display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 3px; align-items: end; height: 100%; }
  .bar { position: relative; height: var(--h); min-height: 3px; border-radius: 3px 3px 2px 2px; background: var(--rc-shade); transform-origin: bottom;
         transition: height .5s ease, background-color .5s ease, opacity .5s ease; }
  .bar.l0 { --h: 3px; --rc-shade: color-mix(in srgb, var(--secondary-text-color) 30%, transparent); }
  .bar.ln { --h: 3px; --rc-shade: transparent; box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--secondary-text-color) 35%, transparent); }
  .bar.l1 { --h: 34%; --rc-shade: var(--rc-light); }
  .bar.l2 { --h: 64%; --rc-shade: var(--rc-moderate); }
  .bar.l3 { --h: 100%; --rc-shade: var(--rc-heavy); }
  .bar.past { opacity: .35; }
  .ribbon.stale .bar { opacity: .3; filter: grayscale(1); }
  /* The bars grow when the forecast changes: the two names alternate so that the animation starts again. */
  .ribbon.g0 .bar { animation: rc-grow-a .6s cubic-bezier(.2, .8, .3, 1) backwards; }
  .ribbon.g1 .bar { animation: rc-grow-b .6s cubic-bezier(.2, .8, .3, 1) backwards; }
  @keyframes rc-grow-a { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  @keyframes rc-grow-b { from { transform: scaleY(0); } to { transform: scaleY(1); } }
  /* Rain coming: the bars of the next shower glow; raining: drops fall onto the rainy bars. */
  .ribbon .bar.next { animation-name: rc-grow-a, rc-glow; animation-duration: .6s, 1.5s; animation-iteration-count: 1, infinite;
                      animation-timing-function: cubic-bezier(.2, .8, .3, 1), ease-in-out; animation-fill-mode: backwards, none; }
  .ribbon.g1 .bar.next { animation-name: rc-grow-b, rc-glow; }
  @keyframes rc-glow { 0%, 100% { filter: brightness(1); } 50% { filter: brightness(1.35) saturate(1.2); } }
  .bar .drip { position: absolute; left: 50%; top: -14px; width: 3px; height: 6px; margin-left: -1.5px; border-radius: 2px;
               background: var(--rc-moderate); opacity: 0; animation: rc-drip 1s linear infinite; }
  @keyframes rc-drip { 0% { transform: translateY(-6px); opacity: 0; } 30% { opacity: 1; } 85% { opacity: .9; } 100% { transform: translateY(12px); opacity: 0; } }
  /* Now: a thin line with a dot, moving along as the minutes go by. */
  .now { position: absolute; top: -4px; bottom: -3px; width: 2px; margin-left: -1px; border-radius: 1px; pointer-events: none;
         background: color-mix(in srgb, var(--primary-text-color) 35%, transparent); transition: left 1s linear; }
  .now::before { content: ""; position: absolute; top: -3px; left: -2px; width: 6px; height: 6px; border-radius: 50%; background: var(--primary-text-color); }
  .now::after { content: ""; position: absolute; top: -6px; left: -5px; width: 12px; height: 12px; border-radius: 50%;
                background: color-mix(in srgb, var(--primary-text-color) 30%, transparent); animation: rc-halo 3s ease-out infinite; }
  @keyframes rc-halo { 0% { transform: scale(.4); opacity: .9; } 60%, 100% { transform: scale(1.4); opacity: 0; } }
  /* Narrow card: the pill keeps only its colored dot (its text stays in title and aria-label). */
  @container rc-card (max-width: 200px) {
    .chip { padding: 4px; flex: none; }
    .chip-text { display: none; }
    .header { gap: 6px; }
  }
`;

const FULL_STYLE = `
  .content { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
  .headline { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  /* Under the illustrated banner, the pill sits at the right of the headline. */
  .lead { display: flex; align-items: flex-start; gap: 8px; }
  .lead .headline { flex: 1 1 auto; }
  .lead .chip { order: 2; margin-top: 4px; }
  .big { font-size: 22px; font-weight: 400; line-height: 1.2; overflow-wrap: anywhere; }
  .detail { font-size: 13px; color: var(--secondary-text-color); }
  .ribbon { height: 56px; margin-top: 10px; }
  .axis { display: flex; justify-content: space-between; font-size: 11px; color: var(--secondary-text-color); margin-top: -4px; }
  .source { font-size: 11px; color: var(--secondary-text-color); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .source.stale { color: color-mix(in srgb, var(--rc-soon) 50%, var(--primary-text-color)); }
  @container rc-card (max-width: 260px) {
    .big { font-size: 18px; }
    .ribbon { height: 44px; }
    .bars { gap: 2px; }
  }
`;

const MINI_STYLE = `
  :host { --rc-natural-width: 300px; }
  .content { padding: 8px 12px 12px; display: flex; align-items: center; gap: 12px; }
  .line { flex: 1 1 auto; min-width: 0; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line .muted { color: var(--secondary-text-color); }
  .ribbon { flex: 0 0 112px; height: 20px; }
  .bars { gap: 2px; }
  .bar { border-radius: 2px 2px 1px 1px; }
  .bar .drip { display: none; }
  .now { top: -2px; bottom: -2px; }
  .now::before { top: -2px; left: -1.5px; width: 5px; height: 5px; }
  .now::after { display: none; }
  @container rc-card (max-width: 220px) {
    .content { flex-direction: column; align-items: stretch; gap: 6px; }
    .ribbon { flex-basis: 20px; }
  }
`;

// ---------------------------------------------------------------------------
// Illustration
// ---------------------------------------------------------------------------

// Night picture: forced by illustration_theme, else the sun below the horizon OR Home Assistant's dark mode (the dark
// theme wins even while the sun is up; with no usable sun.sun the dark mode alone decides).
const isNight = (hass, config) => {
  const theme = config?.illustration_theme;
  if (theme === "night") return true;
  if (theme === "day") return false;
  const sun = hass?.states?.["sun.sun"];
  if (sun && !["unknown", "unavailable", ""].includes(String(sun.state))) return sun.state === "below_horizon" || !!hass?.themes?.darkMode;
  return !!hass?.themes?.darkMode;
};

// State of the next hour → picture: the sun and white clouds when dry, grey clouds coming in with the walker opening
// the umbrella when rain is near, rain falling into a puddle when it rains, plain clouds when the forecast is unknown.
const SCENE_KIND = { dry: "dry", soon: "soon", raining: "rain", stopping: "rain", stale: "idle", unknown: "idle", unavailable: "idle" };
const CLOUD_PATH = "M-14,4 C-17,4 -18,0 -14.5,-1 C-14,-5 -8,-6 -6,-3 C-4,-8 4,-8 5,-2 C9,-3 12,0 10,4 Z";
const STARS = [[12, 8], [44, 18], [96, 6], [132, 24], [168, 10], [188, 30], [70, 30]];

// The banner picture (200 × 80, drawn at the right of the banner, bottom on the ground strip). `level` (1–3) sets
// how many drops fall; `uid` keeps each card's gradient id apart on a page with several cards.
const rainSceneSvg = (kind, level, uid) => {
  const clouds = {
    dry: [[140, 18, 1], [176, 26, 0.7]],
    soon: [[190, 18, 1.8], [166, 26, 1.4]],
    rain: [[140, 18, 1.8], [176, 26, 1.4]],
    idle: [[146, 18, 1.4], [178, 28, 1]],
  }[kind];
  const cloudCls = { dry: "rc-cloud", soon: "rc-cloud grey approach", rain: "rc-cloud grey", idle: "rc-cloud dim" }[kind];
  const n = [10, 10, 13, 16][Math.max(0, Math.min(3, level || 3))];
  const drops =
    kind === "rain"
      ? `<g class="rc-drops">${Array.from({ length: n }, (_, i) => {
          const x = 112 + (i * 88) / n;
          return `<line class="rc-drop r${i % 4}" x1="${x.toFixed(1)}" y1="30" x2="${(x - 2).toFixed(1)}" y2="38"/>`;
        }).join("")}</g>`
      : "";
  const umbrella = kind === "soon" || kind === "rain" ? '<path class="rc-shaft" d="M0 -26 V-44"/><path class="rc-umbrella" d="M-14 -40 Q0 -54 14 -40Z"/>' : "";
  return `<svg class="rc-scene ${kind}" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
    <defs><radialGradient id="rc-sun-${uid}"><stop offset=".55" stop-color="#ffd65a" stop-opacity=".45"/><stop offset="1" stop-color="#ffd65a" stop-opacity="0"/></radialGradient></defs>
    <g class="rc-night">${STARS.map(([x, y], i) => `<circle class="rc-star${i % 3 ? "" : " tw"}" cx="${x}" cy="${y}" r=".7"/>`).join("")}</g>
    ${kind === "dry" ? `<g class="rc-day"><circle cx="150" cy="18" r="11" fill="url(#rc-sun-${uid})"/><circle class="rc-sun" cx="150" cy="18" r="6"/></g><path class="rc-night rc-moon" d="M150 11a7 7 0 1 0 6 10.5 5.6 5.6 0 1 1-6-10.5Z"/>` : ""}
    <g class="${cloudCls}">${clouds.map(([x, y, k]) => `<path transform="translate(${x} ${y}) scale(${k})" d="${CLOUD_PATH}"/>`).join("")}</g>
    ${drops}
    <path class="rc-hill" d="M0,80 C40,72 90,70 200,72 L200,80Z"/>
    ${kind === "rain" ? '<ellipse class="rc-puddle" cx="150" cy="77" rx="20" ry="2"/>' : ""}
    <g class="rc-walker" transform="translate(110 76)"><circle class="rc-skin" cy="-28" r="3.4"/><rect class="rc-coat" x="-3" y="-24" width="6" height="12" rx="2"/><rect class="rc-leg" x="-3" y="-12" width="2" height="12"/><rect class="rc-leg" x="1" y="-12" width="2" height="12"/>${umbrella}</g>
  </svg>`;
};

// The banner: sky gradient, the picture at the right on a 10 px lawn strip, the title and subtitle on the sky at the
// left. Colours day and night; the animations stop with prefers-reduced-motion (BASE_STYLE).
const BANNER_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; --rc-g: 10px; --rc-scene-w: min(200px, 54%);
            --rc-sky-text: #0d2a45; --rc-sky-muted: #3b5b78; color: var(--rc-sky-text);
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.night { --rc-sky-text: #fff; --rc-sky-muted: rgba(255,255,255,.78);
                  background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .rc-scene { position: absolute; right: 0; bottom: var(--rc-g); height: calc(100% - var(--rc-g)); width: var(--rc-scene-w); }
  .rc-ground { position: absolute; left: 0; right: 0; bottom: 0; height: var(--rc-g);
               background: repeating-linear-gradient(90deg, #5aa83d 0 22px, #6cbb4c 22px 44px); }
  .night .rc-ground { background: repeating-linear-gradient(90deg, #1f4a2a 0 22px, #245433 22px 44px); }
  .htext { position: absolute; z-index: 1; left: 0; top: 0; bottom: var(--rc-g); right: calc(var(--rc-scene-w) + 4px);
           display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 14px; min-width: 0; }
  .htext .titles { min-width: 0; }
  .banner .name { font-size: 16px; font-weight: 500; }
  .banner .sub { font-size: 13px; color: var(--rc-sky-muted); }
  .banner .type-icon { background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px rgba(47,128,237,.18); }
  .banner .type-icon svg { fill: color-mix(in srgb, var(--rc-tint) 85%, #0d2a45); }
  .banner.night .type-icon { background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .banner.night .type-icon svg { fill: color-mix(in srgb, var(--rc-tint) 70%, #fff); }
  /* The mini card's detail button: 24 px frosted round in the banner's top right corner. */
  .banner .zoom { position: absolute; z-index: 2; top: 5px; right: 5px; margin: 0; border: 0; color: #33506b;
                  background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7); backdrop-filter: blur(4px); }
  .banner .zoom .icon { width: 16px; height: 16px; }
  .banner .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }
  .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner.night .zoom:hover { background: rgba(255,255,255,.22); color: #fff; }
  /* The status pill on the title's row or under the subtitle: see .trow in BASE_STYLE and _fitPill. */
  .htext .titles { flex: 1 1 auto; }
  .banner .chip { line-height: 16px;
                  background: color-mix(in srgb, var(--c, var(--rc-accent)) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c, var(--rc-accent)) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c, var(--rc-accent)) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c, var(--rc-accent)) 35%, #ffffff); }
  .banner .sub { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .rc-night, .night .rc-day { display: none; }
  .night .rc-night { display: inline; }
  .rc-star { fill: #fff; opacity: .8; } .rc-star.tw { animation: rc-twinkle 3.2s ease-in-out infinite alternate; }
  .rc-sun { fill: #ffd65a; } .rc-moon { fill: #f4f1dc; }
  .rc-cloud { fill: #fff; opacity: .9; } .rc-cloud.grey { fill: #8a96a6; opacity: .95; } .rc-cloud.dim { fill: #c9d3de; }
  .night .rc-cloud { fill: #3d4a5e; } .night .rc-cloud.grey { fill: #4a5568; } .night .rc-cloud.dim { fill: #3a4558; }
  .dry .rc-cloud { animation: rc-drift 7s ease-in-out infinite alternate; }
  .rc-cloud.approach { animation: rc-approach 6s ease-in-out infinite alternate; }
  .rc-drop { stroke: #4aa3ea; stroke-width: 1.4; stroke-linecap: round; opacity: 0; animation: rc-rain .8s linear infinite; }
  .rc-drop.r1 { animation-delay: -.2s; } .rc-drop.r2 { animation-delay: -.4s; } .rc-drop.r3 { animation-delay: -.6s; }
  .night .rc-drop { stroke: #5aa9e6; }
  .rc-hill { fill: #86c27f; } .night .rc-hill { fill: #17303d; }
  .rc-puddle { fill: #4fb3e8; opacity: .5; transform-box: fill-box; transform-origin: center; animation: rc-puddle 2.4s ease-in-out infinite; }
  .rc-skin { fill: #f2c9a0; } .rc-coat { fill: #2f80ed; } .rc-leg { fill: #444; }
  .rc-shaft { stroke: #444; stroke-width: 1; fill: none; } .rc-umbrella { fill: #e5484d; }
  .night .rc-leg { fill: #59606b; } .night .rc-shaft { stroke: #8a929e; }
  @keyframes rc-rain { from { transform: translateY(-6px); opacity: 0; } 30% { opacity: 1; } to { transform: translateY(34px); opacity: 0; } }
  @keyframes rc-approach { from { transform: translateX(0); } to { transform: translateX(-30px); } }
  @keyframes rc-drift { from { transform: translateX(0); } to { transform: translateX(-6px); } }
  @keyframes rc-puddle { 50% { transform: scaleX(1.12); } }
  @keyframes rc-twinkle { from { opacity: .35; } to { opacity: 1; } }
  /* Narrow card: a smaller picture leaves room for the title; very narrow: the sky and the lawn alone. */
  @container rc-card (max-width: 300px) { .banner { --rc-scene-w: 42%; } }
  /* Very narrow card: no room for the picture beside the text, the sky and the lawn stay. */
  @container rc-card (max-width: 220px) { .rc-scene { display: none; } .htext { right: 36px; } }
`;

// ---------------------------------------------------------------------------
// Outside clicks
// ---------------------------------------------------------------------------

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS a tap on something that is not
// clickable sends no click to the page. It counts when the press and the release are both outside the card, and a
// scroll does not count (the browser cancels the pointer). Keyboard clicks still go through the click event.
const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    // A tap (press and release at the same spot), for the tests.
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

let cardUid = 0;

class RainCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._gen = 0;
    this._uid = ++cardUid;
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    // Enter / Space on an element with the button role acts as a click, as on a <button>.
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
  }

  static getConfigElement() {
    return document.createElement("rain-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  // Home Assistant pushes a new hass on every state change of the whole instance: the card is only redrawn when
  // something it shows changed (see _deps).
  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass: the forecast entity, the registries, language and time settings, the weather
  // forecast fetched and the minute (the now marker moves on).
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const { id } = findSource(h, this._config);
    if (!id) return null;
    return [h.states[id], h.entities, h.devices, h.language, h.locale, h.config, h.states["sun.sun"], h.themes?.darkMode, this._wx, this._minute];
  }

  connectedCallback() {
    if (this._hass && this._config) this._update();
    // A new width (or the web font loaded): the status pill is fitted again, in the next frame.
    if (typeof ResizeObserver === "function") {
      this._resize ??= new ResizeObserver((entries) => {
        const w = Math.round(entries.at(-1).contentRect.width);
        if (w === this._fitWidth) return;
        this._fitWidth = w;
        cancelAnimationFrame(this._fitFrame);
        this._fitFrame = requestAnimationFrame(() => this._fitPill());
      });
      this._resize.observe(this);
    }
    document.fonts?.ready?.then(() => this._fitPill());
    // The now marker and the minutes left move on their own: redrawn every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / MIN);
      if (this._hass) this.hass = this._hass;
    }, MIN);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._resize?.disconnect();
    this._fitWidth = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.entity !== undefined && typeof config.entity !== "string") throw new Error("entity must be an entity id");
    this._config = { ...config };
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  // `colors:` overrides the per-intensity bar colors (level 1 light, 2 moderate, 3 heavy; `crit` tints the alert state).
  // Each value is a CSS color (hex, rgb(), var(), a named color…); values with CSS-breaking characters are ignored.
  _colorVars() {
    const c = this._config.colors;
    if (!c || typeof c !== "object") return "";
    const map = { light: "--rc-light", moderate: "--rc-moderate", heavy: "--rc-heavy", crit: "--rc-crit" };
    const safe = (v) => (typeof v === "string" && v.length > 0 && v.length < 64 && !/[;{}<>]/.test(v) ? v.trim() : null);
    const decls = [];
    for (const [key, name] of Object.entries(map)) {
      const v = safe(c[key]);
      if (v) decls.push(`${name}: ${v};`);
    }
    return decls.length ? `<style>:host{${decls.join("")}}</style>` : "";
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _time(ms) {
    return fmtTime(ms, this._hass, this._locale());
  }

  _update() {
    if (!this._hass || !this._config) return;
    const html = this._render();
    if (html !== this._html) {
      this._html = html;
      morph(this.shadowRoot, html);
    }
    this._fitPill();
    this._syncWeather();
  }

  // The status pill stays right after the title only while the whole title and the pill's whole label fit on that
  // row; otherwise it takes a line of its own under the subtitle (.below), and when even then the title, the subtitle
  // and the pill would not fit above the banner's lawn strip, it keeps its dot alone (.pill-dot). Measured in the
  // real fonts, so that every language and title length gets its own answer.
  _fitPill() {
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector(":scope > .trow");
      const chip = row?.querySelector(":scope > .chip");
      if (!chip?.getBoundingClientRect) continue;
      t.classList.remove("below", "pill-dot");
      const name = row.querySelector(":scope > .name");
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const title = name ? textWidth(name) + gap : 0;
      const pill = chip.getBoundingClientRect().width;
      if (title + pill <= row.getBoundingClientRect().width + 0.5) continue;
      t.classList.add("below");
      const r = t.getBoundingClientRect();
      const banner = t.closest(".banner");
      const box = banner?.getBoundingClientRect();
      const floor = banner?.querySelector(".rc-ground")?.getBoundingClientRect().top ?? box?.bottom;
      const tall = box && (r.bottom > floor + 0.5 || r.top < box.top - 0.5);
      if (tall || pill > r.width + 0.5) t.classList.add("pill-dot");
    }
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    if (el.dataset.action === "zoom") return this._toggleZoom(ev);
    if (el.dataset.entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: el.dataset.entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  // ---- Forecast ----------------------------------------------------------

  // { id, start, bars, coarse, stale, unavailable, ref, error }: the twelve bars of the next hour from the source.
  _forecast(id) {
    const s = this._hass.states[id];
    const now = Date.now();
    if (!s || s.state === "unavailable") return { id, start: now, bars: Array(BARS).fill(null), unavailable: true };
    if (!id.startsWith("weather.")) {
      const ref = Date.parse(s.attributes?.forecast_time_ref ?? s.last_updated);
      const start = Number.isFinite(ref) ? ref : now;
      let bars = mfBars(s.attributes?.["1_hour_forecast"]);
      // No minute forecast, only the time of the next rain (state): dry until then, rain from then on.
      const next = Date.parse(s.state);
      const guessed = bars.every((v) => v === null) && Number.isFinite(next);
      if (guessed) bars = bars.map((_, b) => (start + (b + 1) * STEP * MIN > next ? 1 : 0));
      return { id, start, ref: start, bars, guessed, stale: now - start > MF_STALE_MS };
    }
    // Weather entity: the forecast attribute of an integration that still gives one, else the hourly forecast.
    const legacy = Array.isArray(s.attributes?.forecast) ? s.attributes.forecast : null;
    const wx = this._wx?.id === id ? this._wx : null;
    const entries = legacy ?? wx?.list ?? null;
    const start = Math.floor(now / (STEP * MIN)) * STEP * MIN;
    if (!entries) return { id, start, bars: Array(BARS).fill(null), coarse: true, error: wx?.error ? "no_hourly" : null };
    const { bars, coarse } = weatherBars(entries, start);
    const at = legacy ? Date.parse(s.last_updated) : wx.at;
    return { id, start, ref: at, bars, coarse, stale: now - at > WX_STALE_MS };
  }

  // Fetches the hourly forecast of a weather entity (weather.get_forecasts): once, again when the entity changes
  // and every 15 minutes.
  _syncWeather() {
    const { id } = findSource(this._hass, this._config);
    const s = id?.startsWith("weather.") && this._hass.states[id];
    if (!s || Array.isArray(s.attributes?.forecast) || typeof this._hass.callWS !== "function") return;
    const key = `${id}|${s.last_updated}`;
    const w = this._wx;
    if (w?.id === id && (w.loading || (w.key === key && Date.now() - w.at < WX_REFRESH_MS))) return;
    const ticket = { ...(w?.id === id ? w : {}), id, key, loading: true };
    this._wx = ticket;
    Promise.resolve(
      this._hass.callWS({
        type: "call_service",
        domain: "weather",
        service: "get_forecasts",
        service_data: { type: "hourly" },
        target: { entity_id: id },
        return_response: true,
      }),
    )
      .then((res) => {
        if (this._wx !== ticket) return;
        const list = res?.response?.[id]?.forecast;
        this._wx = { id, key, at: Date.now(), list: Array.isArray(list) && list.length ? list : null, error: !Array.isArray(list) || !list.length };
        this._update();
      })
      .catch(() => {
        if (this._wx !== ticket) return;
        this._wx = { id, key, at: Date.now(), list: ticket.list ?? null, error: true };
        this._update();
      });
  }

  // { fc, an, text }: forecast, analysis and the texts of the pill, headline and detail line.
  _view(id) {
    const fc = this._forecast(id);
    const now = Date.now();
    const an = analyse(fc, now);
    const level = an.level && !fc.guessed ? this._t(`level_${an.level}`) : this._t("level_rain");
    const mins = (ms) => Math.max(1, Math.ceil((ms - now) / MIN));
    const time = (ms) => this._time(ms);
    const T = {
      dry: [this._t("pill_dry"), this._t("head_dry"), this._t("sub_dry", { time: time(an.windowEnd) })],
      soon: [
        this._t("pill_soon", { min: mins(an.start) }),
        this._t("head_soon", { time: time(an.start ?? now) }),
        this._t(an.end ? "sub_until" : "sub_beyond", { level, time: time(an.end ?? an.windowEnd) }),
      ],
      raining: [this._t("pill_raining"), this._t("head_raining", { time: time(an.windowEnd) }), this._t("sub_all_hour", { level })],
      stopping: [this._t("pill_stopping", { min: mins(an.end) }), this._t("head_stopping", { time: time(an.end ?? now) }), this._t("sub_dry_from", { level, time: time(an.end ?? now) })],
      stale: [this._t("pill_stale"), this._t("head_stale"), fc.ref ? this._t("sub_stale", { time: time(fc.ref) }) : ""],
      unknown: [this._t("pill_unknown"), this._t("head_unknown"), this._t(fc.error || "sub_unknown")],
      unavailable: [this._t("pill_unavailable"), this._t("head_unavailable"), this._t("sub_unavailable")],
    }[an.state];
    const [pill, head, sub] = T;
    // Signature of the bars: a change of forecast makes them grow again.
    const sig = `${id}|${fc.bars.join(",")}`;
    if (sig !== this._sig) {
      if (this._sig !== undefined) this._gen++;
      this._sig = sig;
    }
    return { fc, an, pill, head, sub, level };
  }

  // ---- Parts -------------------------------------------------------------

  // The badge's colour follows the state of the next hour (the pill's colour); its drops fall while it rains.
  _badge(v) {
    const falling = v.an.state === "raining" || v.an.state === "stopping";
    const drops = ICONS.drops.map((d, i) => `<path class="drop d${i + 1}" d="${d}"/>`).join("");
    return `<span class="type-icon ${STATE_CLASS[v.an.state]}${falling ? " falling" : ""}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS.cloud}"/>${drops}</svg></span>`;
  }

  // The pill: in the classic header, or at the top of the full card's content under the illustrated banner.
  _chip(v, id) {
    return `<span class="chip clickable ${STATE_CLASS[v.an.state]}" role="button" tabindex="0" data-entity="${esc(id)}" title="${esc(v.pill)}" aria-label="${esc(v.pill)}"><span class="dot"></span><span class="chip-text">${esc(v.pill)}</span></span>`;
  }

  _illustrated() {
    return this._config.illustration !== false;
  }

  // The header: the illustrated banner (picture of the state, title and subtitle on its sky), or with
  // `illustration: false` the classic header with the pill.
  _header(v, id, sub) {
    const c = this._config;
    const name = c.show_title === false ? "" : `<div class="name">${esc(c.name || this._t("title"))}</div>`;
    const subtitle = c.show_subtitle === false || !sub ? "" : `<div class="sub" title="${esc(sub)}">${esc(sub)}</div>`;
    if (this._illustrated()) {
      return `
      <div class="banner${isNight(this._hass, c) ? " night" : ""}">
        ${rainSceneSvg(SCENE_KIND[v.an.state], v.an.level, this._uid)}
        <div class="rc-ground"></div>
        <div class="htext">${this._badge(v)}<div class="titles"><div class="trow">${name}${this._chip(v, id)}</div>${subtitle}</div></div>
        ${this._zoomButton()}
      </div>`;
    }
    return `
      <div class="header">
        ${this._badge(v)}
        <div class="titles"><div class="trow">${name}${this._chip(v, id)}</div>${subtitle}</div>
        ${this._zoomButton()}
      </div>`;
  }

  _zoomButton() {
    return "";
  }

  // The 60-minute ribbon: 12 bars (past ones faded), the now marker, drops while it rains, the next shower glowing.
  _ribbon(v, drips) {
    const { fc, an } = v;
    const L = this._locale();
    const raining = an.state === "raining" || an.state === "stopping";
    const nextShower = an.state === "soon" ? Math.round((an.start - fc.start) / (STEP * MIN)) : -1;
    const bars = fc.bars.map((lv, b) => {
      const past = b < an.index && an.state !== "stale";
      const wet = lv > 0 && !past && an.state !== "stale";
      const next = nextShower >= 0 && b >= nextShower && wet && fc.bars.slice(nextShower, b + 1).every((x) => x > 0);
      const label = `${fmtTime(fc.start + b * STEP * MIN, this._hass, L)}: ${lv === null ? this._t("bar_none") : lv === 0 ? this._t("bar_dry") : this._t(`level_${lv}`)}`;
      const drip = drips && raining && wet ? `<i class="drip" style="animation-delay:${(-((b * 7) % 10) / 10).toFixed(1)}s"></i>` : "";
      return `<div class="bar l${lv === null ? "n" : lv}${past ? " past" : ""}${next ? " next" : ""}" title="${esc(label)}" style="animation-delay:${b * 30}ms">${drip}</div>`;
    });
    const marker = ["stale", "unavailable"].includes(an.state) ? "" : `<div class="now" style="left:${((an.pos / BARS) * 100).toFixed(2)}%"></div>`;
    return `<div class="ribbon g${this._gen % 2}${an.state === "stale" ? " stale" : ""}" role="img" aria-label="${esc(`${this._t("ribbon_label")}: ${v.head}`)}"><div class="bars">${bars.join("")}</div>${marker}</div>`;
  }

  _sourceLine(v, id) {
    const parts = [sourceName(this._hass, id)];
    if (v.fc.ref) parts.push(this._t("updated", { time: this._time(v.fc.ref) }));
    if (v.fc.coarse) parts.push(this._t("hourly"));
    return `<div class="source${v.an.state === "stale" ? " stale" : ""}">${esc(parts.join(" · "))}</div>`;
  }

  // The banner's styles, only when it is shown.
  _bannerStyle() {
    return this._illustrated() ? BANNER_STYLE : "";
  }

  _errorCard(key) {
    const text = key === "unknown_entity" ? `${this._t(key)}: ${this._config.entity}` : this._t(key);
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(text)}</div></ha-card>`;
  }

  _render() {
    const { id, error } = findSource(this._hass, this._config);
    if (error) return this._errorCard(error);
    const c = this._config;
    const v = this._view(id);
    const detail = c.show_details === false || !v.sub ? "" : `<div class="detail">${esc(v.sub)}</div>`;
    const ribbon =
      c.show_ribbon === false
        ? ""
        : `${this._ribbon(v, true)}<div class="axis" aria-hidden="true"><span>${esc(this._t("axis_now"))}</span><span>${esc(this._t("axis_30"))}</span><span>${esc(this._t("axis_60"))}</span></div>`;
    const headline = `<div class="headline clickable" role="button" tabindex="0" data-entity="${esc(id)}"><div class="big">${esc(v.head)}</div>${detail}</div>`;
    return `<style>${BASE_STYLE}${FULL_STYLE}${this._bannerStyle()}</style>${this._colorVars()}
      <ha-card>
        ${this._header(v, id, locationOf(this._hass, c, id))}
        <div class="content">
          ${headline}
          ${ribbon}
          ${c.show_source === false ? "" : this._sourceLine(v, id)}
        </div>
      </ha-card>`;
  }
}

// The mini card: one line ("Rain at 14:35 · moderate") with a compact ribbon and the pill. Its detail button (top
// right, `zoom: false` removes it) unfolds it into the full card, and a click anywhere else folds it back.
class RainMiniCard extends RainCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("rain-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    // Back to the compact view once off the screen.
    this._zoomed = false;
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 2;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${!!z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus({ preventScroll: true });
  }

  // "Rain at 14:35 · moderate", "Dry for the next hour", "Rain stops at 14:50 · light".
  _miniLine(v) {
    const wet = ["soon", "raining", "stopping"].includes(v.an.state);
    const head = v.an.state === "raining" ? this._t("pill_raining") : v.head;
    const level = wet && this._config.show_details !== false ? ` <span class="muted">· ${esc(v.level.toLocaleLowerCase(this._locale()))}</span>` : "";
    return `<div class="line clickable" role="button" tabindex="0" data-entity="${esc(v.fc.id)}">${esc(head)}${level}</div>`;
  }

  _render() {
    if (this._zoomed) return super._render();
    const { id, error } = findSource(this._hass, this._config);
    if (error) return this._errorCard(error);
    const v = this._view(id);
    // On the banner, the pill stands on the title's row: no subtitle repeating it.
    return `<style>${BASE_STYLE}${MINI_STYLE}${this._bannerStyle()}</style>${this._colorVars()}
      <ha-card>
        ${this._header(v, id, "")}
        <div class="content">${this._miniLine(v)}${this._config.show_ribbon === false ? "" : this._ribbon(v, false)}</div>
      </ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

// Keeps the YAML minimal: drops empty values and options left at their default.
const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (const [k, v] of Object.entries(config)) {
    if (v === "" || v === undefined || v === null || (k in defaults && v === defaults[k])) delete config[k];
  }
  return config;
};

class RainCardEditor extends HTMLElement {
  // [name, default]
  static get toggles() {
    return [
      ["illustration", true],
      ["show_title", true],
      ["show_subtitle", true],
      ["show_details", true],
      ["show_ribbon", true],
      ["show_source", true],
    ];
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  // Default values, dropped from the YAML: the toggles and the illustration theme (automatic: the sun or the dark theme).
  _defaults() {
    return { ...Object.fromEntries(this.constructor.toggles), illustration_theme: "auto" };
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    return [
      { name: "entity", selector: { entity: { filter: [{ domain: "sensor", integration: "meteo_france" }, { domain: "weather" }] } } },
      { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "location", selector: { text: {} } }] },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      {
        name: "illustration_theme",
        selector: { select: { mode: "dropdown", options: ["auto", "day", "night"].map((value) => ({ value, label: tr(`theme_${value}`) })) } },
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  _render() {
    if (!this._hass || !this._config) return;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => t(this._hass, this._config, s.name);
      this._form.computeHelper = (s) => (s.name === "zoom" ? t(this._hass, this._config, "zoom_helper") : s.name === "entity" ? t(this._hass, this._config, "entity_helper") : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, this._defaults());
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this._config };
    for (const [name, def] of Object.entries(this._defaults())) if (data[name] === undefined) data[name] = def;
    this._form.hass = this._hass;
    if (this._dataFor !== this._config) {
      this._dataFor = this._config;
      this._form.data = data;
    }
    const l = lang(this._hass, this._config);
    if (this._schemaLang !== l) {
      this._schemaLang = l;
      this._form.schema = this._schema();
    }
  }
}

// The options of the full card, which the unfolded view uses, and the detail button.
class RainMiniCardEditor extends RainCardEditor {
  static get toggles() {
    return [...RainCardEditor.toggles, ["zoom", true]];
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
};
define("rain-card", RainCard);
define("rain-mini-card", RainMiniCard);
define("rain-card-editor", RainCardEditor);
define("rain-mini-card-editor", RainMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "rain-card",
    name: "Rain Card",
    description: "Rain in the next hour: Météo-France 60-minute forecast or a weather entity's hourly precipitation, as a ribbon of 5-minute bars.",
  },
  { type: "rain-mini-card", name: "Rain Mini Card", description: "Rain in the next hour on one line, with a compact ribbon and a detail button." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-rain-card" });
}

console.info(`%c RAIN-CARD %c v${VERSION} `, "color: white; background: #1e88e5; font-weight: 700;", "color: #1e88e5; background: white; font-weight: 700;");
