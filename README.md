# astro-playground-elements

Add [playground-elements](https://github.com/google/playground-elements) web component to your Astro project.

# How to use

## Install package

```sh
npm i @c2n/astro-playground-elements
npm i playground-elements
```

## Add `@c2n/astro-playground-elements` integration

Apply this integration to your astro.config.\* file using the integrations property:

```js
import { defineConfig } from 'astro/config'
import playgroundElements from '@c2n/astro-playground-elements'

export default defineConfig({
  // ...
  integrations: [playgroundElements()],
})
```

## Import playground-elements

Import playground-elements where you want to use playground-elements component.

See more how to use these component: https://github.com/google/playground-elements

```
----
import playground-elements
----


```
