![Logo](admin/trashschedule.png)

# ioBroker.trashschedule

[![NPM version](https://img.shields.io/npm/v/iobroker.trashschedule?style=flat-square)](https://www.npmjs.com/package/iobroker.trashschedule)
[![Downloads](https://img.shields.io/npm/dm/iobroker.trashschedule?label=npm%20downloads&style=flat-square)](https://www.npmjs.com/package/iobroker.trashschedule)
![node-lts](https://img.shields.io/node/v-lts/iobroker.trashschedule?style=flat-square)
![Libraries.io dependency status for latest release](https://img.shields.io/librariesio/release/npm/iobroker.trashschedule?label=npm%20dependencies&style=flat-square)

![GitHub](https://img.shields.io/github/license/klein0r/iobroker.trashschedule?style=flat-square)
![GitHub repo size](https://img.shields.io/github/repo-size/klein0r/iobroker.trashschedule?logo=github&style=flat-square)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/klein0r/iobroker.trashschedule?logo=github&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/klein0r/iobroker.trashschedule?logo=github&style=flat-square)
![GitHub issues](https://img.shields.io/github/issues/klein0r/iobroker.trashschedule?logo=github&style=flat-square)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/klein0r/iobroker.trashschedule/test-and-release.yml?branch=master&logo=github&style=flat-square)

## Versions

![Beta](https://img.shields.io/npm/v/iobroker.trashschedule.svg?color=red&label=beta)
![Stable](http://iobroker.live/badges/trashschedule-stable.svg)
![Installed](http://iobroker.live/badges/trashschedule-installed.svg)

Calculates the days left until next trash pickup

## Sponsored by

[![ioBroker Master Kurs](https://haus-automatisierung.com/images/ads/ioBroker-Kurs.png?2024)](https://haus-automatisierung.com/iobroker-kurs/?refid=iobroker-trashschedule)

## Installation

Please use the "adapter list" in ioBroker to install a stable version of this adapter. You can also use the CLI to install this adapter:

```
iobroker add trashschedule
```

## Documentation

[🇺🇸 Documentation](./docs/en/README.md)

[🇩🇪 Dokumentation](./docs/de/README.md)

## Credits

- SVG: https://pixabay.com/de/vectors/behälter-kann-deckel-offen-grün-310937/

## Sentry

**This adapter uses Sentry libraries to automatically report exceptions and code errors to the developers.** For more details and for information how to disable the error reporting see [Sentry-Plugin Documentation](https://github.com/ioBroker/plugin-sentry#plugin-sentry)! Sentry reporting is used starting with js-controller 3.0.

## Changelog

<!--
  Placeholder for the next version (at the beginning of the line):
  ### **WORK IN PROGRESS**
-->
### **WORK IN PROGRESS**

* (@klein0r) Validate user inputs in instance configuration
* (@Sickboy78) Added Awido as Webservice

### 3.3.0 (2024-04-28)

NodeJS >= 18.x and js-controller >= 5 is required

* (klein0r) Improved error reporting / log messages
* (klein0r) Fixed translations
* (klein0r) Added Abfall+ as Webservice

### 3.2.0 (2024-01-22)

* (klein0r) Added more providers

### 3.1.3 (2023-12-24)

* (klein0r) fixed configuration validation
* (klein0r) enhanced error logging
* (klein0r) some cities have no streets (API)

### 3.1.2 (2023-12-22)

* (klein0r) Fixed exception when cache dir doesn't exist

### 3.1.1 (2023-12-22)

* (klein0r) Fixed config validation / integration test

## License

MIT License

Copyright (c) 2024 Matthias Kleine <info@haus-automatisierung.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
