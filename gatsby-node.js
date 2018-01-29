const _ = require(`lodash`);
const Promise = require(`bluebird`);
const path = require(`path`);
const slash = require(`slash`);
const processBody = require('./src/server/process_body');
// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for WordPress pages (route : /{slug})
// Will create pages for WordPress posts (route : /post/{slug})
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  const P1 = new Promise((resolve, reject) => {
    // The “graphql” function allows us to run arbitrary
    // queries against the local WordPress graphql schema. Think of
    // it like the site has a built-in database constructed
    // from the fetched data that you can run queries against.

    // ==== PAGES (WORDPRESS NATIVE) ====
    resolve(
      graphql(
        `
          {
            allWordpressPage {
              edges {
                node {
                  id
                  slug
                  status
                  template
                  content
                }
              }
            }
          }
        `
      )
    );
  });

  const P2 = new Promise((resolve, reject) => {
    resolve(
      graphql(
        `
          {
            allWordpressWpMedia {
              edges {
                node {
                  id
                  slug
                  status
                  source_url
                  title
                }
              }
            }
          }
        `
      )
    );
  });
  return Promise.all([P1, P2]).then(results => {

    const pages = results[0].data.allWordpressPage.edges;
    const media = results[1].data.allWordpressWpMedia.edges;


    // if (result.errors) {
    //   console.log(result.errors);
    //   reject(result.errors);
    // }

    // Create Page pages.
    const pageTemplate = path.resolve('./src/templates/page.js');
    const mediaTemplate = path.resolve('./src/templates/media.js');
    // // We want to create a detailed page for each
    // // page node. We'll just use the WordPress Slug for the slug.
    // // The Page ID is prefixed with 'PAGE_'
    // console.log('?? ');
    _.each(pages, edge => {
      //   // Gatsby uses Redux to manage its internal state.
      //   // Plugins and sites can use functions like "createPage"
      //   // to interact with Gatsby.

      const transformedContent = processBody(edge.node.content);

      //   console.log('??? ', {
      //     edge,
      //     transformedContent
      //   });

      //   return {
      //     edge,
      //     transformedContent
      //   };

      const fromWordpress = _.map(transformedContent, galleryItem => {
        // console.log('??? ', galleryItem);
        // console.log('!!! ', media)
        // TO DO: need to find the prev and next nodes like we are finding curr node
        //
        const found = media.reduce((acc, curr, index, arr) => {
          if (acc && acc.node.source_url === galleryItem.original) {
            return acc;
          }

          if (curr.node.source_url === galleryItem.original) {
            const prev = _.get(arr, `[${index - 1}].node.slug`);
            _.set(curr, 'node.prev', prev);
            const next = _.get(arr, `[${index + 1}].node.slug`);
            _.set(curr, 'node.next', next);
            return curr;
          }

          // const { node } = mediaItem;
          // const { source_url } = node;
          // return source_url === galleryItem.original;
        }).node;


        console.log('!!! ', found)
        createPage({
          //   // Each page is required to have a `path` as well
          //   // as a template component. The `context` is
          //   // optional but is often necessary so the template
          //   // can query data specific to each page.
          path: `/${edge.node.slug}/gallery/${found.slug}/`,
          component: slash(mediaTemplate),
          context: {
            ...found,
            slug: edge.node.slug
          }
        });

        return {...found, ...galleryItem};
      });


      createPage({
        //     // Each page is required to have a `path` as well
        //     // as a template component. The `context` is
        //     // optional but is often necessary so the template
        //     // can query data specific to each page.
        path: `/${edge.node.slug}/`,
        component: slash(pageTemplate),
        context: {
          id: edge.node.id,
          transformedContent: fromWordpress
        }
      });
    });
    // resolve();
    // resolve();
  }).catch((err)=>console.error(err));
};
// ==== END PAGES ====

// ==== MEDIA (WORDPRESS NATIVE AND ACF) ====
// .then(() => {
//   graphql(
//     `
//       {
//         allWordpressWpMedia {
//           edges {
//             node {
//               id
//               slug
//               status

//             }
//           }
//         }
//       }
//     `
//   ).then(result => {
//     if (result.errors) {
//       console.log(result.errors);
//       reject(result.errors);
//     }
//     const mediaTemplate = path.resolve("./src/templates/media.js");
//     // We want to create a detailed page for each
//     // post node. We'll just use the WordPress Slug for the slug.
//     // The Post ID is prefixed with 'POST_'
//     _.each(result.data.allWordpressWpMedia.edges, edge => {
//       createPage({
//         path: `/${edge.node.slug}/`,
//         component: slash(mediaTemplate),
//         context: {
//           id: edge.node.id
//         },
//       });
//     });
//     resolve();
//   });
// });
// ==== END MEDIA ====
