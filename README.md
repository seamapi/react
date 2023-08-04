# Seam Components

[![npm](https://img.shields.io/npm/v/@seamapi/react.svg)](https://www.npmjs.com/package/@seamapi/react)
[![GitHub Actions](https://github.com/seamapi/react/actions/workflows/check.yml/badge.svg)](https://github.com/seamapi/react/actions/workflows/check.yml)

> Seam Components may be used in **any** web application as native **[⚡Web Components ⚡](#with-native-web-components)**

## Description

> [See our official announcement!](https://www.seam.co/blog/Introducing-Seam-Components_ce7e8985-2fe6-4780-8c60-055b34daee55) 🎉

Seam Components are a set of white-labeled UI elements that can be added to your application in seconds.
With these components, you can offer advanced device management features to your users without needing to develop complex logic for managing device state,
refreshing data, and performing actions.

### Resources to Get Started

- [Seam Components Overview](https://docs.seam.co/latest/seam-components/overview)
- [Get started with Seam](https://www.seam.co/).
- [Get started with Client Side Components](https://docs.seam.co/latest/seam-components/get-started-with-client-side-components).
- [Get started with React and Client Session Tokens](https://docs.seam.co/latest/seam-components/get-started-with-react-components-and-client-session-tokens).
- [Make a Supported Devices Page with React](https://docs.seam.co/latest/seam-components/make-a-supported-devices-page-with-react).
- Reference the [Component API](https://docs.seam.co/latest/seam-components/react-components).
- Find developer specific technical documentation in the [README](https://github.com/seamapi/react/).
- Play with the components live in the interactive [Storybook](https://react.seam.co/)!
- See how the components work with a real Seam sandbox workspace in this [live example app](https://react.seam.co/examples/basic/).

## Installation

Add this as a dependency to your project using [npm] with

```
$ npm install @seamapi/react
```

[npm]: https://www.npmjs.com/

## Usage

### With React

> Check out the [basic example app](./examples/basic)!

1. Obtain a publishable key from the [Seam Console].
2. Wrap your React app with the `SeamProvider`.
3. Drop in Seam Components.

```tsx
import { ConnectAccountButton, DeviceTable, SeamProvider } from '@seamapi/react'

export function App() {
  return (
    <SeamProvider publishableKey='your_publishable_key'>
      <main>
        <h1>My App</h1>
        <ConnectAccountButton />
        <DeviceTable />
      </main>
    </SeamProvider>
  )
}
```

[Seam Console]: https://console.seam.co/

### With Native Web Components

> Check out the [web component example app](./examples/web-components)!

1. Obtain a publishable key from the [Seam Console].
2. Add the `<script>` tag to your page and drop in Seam Components.

```html
<body>
  <seam-connect-account-button
    publishable-key="your_publishable_key"
  ></seam-connect-account-button>
  <seam-device-table publishable-key="your_publishable_key"></seam-device-table>
  <script
    type="module"
    src="https://react.seam.co/v/1.45.2/dist/elements.js"
  ></script>
</body>
```

> Update the version in the script tag above with the exact version of this package you would like to use.

[Seam Console]: https://console.seam.co/

### React Hooks

All components interact with the Seam API via a set of React Hooks.
You can use these hooks directly in your application to build your own components.

Import hooks directly from `@seamapi/react` or `@seamapi/react/hooks`.
For most applications, these imports are equivalent,
however if you are only using the hooks, we recommend importing from `@seamapi/react/hooks`
as it may enable performance or bundling improvements depending on your build system.

Hooks must be used inside the `SeamProvider`.
They are well-typed and follow a uniform API.

```tsx
import { SeamProvider, useDevices } from '@seamapi/react/hooks'

export function App() {
  return (
    <SeamProvider publishableKey='your_publishable_key'>
      <main>
        <h1>My App</h1>
        <Devices />
      </main>
    </SeamProvider>
  )
}

function Devices() {
  const { devices, isLoading, isError, error } = useDevices()

  if (isLoading) {
    return <p>Loading</p>
  }

  if (isError) {
    return <p>{error?.message}</p>
  }

  return (
    <>
      <h2>Devices</h2>
      <div>
        {devices?.map((device) => (
          <p key={device.device_id}>{device.properties.name}</p>
        ))}
      </div>
    </>
  )
}
```

### Styles

> CSS is automatically included unless using `<SeamProvider disableCssInjection />`.

Components are styled with plain Cascading Style Sheets (CSS).
All styles are prefixed with `seam-` to avoid name collisions.

By default, the `SeamProvider` will inject a link tag into the document head to load the CSS.
If you prefer to manually load the CSS,
this behavior may be disabled with the `disableCssInjection` prop.
Then, either import the CSS using a supported bundler with

```tsx
import '@seamapi/react/index.css'
```

or place the following in the `<head>` tag:

> You must match the version string below with the exact version of this package used by your application.

```html
<link
  rel="stylesheet"
  href="https://react.seam.co/v/1.16.0/dist/index.min.css"
/>
```

#### Customizing Styles

> The `seam-` prefixed CSS class names are not part of the stable API and may change unexpectedly.

Each component accepts a `className` prop.
The class name will be set on the top level container, or if a sub-component is rendered, passed though.
This makes them compatible with native CSS and most CSS-in-JS systems, e.g., [Emotion] and [styled-components].

[Emotion]: https://emotion.sh/
[styled-components]: https://styled-components.com/

### Fonts

> Fonts are automatically included unless using `<SeamProvider disableFontInjection />`.

The components are optimized for use with [Source Sans Pro], but will fallback to other system sans-serif fonts.

By default, the `SeamProvider` will inject a link tag into the document head to load the font.
If you prefer to manually provide the font,
this behavior may be disabled with the `disableFontInjection` prop.
Then, load it from Google Fonts by placing the following in the `<head>` tag:

```html
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600;700&display=swap"
/>
```

[Source Sans Pro]: https://fonts.google.com/specimen/Source+Sans+Pro

### Content Security Policy (CSP)

#### Default CSP

When using the default provider settings, the components are compatible with this CSP:

```
default-src 'self'; connect-src 'self' https://connect.getseam.com; img-src 'self' https://connect.getseam.com https://seam.co https://www.seam.co; font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com
```

#### Granular CSP

Depending on which assets you choose to host yourself, the CSP may be made stricter.

By self hosting the styles and recommended fonts (or choosing not to use them),
and proxying the Seam API endpoint, the components are compatible with this strict CSP:

```
default-src 'self'; img-src 'self' https://connect.getseam.com https://seam.co https://www.seam.co
```

The `img-src` is required as some components display device images from the Seam API.

When using the default endpoint, extend `connect-src` with

```
connect-src 'self' https://connect.getseam.com
```

When serving the fonts from Google Fonts, include `font-src` and `style-src` with

```
font-src 'self' https://fonts.gstatic.com; style-src 'self' https://fonts.googleapis.com
```

When serving the CSS styles from the default CDN, extend `style-src` with

```
style-src https://react.seam.co
```

## Development and Testing

### Quickstart

```
$ git clone https://github.com/seamapi/react.git
$ cd react
$ nvm install
$ npm install
$ npm start
```

Primary development tasks are defined under `scripts` in `package.json`
and available via `npm run`.
View them with

```
$ npm run
```

### Source code

The [source code] is hosted on GitHub.
Clone the project with

```
$ git clone git@github.com:seamapi/react.git
```

[source code]: https://github.com/seamapi/react

### Requirements

You will need [Node.js] with [npm] and a [Node.js debugging] client.
Alternately, develop in the cloud with [Codespaces].

[codespaces]: https://github.com/features/codespaces

Be sure that all commands run under the correct Node version, e.g.,
if using [nvm], install the correct version with

```
$ nvm install
```

Set the active version for each shell session with

```
$ nvm use
```

Install the development dependencies with

```
$ npm install
```

[Node.js]: https://nodejs.org/
[Node.js debugging]: https://nodejs.org/en/docs/guides/debugging-getting-started/
[npm]: https://www.npmjs.com/
[nvm]: https://github.com/creationix/nvm

### Storybook

Develop components with [Storybook].

Run the full storybook in development mode with

```
$ npm start
```

The deployed storybook runs in docs mode which does not contain the full storybook.
Develop the storybook in docs mode with

```
$ npm run docs:start
```

[Storybook]: https://storybook.js.org/

#### Chromatic

[Chromatic] automates visual and interaction tests for Storybook.

On each commit, the full storybook is published to Chromatic for review.
On pull requests, Chromatic will run UI regressions tests on each commit.
Chromatic reports results as status checks that link directly to the storybook.

If changes are detected, follow the link in the status checks to approve the changes.
_Contributors must be granted access to approve changes on Chromatic;
request access from another maintainer of this project._

[Chromatic]: https://www.chromatic.com/

### Previews

Every pull request deploys the storybook in docs mode with the examples
in a [Vercel Preview Deployment]
where you may [comment directly on the preview][Vercel Comments].
This is the same storybook published on [react.seam.co](https://react.seam.co).

[Vercel Preview Deployment]: https://vercel.com/docs/concepts/deployments/preview-deployments
[Vercel Comments]: https://vercel.com/docs/concepts/deployments/comments

### Fake Seam Connect

This project uses a [fake version of Seam Connect](https://github.com/seamapi/fake-seam-connect)
to have deterministic responses for rendering views and running tests.

Edit the seed data for the fake or find relevant ids for testing components here:

- [Storybook fake seed](./.storybook/seed-fake.js).
- [Jest test fake seed](./test/jest/global-setup.cjs).

### Tests

Write tests with [Jest].

[Jest]: https://jestjs.io/

### Examples

Find fully working examples apps under `examples/`.
Each example app is built and deployed along with the Storybook documentation.

Run and develop the examples with,

```
$ npm run examples
```

### SVG Icon Components

The React components under `src/lib/icons` are generated from `assets/icons`.
To add a new icon:

1. Place or update the SVG icon in `assets/icons`.
2. Run `npm run generate`.
3. Import with

```tsx
import { SeamIcon } from 'lib/icons/SeamIcon.js'
```

### Publishing

#### Automatic

New versions are released automatically with [semantic-release]
as long as commits follow the [Angular Commit Message Conventions].

[Angular Commit Message Conventions]: https://semantic-release.gitbook.io/semantic-release/#commit-message-format
[semantic-release]: https://semantic-release.gitbook.io/

#### Manual

Publish a new version by triggering a [version workflow_dispatch on GitHub Actions].
The `version` input will be passed as the first argument to [npm-version].

This may be done on the web or using the [GitHub CLI] with

```
$ gh workflow run version.yml --raw-field version=<version>
```

[GitHub CLI]: https://cli.github.com/
[npm-version]: https://docs.npmjs.com/cli/version
[version workflow_dispatch on GitHub Actions]: https://github.com/seamapi/react/actions?query=workflow%3Aversion

## GitHub Actions

_GitHub Actions should already be configured: this section is for reference only._

The following repository secrets must be set on [GitHub Actions]:

- `NPM_TOKEN`: npm token for installing and publishing packages.
- `GH_TOKEN`: A personal access token for the bot user with
  `packages:write` and `contents:write` permission.
- `GIT_USER_NAME`: The GitHub bot user's real name.
- `GIT_USER_EMAIL`: The GitHub bot user's email.
- `GPG_PRIVATE_KEY`: The GitHub bot user's [GPG private key].
- `GPG_PASSPHRASE`: The GitHub bot user's GPG passphrase.
- `VERCEL_ACCESS_TOKEN`: The Vercel project token.

The following repository variables must be set on [GitHub Actions]:

- `CLOUDFLARE_R2_BUCKET`: The Cloudflare R2 bucket name.
- `VERCEL_TEAM_ID`: The Vercel team id.
- `STORYBOOK_SEAM_ENDPOINT`: The Seam endpoint to use with Storybook.
- `STORYBOOK_SEAM_PUBLISHABLE_KEY`: The Seam publishable key to use with Storybook.
- `STORYBOOK_SEAM_USER_IDENTIFIER_KEY`: The Seam user identifer key to use with Storybook.

[GitHub Actions]: https://github.com/features/actions
[GPG private key]: https://github.com/marketplace/actions/import-gpg#prerequisites

## Vercel

_Vercel should already be configured: this section is for reference only._

The following environment variables must be set on [Vercel]:

- `SEAM_PUBLISHABLE_KEY`: The Seam publishable key to use with the examples.
- `SEAM_USER_IDENTIFIER_KEY`: The Seam user identifer key to use with the examples..
- `STORYBOOK_SEAM_PUBLISHABLE_KEY`: The Seam publishable key to use with Storybook.
- `STORYBOOK_SEAM_USER_IDENTIFIER_KEY`: The Seam user identifer key to use with Storybook.

[Vercel]: https://vercel.com/seamapi/react

## Contributing

> If using squash merge, edit and ensure the commit message follows the [Angular Commit Message Conventions] specification.
> Otherwise, each individual commit must follow the [Angular Commit Message Conventions] specification.

1. Create your feature branch (`git checkout -b my-new-feature`).
2. Make changes.
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new draft pull request.
6. Ensure all checks pass.
7. Mark your pull request ready for review.
8. Wait for the required approval from the code owners.
9. Merge when ready.

[Angular Commit Message Conventions]: https://semantic-release.gitbook.io/semantic-release/#commit-message-format

## License

This npm package is licensed under the [MIT license].

[MIT license]: https://github.com/seamapi/react/blob/main/LICENSE.txt

## Warranty

This software is provided by the copyright holders and contributors "as is" and
any express or implied warranties, including, but not limited to, the implied
warranties of merchantability and fitness for a particular purpose are
disclaimed. In no event shall the copyright holder or contributors be liable for
any direct, indirect, incidental, special, exemplary, or consequential damages
(including, but not limited to, procurement of substitute goods or services;
loss of use, data, or profits; or business interruption) however caused and on
any theory of liability, whether in contract, strict liability, or tort
(including negligence or otherwise) arising in any way out of the use of this
software, even if advised of the possibility of such damage.
