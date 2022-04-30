# Table Elements

The easiest way to integrate Meilisearch (Algolia coming soon) into your frontend. These components will allow you to kick-start the development of your next beautiful table UIs, including a blazing-fast UX.

## 🐙 Features

This cross-framework compatible (React, Vue, Svelte, Angular, HTML, etc.) web component library comes with the following features & "improvements" to the table element:

- `<table-v2 />`
  - quickly & simply develop a highly-configurable table UI without worrying about the backend
  - "facet filtering" & "table head sorting" natively built in
  - enterprise-ready
  - Meilisearch & Laravel Scout API compatible

- `<table-configure />`
  - simple way to configure the table in HTML semantic fashion

Read more about these features in their respective [docs](https://ow3.org/docs).

## 💡 Get Started

It's incredibly easy to use a Web Components within your own project. Simply require the dependency:

```bash
npm install @openweb/table-vue
```

## 💡 Usage

Next, simply import the components and start using them:

```vue
<script setup>
import { TableConfigure, TableV2 } from 'table-vue'
</script>

<template>
  <!-- the following props are required to be set either on this `table-configure` or `table-v2` element -->
  <table-configure
    source="127.0.0.1:7700"
    index="movies"
    title="Award Winning Movies"
    sub-title="Check out the list of these movies."
  />

  <table-v2 />

  <!-- these are the default properties (all of them are optional)  -->
  <table-v2
    cols="*"
    :searchable="true"
    :filterable="true"
    :sortable="true"
    :actionable="true"
    :per-page="20"
  />

  <!-- alternatively, you may configure your table more specifically -->
  <table-v2
    source="127.0.0.1:7700"
    index="movies"
    cols="id, title, poster, overview, release_date"
    searchable="title, overview"
    filterable="genre, director"
    sortable="release_date"
    actionable="Edit"
    per-page="20"
  />
</template>
```

Check out the `index.html` to get an idea how it can be done in a "working environment".

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
