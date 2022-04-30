# Table Elements

The easiest way to integrate Meilisearch (Algolia coming soon) into your frontend. These components will allow you to kick-start the development of your next beautiful table UIs, including a blazing-fast UX.

## 🐙 Features

This cross-framework compatible (React, Vue, Svelte, Angular, HTML, etc.) web component library comes with the following features & "improvements" to the table element:

- `<table-v2 />`
  - quickly & simply develop a highly-configurable table UI without worrying about the backend
  - "facet filtering" & "table head sorting" natively built in
  - Meilisearch & Laravel Scout API compatible

- `<table-configure />`
  - simple way to configure the table in a HTML semantic fashion

Read more about these features in their respective [docs](https://meema.xyz/docs).

## 💡 Usage

It's incredibly easy to use a Web Components within your own project. Check out the `index.html` to get an idea how it can be done.

```html
<!-- the following props are required to be set either on this `table-configure` or `table-v2 element` -->
<table-configure
  source="127.0.0.1:7700"
  index="collections"
  cols="name, collection_published_at, created_at"
/>

<table-v2 />

<!-- optional props -->
<table-v2
  searchable="true"
  sorts="name, price, created_at"
  filters="traits_Head, traits_Body, traits_Background"
  actionable="true"
  per-page="20"
  use-pagination="true"
/>
```

## 🖥️ Browsers

Meema Elements is built for the modern web and avoids bloated polyfills and outdated environments as much as possible. Currently, it supports all browsers that fully implement the [Custom Elements V1][caniuse-custom-el-v1].

- Edge 79+
- Firefox 63+
- Chrome 67+
- Safari 13.1+
- Opera 64+
- iOS Safari 13.7+
- Android Browser 81+
- Opera Mobile 59+
- Chrome for Android 88+

[caniuse-custom-el-v1]: https://caniuse.com/custom-elementsv1

## 🧪 Testing

```bash
yarn test
```

## 📈 Changelog

Please see our [releases](https://github.com/openweblabs/table-vue/releases) page for more information on what has changed recently.

## 💪🏼 Contributing

Please see [CONTRIBUTING](.github/CONTRIBUTING.md) for details.

## 🏝 Community

For help, discussion about best practices, or any other conversation that would benefit from being searchable:

[Table Elements on GitHub](https://github.com/openweblabs/table-vue/discussions)

For casual chit-chat with others using this package:

[Join the Meema Discord Server](https://discord.meema.io)

## 📄 License

The MIT License (MIT). Please see [LICENSE](LICENSE.md) for more information.

Made with ❤️ by Open Web Labs.
