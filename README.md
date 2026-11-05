# Wanderly --- Discover More. Travel Further.

Wanderly is a responsive, editorial-style travel discovery website
created to help visitors explore destinations, discover curated travel
experiences, compare travel packages, and submit travel enquiries.

The project focuses on a polished visual experience, responsive layouts,
and lightweight client-side interactions using standard web
technologies.

> **Project type:** Frontend-only static website\
> **Technology:** HTML, CSS, JavaScript (ES modules)

------------------------------------------------------------------------

## Live Preview

-   **Live website:** `https://wanderly-travel-co.netlify.app/`
-   **GitHub repository:** `https://github.com/SACHIN-S-2004/Wanderly.git`

Replace these placeholders with the final public URLs after deployment.

------------------------------------------------------------------------

## Features

### Travel discovery

-   Cinematic hero section with calls to action.
-   Destination highlights for Bali, Dubai, Maldives, and Switzerland.
-   Discover by Experience tabs:
    -   Tropical Escapes
    -   Mountain Retreats
    -   Desert Adventures
    -   Cultural Journeys
-   Editorial-style travel stories in The Travel Edit section.

### Journey finder

-   Filter travel ideas by experience type, budget, and duration.
-   Display matching suggestions using predefined frontend data.

### Curated travel packages

-   Maldives Island Escape --- 5 Days / 4 Nights, from ₹45,000 per
    person.
-   Dubai Desert & Beyond --- 4 Days / 3 Nights, from ₹32,000 per
    person.
-   Switzerland Alpine Discovery --- 7 Days / 6 Nights, from ₹85,000 per
    person.

Prices and package information are illustrative frontend content.

### Travel enquiry

-   Enquiry modal with required-field and browser-native validation.
-   Saves submitted enquiries in the visitor's browser using
    `localStorage`.
-   Displays a confirmation screen with a generated enquiry reference.
-   Generates a downloadable PDF enquiry receipt.

**Storage note:** Enquiries are stored locally in the visitor's browser.
They are not transmitted to the website owner or stored in a central
database. Clearing browser storage or using another browser/device will
not carry those records across.

**Booking note:** Submitting the form creates an enquiry record only. It
does not confirm a booking, process a payment, or contact a travel
agent.

### Interaction and responsive design

-   Responsive navigation with a mobile menu.
-   Animated section reveals and experience-tab transitions.
-   Preloaded experience images to make tab switching feel more
    immediate.
-   Responsive layouts for desktop, tablet, and mobile.
-   Reduced-motion support where implemented.

------------------------------------------------------------------------

## Technology Stack

  -----------------------------------------------------------------------
  Technology                          Use
  ----------------------------------- -----------------------------------
  HTML5                               Page structure and content

  CSS3                                Layout, responsive styling, and
                                      animations

  Vanilla JavaScript                  Navigation, interactions, filters,
                                      and form behaviour

  JavaScript ES modules               Organised frontend scripts

  `localStorage`                      Browser-local enquiry persistence

  jsPDF                               Client-side PDF receipt generation

  Google Fonts                        Cormorant Garamond and DM Sans

  Unsplash and other image hosts      Externally hosted visual assets
  -----------------------------------------------------------------------

No application framework, backend server, or database is required to run
the website.

------------------------------------------------------------------------

## Project Structure

``` text
Wanderly/
├── index.html
├── README.md
├── assets/
│   ├── images/
│   │   └── wanderly-og.png
│   └── icons/
│       ├── favicon.ico
│       ├── favicon-32x32.png
│       └── apple-touch-icon.png
├── css/
│   ├── style.css
│   ├── components.css
│   └── responsive.css
└── js/
    ├── main.js
    ├── navigation.js
    ├── animations.js
    └── booking.js
```

The `assets` files shown above are the intended locations for the
social-sharing image and favicon assets. Keep the filenames and paths in
`index.html` consistent with the files in your project.

------------------------------------------------------------------------

## Run Locally

Because the project uses JavaScript ES modules, open it through a local
development server rather than opening `index.html` directly with a
`file://` URL.

### Option 1: Visual Studio Code Live Server

1.  Open the project folder in Visual Studio Code.
2.  Install the **Live Server** extension if it is not already
    installed.
3.  Right-click `index.html`.
4.  Select **Open with Live Server**.

### Option 2: Python HTTP server

Open a terminal in the project root and run:

``` bash
python -m http.server 5500
```

Then visit:

``` text
http://localhost:5500
```

------------------------------------------------------------------------

## PDF Receipt

The enquiry receipt is generated in the browser using jsPDF.

-   The PDF library is loaded from a CDN with a fallback CDN.
-   An internet connection is required when the library has not already
    been loaded or cached.
-   The PDF is generated on the visitor's device; no server-side PDF
    processing takes place.

------------------------------------------------------------------------

## Deployment

Wanderly is a static website and can be deployed using Netlify, Vercel,
GitHub Pages, or another static hosting provider.

### Netlify deployment

1.  Push the project to a GitHub repository.
2.  Sign in to [Netlify](https://www.netlify.com/).
3.  Choose **Add new project** → **Import an existing project**.
4.  Connect the GitHub repository.
5.  Select the deployment branch (for example, `main`).
6.  Leave the build command empty.
7.  Set the publish directory to the project root (`.`).
8.  Deploy the site.

After deployment, update the canonical URL and Open Graph URLs in
`index.html` to use the final public website URL. Ensure the
social-sharing image is publicly accessible at the path specified by
`og:image`.

------------------------------------------------------------------------

## Customisation

-   **Branding and page content:** `index.html`
-   **Global styles and layout:** `css/style.css`
-   **Component styles:** `css/components.css`
-   **Responsive rules:** `css/responsive.css`
-   **Main interactions and journey finder:** `js/main.js`
-   **Navigation and mobile menu:** `js/navigation.js`
-   **Scroll and visual animations:** `js/animations.js`
-   **Enquiry storage and PDF generation:** `js/booking.js`
-   **Images, favicon, and social preview:** `assets/`

Some images are loaded from external image hosts. Their availability and
loading performance depend on those providers.

------------------------------------------------------------------------

## Important Limitations

-   This is a frontend demonstration project, not a production booking
    platform.
-   Enquiry data is stored only in the visitor's browser using
    `localStorage`.
-   Enquiries are not emailed, synced, or sent to an administrator.
-   There is no authentication, central database, payment processing, or
    live travel inventory.
-   Package prices and destination content are illustrative and should
    be verified before use in a real travel service.
-   PDF generation depends on the jsPDF CDN being reachable when
    required.
-   Social preview and search-engine appearance depend on the metadata,
    public asset availability, and the respective platform's crawling
    and caching behaviour.

------------------------------------------------------------------------

## Credits

-   Typography: [Google Fonts](https://fonts.google.com/) --- Cormorant
    Garamond and DM Sans.
-   Travel imagery: external image providers, including
    [Unsplash](https://unsplash.com/).
-   PDF generation: [jsPDF](https://github.com/parallax/jsPDF).

Please check the usage terms and attribution requirements of each
external asset before using the project commercially.

------------------------------------------------------------------------

## Author

**Name:** `SACHIN SURESH`\
**GitHub:** `https://github.com/SACHIN-S-2004`

------------------------------------------------------------------------

*Wanderly --- Discover More. Travel Further.*
