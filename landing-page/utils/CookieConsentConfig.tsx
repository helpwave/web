import * as CookieConsent from 'vanilla-cookieconsent'
import type { CookieConsentConfig } from 'vanilla-cookieconsent'

const pluginConfig: CookieConsentConfig = {
  // root: 'body',
  // autoShow: true,
  // disablePageInteraction: true,
  // hideFromBots: true,
  // mode: 'opt-in',
  // revision: 0,
  cookie: {
    // name: 'cc_cookie',
    // domain: location.hostname,
    // path: '/',
    // sameSite: "Lax",
    // expiresAfterDays: 365,
  },
  disablePageInteraction: true,
  /**
   * Callback functions
   */
  // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
  guiOptions: {
    consentModal: {
      layout: 'box wide',
      position: 'middle center',
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: 'box',
      equalWeightButtons: true,
      flipButtons: false,
    },
  },
  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^_ga/, // regex: match all cookies starting with '_ga'
          },
          {
            name: '_gid', // string: exact cookie name
          },
        ],
      },

      // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
      services: {
        ga: {
          label: 'Google Analytics',
          onAccept: async () => {
            await CookieConsent.loadScript('https://www.googletagmanager.com/gtag/js?id=G-ZQDJEWMMX6').then(() => {
              CookieConsent.loadScript('ga.js')
            })
          },
          onReject: async () => {
            // disable Google Analytics see https://developers.google.com/tag-platform/security/guides/consent
            typeof gtag === 'function' && gtag('consent', 'update', {
              analytics_storage: 'denied'
            })
          }
        },
      },
    },
    ads: {},
  },
  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: {
      en: {
        consentModal: {
          title: 'This website uses cookies.',
          description:
            'We use cookies and similar technologies ( referred to as cookies in the following) for statistical usage analysis, to optimize this site, to adapt the content to your usage habits and for suitable advertising also on third-party sites (retargeting).' +
            '\n' +
            'By clicking on "Allow all cookies" you accept the processing of your data and the transfer to our contractual partners.\n' +
            '\n' +
            'You can find more information in the imprint and in our privacy policy. In these, you can adjust your selection at any time under "Manage cookie settings".\n',
          acceptAllBtn: 'Allow all cookies',
          acceptNecessaryBtn: 'Allow only necessary cookies',
          showPreferencesBtn: 'Manage cookie settings',
          // closeIconLabel: 'Reject all and close modal',
        },
        preferencesModal: {
          title: 'Manage cookie preferences',
          acceptAllBtn: 'Allow all cookies',
          savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              description: `We use cookies and similar technologies (hereinafter referred to as cookies) for statistical usage analysis, to optimize this site, to adapt the content to your usage habits and for suitable advertising also on third-party sites (retargeting). By clicking on "Allow all cookies" you accept the processing of your data and the transfer to our contractual partners. You can find more information in the imprint and in our privacy policy. In these, you can adjust your selection at any time under "Manage cookie settings".`,
            },
            {
              title: 'Strictly Necessary',
              description:
                'These cookies ensure the core functions of the website and cannot be turned off.',

              // this field will generate a toggle linked to the 'necessary' category
              linkedCategory: 'necessary',
            },
            {
              title: 'Performance and Analytics',
              description:
                'These cookies ensure the display of advertising customized to you.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Processor on behalf of helpwave',
                  purpose: 'Purpose',
                  duration: 'Storage duration',
                },
                body: [
                  {
                    name: 'Google Commerce Limited, Gordon House, Barrow Street, Dublin 4, Ireland',
                    purpose: 'Reach measurement',
                    duration: '1 years',
                  },
                ],
              },
            },
            {
              title: 'More information',
              description:
                'For more information about cookies and your choices, please read our <a href="https://cdn.helpwave.de/privacy.html">privacy policy</a>.',
            },
          ],
        },
      },
      de: {
        consentModal: {
          title: 'Diese Webseite verwendet Cookies.',
          description: 'Wir verwenden Cookies und ähnliche Technologien (im Folgenden Cookies genannt) zur statistischen Nutzungsanalyse, zur Optimierung dieser Seite, zur Anpassung der Inhalte an Ihre Nutzungsgewohnheiten und für passende Werbung auch auf Drittanbieterseiten (Retargeting).\n' +
            '\n' +
            'Mit einem Klick auf „Alle Cookies zulassen“ akzeptieren Sie die Verarbeitung Ihrer Daten und die Weitergabe an unsere Vertragspartner.\n' +
            '\n' +
            'Weitere Informationen finden Sie im Impressum und in unseren Datenschutzhinweisen. In diesen können Sie unter „Cookie-Einstellungen verwalten“ Ihre Auswahl jederzeit anpassen.\n' +
            '\n',
          acceptAllBtn: 'Alle Cookies zulassen',
          acceptNecessaryBtn: 'Nur notwendige Cookies zulassen',
          showPreferencesBtn: 'Cookie-Einstellungen verwalten',
          // closeIconLabel: 'Reject all and close modal',
        },
        preferencesModal: {
          title: 'Verwalten Sie Ihre Cookie-Einstellungen',
          acceptAllBtn: 'Alle Cookies zulassen',
          savePreferencesBtn: 'Ausgewählte Cookies zulassen',
          closeIconLabel: 'Close modal',
          serviceCounterLabel: 'Service|Services',
          sections: [
            {
              description: `Um Ihnen ein optimales Nutzungserlebnis zu bieten, setzen wir Cookies und ähnliche Technologien ein. Dazu zählen Cookies für den Betrieb und die Optimierung der Seite als auch für an Ihrem Online-Nutzungsverhalten orientierte Werbung.`,
            },
            {
              title: 'Erforderlich',
              description:
                'Diese Cookies stellen die Kernfunktionen der Webseite sicher und können nicht ausgeschaltet werden.',

              // this field will generate a toggle linked to the 'necessary' category
              linkedCategory: 'necessary',
            },
            {
              title: 'Marketing',
              description:
                'Diese Cookies sorgen für die Anzeige von auf Sie zugeschnittener Werbung.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: 'Verarbeiter im Auftrag von helpwave',
                  purpose: 'Zweck',
                  duration: 'Speicherdauer',
                },
                body: [
                  {
                    name: 'Google Commerce Limited, Gordon House, Barrow Street, Dublin 4, Ireland',
                    purpose: 'Reichweitenmessung',
                    duration: '1 Jahr',
                  },
                ],
              }
            },
            {
              title: 'Mehr Informationen',
              description:
                'Für weitere Informationen zu Cookies und Ihren Wahlmöglichkeiten lesen Sie bitte unsere <a href="https://cdn.helpwave.de/privacy.html">Datenschutzhinweise</a>.',
            },
          ],
        },
      },
    },
  },
}
export default pluginConfig
