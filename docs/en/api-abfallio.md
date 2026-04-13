# Abfall.io / AbfallPlus

https://www.abfallplus.de/online-tool/

## Cities

Fixed array

## Kommune (f_id_kommune)

- [Abfallwirtschaft Landkreis Böblingen](https://www.awb-bb.de/start/entsorgen/Abfuhrtermine.html): 8215c62763967916979e0e8566b6172e - muss noch Kommune auswählen
- [Stadt Landshut](https://www.landshut.de/umwelt/abfall/entsorgungstermine#Individueller%20Kalender): bd0c2d0177a0849a905cded5cb734a6f - Kommune fix als hidden input

https://api.abfall.io/?key=690a3ae4906c52b232c1322e2f88550c&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=init

## Streets

https://api.abfall.io/?key=bd0c2d0177a0849a905cded5cb734a6f&modus=d6c5855a62cf32a4dadbc2831f0f295f&waction=auswahl_strasse_set

--data 'e24c052e5f8cc25ff5614b4a793cd8c4=ba9728994cb1a5c7b421eaf114a88bb2&f_id_kommune=2655&f_id_bezirk=0&f_id_strasse=1'

```html
<input type="checkbox" id="f_id_abfalltyp_19_bd0c2d0177a0849a905cded5cb734a6f" name="f_id_abfalltyp_2" value="19" class="awk-ui-input awk-ui-input-checkbox awk-ui-focusable" checked awk-data-onchange-submit-waction="auswahl_fraktionen_set" awk-data-onchange-submit-wziel="#awk_widget_placeholder_fraktionen" awk-data-onchange-submit-wempty="0"/>
```

## Types

https://api.abfall.io/?key=d1f50b0bb1ddf7ed6c1491068898b1ee&modus=de9b9ed78d7e2e1dceeffee780e2f919

```
f_id_kommune: 2655
f_id_bezirk: 0
f_id_strasse: 6
f_posts_json[]: a:4:{s:32:"8ad2e91bf72097645f651806800d3faf";s:32:"4718242240e746ab6b3556c0ebc1686a";s:12:"f_id_kommune";s:4:"2655";s:11:"f_id_bezirk";s:1:"0";s:12:"f_id_strasse";s:1:"6";}
f_id_strasse_hnr: 7
```

## GraphQL

### GetCities

```
curl 'https://widgets.abfall.io/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Origin: https://www.awb-bb.de' \
-H 'x-abfallplus-api-key: xxx' \
--data-binary '{"query":"\n                    query GetCities($query: String) {\n                        cities(query: $query) {\n                            id\n                            name\n                            idHouseNumber\n                            districtsCount\n                            appointmentsSupported\n                        }\n                      }\n                    ","variables":{"query":null}}'
```

```json
{
    "data": {
        "cities": [
            {
                "id": "2977",
                "name": "Aidlingen",
                "idHouseNumber": "28",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2978",
                "name": "Altdorf",
                "idHouseNumber": "1071",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2980",
                "name": "Böblingen",
                "idHouseNumber": null,
                "districtsCount": 2,
                "appointmentsSupported": true
            },
            {
                "id": "2979",
                "name": "Bondorf",
                "idHouseNumber": "1072",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2981",
                "name": "Deckenpfronn",
                "idHouseNumber": "1073",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2982",
                "name": "Ehningen",
                "idHouseNumber": "1091",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2984",
                "name": "Gärtringen",
                "idHouseNumber": null,
                "districtsCount": 2,
                "appointmentsSupported": true
            },
            {
                "id": "2985",
                "name": "Gäufelden",
                "idHouseNumber": null,
                "districtsCount": 4,
                "appointmentsSupported": true
            },
            {
                "id": "2983",
                "name": "Grafenau",
                "idHouseNumber": "1076",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2986",
                "name": "Herrenberg",
                "idHouseNumber": null,
                "districtsCount": 8,
                "appointmentsSupported": true
            },
            {
                "id": "2987",
                "name": "Hildrizhausen",
                "idHouseNumber": "1077",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2988",
                "name": "Holzgerlingen",
                "idHouseNumber": "1078",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2989",
                "name": "Jettingen",
                "idHouseNumber": "1079",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2990",
                "name": "Leonberg",
                "idHouseNumber": null,
                "districtsCount": 4,
                "appointmentsSupported": true
            },
            {
                "id": "2991",
                "name": "Magstadt",
                "idHouseNumber": "1080",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2992",
                "name": "Mötzingen",
                "idHouseNumber": "1081",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2993",
                "name": "Nufringen",
                "idHouseNumber": "1082",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2994",
                "name": "Renningen",
                "idHouseNumber": null,
                "districtsCount": 2,
                "appointmentsSupported": true
            },
            {
                "id": "2995",
                "name": "Rutesheim",
                "idHouseNumber": null,
                "districtsCount": 0,
                "appointmentsSupported": true
            },
            {
                "id": "2996",
                "name": "Schönaich",
                "idHouseNumber": "1085",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2997",
                "name": "Sindelfingen",
                "idHouseNumber": null,
                "districtsCount": 3,
                "appointmentsSupported": true
            },
            {
                "id": "2998",
                "name": "Steinenbronn",
                "idHouseNumber": "1086",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "2999",
                "name": "Waldenbuch",
                "idHouseNumber": "1087",
                "districtsCount": 1,
                "appointmentsSupported": true
            },
            {
                "id": "3000",
                "name": "Weil der Stadt",
                "idHouseNumber": null,
                "districtsCount": 5,
                "appointmentsSupported": true
            },
            {
                "id": "3001",
                "name": "Weil im Schönbuch",
                "idHouseNumber": null,
                "districtsCount": 3,
                "appointmentsSupported": true
            },
            {
                "id": "3002",
                "name": "Weissach",
                "idHouseNumber": "1090",
                "districtsCount": 1,
                "appointmentsSupported": true
            }
        ]
    }
}
```

### Districts

```
curl 'https://widgets.abfall.io/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Origin: https://www.awb-bb.de' \
-H 'x-abfallplus-api-key: xxx' \
--data-binary '{"query":"\n                    query GetStreets($cityId: ID!, $query: String) {\n                        city(id: $cityId) {\n                            districts(query: $query) {\n                                id\n                                name\n                                idHouseNumber\n                            }\n                        }\n                      }\n                    ","variables":{"cityId":"3001","query":null}}'
```

```json
{
    "data": {
        "city": {
            "districts": [
                {
                    "id": "1093",
                    "name": "Breitenstein",
                    "idHouseNumber": "1100"
                },
                {
                    "id": "1054",
                    "name": "Hauptort",
                    "idHouseNumber": "1089"
                },
                {
                    "id": "1092",
                    "name": "Neuweiler",
                    "idHouseNumber": "1099"
                }
            ]
        }
    }
}
```

### GetStreets

```
curl 'https://widgets.abfall.io/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Origin: https://www.awb-bb.de' \
-H 'x-abfallplus-api-key: xxx' \
--data-binary '{"query":"\n                    query GetStreets($id: ID!, $query: String) {\n                        city(id: $id) {\n                            streets(query: $query) {\n                                id\n                                name\n                                idHouseNumber\n                            }\n                        }\n                      }\n                    ","variables":{"id":"2977","query":null}}'
```

```json
{
    "data": {
        "city": {
            "streets": [
                {
                    "id": "1",
                    "name": "alle Straßen",
                    "idHouseNumber": "28"
                }
            ]
        }
    }
}
```

### GetHouseNumbers

```
curl 'https://widgets.abfall.io/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Origin: https://www.awb-bb.de' \
-H 'x-abfallplus-api-key: xxx' \
--data-binary '{"query":"\n                    query GetHouseNumbers($streetId: ID!, $idDistrict: ID, $query: String) {\n                        street(id: $streetId) {\n                          houseNumbers(query: $query, idDistrict: $idDistrict) {\n                            id\n                            name\n                          }\n                        }\n                      }\n                    ","variables":{"streetId":"1","query":null,"idDistrict":null}}'
```

```json
{
    "data": {
        "street": {
            "houseNumbers": [
                {
                    "id": "28",
                    "name": "Alle Hausnummern"
                }
            ]
        }
    }
}
```

### HouseNumber

```
curl 'https://widgets.abfall.io/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Origin: https://www.awb-bb.de' \
-H 'x-abfallplus-api-key: xxx' \
--data-binary '{"query":"\n                query HouseNumber($houseNumberId: ID!) {\n                    houseNumber(id: $houseNumberId) {\n                      wasteTypes {\n                        id\n                        name\n                        internals {\n                            pdfLegend\n                        }\n                      }\n                    }\n                  }\n                    ","variables":{"houseNumberId":"28"}}'
```

```json
{
    "data": {
        "houseNumber": {
            "wasteTypes": [
                {
                    "id": "50",
                    "name": "Biomüll",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "53",
                    "name": "Papier 120l/240l",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "328",
                    "name": "Papier ab 1.100l",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "333",
                    "name": "Restmüll 1.100l (vierwöchentlich)",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "326",
                    "name": "Restmüll 1.100l (wöchentlich)",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "325",
                    "name": "Restmüll 1.100l (zweiwöchentlich)",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "31",
                    "name": "Restmüll 120l/240l",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "335",
                    "name": "Restmüll ab 2.500l (vierwöchentlich)",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "327",
                    "name": "Restmüll ab 2.500l (wöchentlich)",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "334",
                    "name": "Restmüll ab 2.500l (zweiwöchentlich)",
                    "internals": {
                        "pdfLegend": null
                    }
                },
                {
                    "id": "299",
                    "name": "Wertstoffe",
                    "internals": {
                        "pdfLegend": null
                    }
                }
            ]
        }
    }
}
```

### appointments

```
curl 'https://widgets.abfall.io/graphql' \
-X 'POST' \
-H 'Content-Type: application/json' \
-H 'Accept: */*' \
-H 'Sec-Fetch-Site: cross-site' \
-H 'Accept-Language: en-GB,en;q=0.9' \
-H 'Accept-Encoding: gzip, deflate, br' \
-H 'Sec-Fetch-Mode: cors' \
-H 'Host: widgets.abfall.io' \
-H 'Origin: https://www.awb-bb.de' \
-H 'Content-Length: 918' \
-H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2.1 Safari/605.1.15' \
-H 'Referer: https://www.awb-bb.de/' \
-H 'Connection: keep-alive' \
-H 'Sec-Fetch-Dest: empty' \
-H 'x-abfallplus-api-key: caac1d0b40973ad8ed652ef666ab7336fd50eede75ff868d' \
--data-binary '{"query":"\n                query Query($idHouseNumber: ID!, $wasteTypes: [ID], $dateMin: Date, $dateMax: Date, $showInactive: Boolean) {\n                    appointments(idHouseNumber: $idHouseNumber, wasteTypes: $wasteTypes, dateMin: $dateMin, dateMax: $dateMax, showInactive: $showInactive) {\n                      id\n                      date\n                      time\n                      location\n                      note\n                      wasteType {\n                        id\n                        name\n                        color\n                        internals {\n                            pdfLegend\n                            iconLow\n                        }\n                      }\n                    }\n                  }\n                    ","variables":{"idHouseNumber":"28","wasteTypes":["299"],"dateMin":"2024-01-01","dateMax":"2024-12-31","showInactive":false}}'
```

```json
{
    "data": {
        "appointments": [
            {
                "id": "166608",
                "date": "2024-01-22",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166609",
                "date": "2024-02-19",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166610",
                "date": "2024-03-18",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166611",
                "date": "2024-04-15",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166612",
                "date": "2024-05-13",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166613",
                "date": "2024-06-10",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166614",
                "date": "2024-07-08",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166615",
                "date": "2024-08-05",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166616",
                "date": "2024-09-02",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166617",
                "date": "2024-09-30",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166618",
                "date": "2024-10-28",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166619",
                "date": "2024-11-25",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            },
            {
                "id": "166620",
                "date": "2024-12-21",
                "time": null,
                "location": null,
                "note": null,
                "wasteType": {
                    "id": "299",
                    "name": "Wertstoffe",
                    "color": "#f49d2a",
                    "internals": {
                        "pdfLegend": null,
                        "iconLow": null
                    }
                }
            }
        ]
    }
}
```
