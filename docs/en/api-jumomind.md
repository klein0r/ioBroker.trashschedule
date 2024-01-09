# Jumomind API (app)

## Cities

`https://<service>.jumomind.com/mmapp/api.php?r=cities`

`https://mymuell.jumomind.com/mmapp/api.php?r=cities`

e.g.

```json
[
  {
    "name": "Abens",
    "_name": "Abens",
    "id": "44",
    "region_code": "06",
    "area_id": "44",
    "img": "data/mymuell.jumomind.com/img/logos/44.png",
    "has_streets": false
  },
  {
    "name": "Abickhafe",
    "_name": "Abickhafe",
    "id": "54",
    "region_code": "06",
    "area_id": "54",
    "img": "data/mymuell.jumomind.com/img/logos/54.png",
    "has_streets": false
  },
  {
    "name": "Achstetten",
    "_name": "Achstetten",
    "id": "126",
    "region_code": "01",
    "area_id": "126",
    "img": "data/mymuell.jumomind.com/img/logos/126.png",
    "has_streets": false
  }
]
```

## Streets

`https://mymuell.jumomind.com/mmapp/api.php?r=streets&city_id=3150`

e.g.

```json
[
  {
    "name": "Adolf-Kolping-Straße",
    "_name": "Adolf-Kolping-Straße",
    "id": "105271",
    "area_id": "1",
    "street_comment": ""
  },
  {
    "name": "Alte Bielefelder Poststraße",
    "_name": "Alte Bielefelder Poststraße",
    "id": "105272",
    "area_id": "2",
    "street_comment": ""
  },
  {
    "name": "Altenbekener Fußweg",
    "_name": "Altenbekener Fußweg",
    "id": "105273",
    "area_id": "3",
    "street_comment": ""
  }
]
```

## Types

`https://mymuell.jumomind.com/mmapp/api.php?r=trash&city_id=3150`

e.g.

```json
[
  {
    "title": "Wertstofftonne",
    "name": "ASP_WERTT",
    "_name": "ASP_WERTT",
    "color": "FFFF00"
  },
  {
    "title": "Biotonne",
    "name": "BIO",
    "_name": "BIO",
    "color": "47c20d"
  },
  {
    "title": "Saison-BIO",
    "name": "BIO_S",
    "_name": "BIO_S",
    "color": "8d5e04"
  },
  {
    "title": "Altpapiertonne",
    "name": "PT",
    "_name": "PT",
    "color": "0a63f7"
  },
  {
    "title": "Weihnachtsbaum",
    "name": "P_WEIH",
    "_name": "P_WEIH",
    "color": "21e034"
  },
  {
    "title": "Restabfalltonne grau",
    "name": "REST",
    "_name": "REST",
    "color": "2F4F4F"
  },
  {
    "title": "Restabfalltonne rot",
    "name": "REST_ROT",
    "_name": "REST_ROT",
    "color": "d20505"
  }
]
```

## Pickups

`https://mymuell.jumomind.com/webservice.php?idx=termins&city_id=3150&area_id=3&ws=3`

e.g.

```json
[
  {
    "Ack": "Success",
    "id": "mm_termins",
    "messages": [
      {
        "status": "OK",
        "msg": "getTermins"
      }
    ],
    "_data": [
      {
        "cal_id": "122741982",
        "cal_date": "2023-10-05",
        "cal_date_normal": "05.10.2023",
        "cal_garbage_type": "REST_ROT",
        "cal_comment": ""
      },
      {
        "cal_id": "122741949",
        "cal_date": "2023-10-05",
        "cal_date_normal": "05.10.2023",
        "cal_garbage_type": "REST",
        "cal_comment": ""
      },
      {
        "cal_id": "122742000",
        "cal_date": "2023-10-05",
        "cal_date_normal": "05.10.2023",
        "cal_garbage_type": "ASP_WERTT",
        "cal_comment": ""
      },
      {
        "cal_id": "122741964",
        "cal_date": "2024-12-28",
        "cal_date_normal": "28.12.2024",
        "cal_garbage_type": "REST",
        "cal_comment": "Abfuhr vom 26.12.2024"
      },
      {
        "cal_id": "122742004",
        "cal_date": "2024-12-28",
        "cal_date_normal": "28.12.2024",
        "cal_garbage_type": "ASP_WERTT",
        "cal_comment": "Abfuhr vom 26.12.2024"
      }
    ],
    "_extra": []
  }
]
```
