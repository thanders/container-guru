/** @jsx h */

import blog, { ga, redirects, h } from "blog";
import { generateMarkup, BlogPostingSchema, schemaTypeEnum } from "./dev_deps.ts";

const schema: BlogPostingSchema = {
  '@type': 'BlogPosting',
  author: {
    '@type': schemaTypeEnum.Person,
    name: 'thanders',
    url: 'https://github.com/thanders',
  },
  headline: 'Docker -- Getting started'
  
}

const markup  = generateMarkup( schemaTypeEnum.BlogPosting, schema);

console.log('markup', markup);

blog({
  title: "Container Guru",
  description: "A microblog about application containerization",
  // header: <header>Your custom header</header>,
  // section: (post: Post) => <section>Your custom section with access to Post props.</section>,
  // footer: <footer>Your custom footer</footer>,
  avatar: "https://deno-avatar.deno.dev/avatar/blog.svg",
  avatarClass: "rounded-full",
  author: "thanders",
  lang: "en",
  dateFormat: (date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(date),

  // middlewares: [

    // If you want to set up Google Analytics, paste your GA key here.
    // ga("UA-XXXXXXXX-X"),

    // If you want to provide some redirections, you can specify them here,
    // pathname specified in a key will redirect to pathname in the value.
    // redirects({
    //  "/hello_world.html": "/hello_world",
    // }),

  // ]
});

