# **Components**

This folder contains various components that can be used as is or to expand new components that you may want to create.

## **Card**

The card component is designed to be a simple card container that holds some styling and layout features, other than that this is ment to be used in combination with other HTML elements to create custome cards depending on its use.

```html
<Card>
  <template v-slot:header><!--Add your header here--></template>
  <template v-slot:body><!--Add your body here--></template>
</Card>
```

<br />

## **Layout**

The layout component is ment to distribute the views (pages) into two columns using Flexbox

It can be used like this

```html
<Layout>
  <template v-slot:sidebar><!--Add contet to sidebar--></template>
  <template v-slot:main><!--Add main content--></template>
</Layout>
```

An example of where this is used can be found [**here**](../views/Home.vue)
