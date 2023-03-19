"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core2 = require("@keystone-6/core");

// schema.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");
var import_fields = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var lists = {
  User: (0, import_core.list)({
    access: import_access.allowAll,
    // this is the fields for our User list
    fields: {
      name: (0, import_fields.text)({ validation: { isRequired: true } }),
      email: (0, import_fields.text)({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique"
      }),
      password: (0, import_fields.password)({ validation: { isRequired: true } }),
      race: (0, import_fields.relationship)({ ref: "Race", many: false }),
      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: (0, import_fields.relationship)({ ref: "Post.author", many: true }),
      createdAt: (0, import_fields.timestamp)({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" }
      })
    }
  }),
  Post: (0, import_core.list)({
    access: import_access.allowAll,
    // this is the fields for our Post list
    fields: {
      title: (0, import_fields.text)({ validation: { isRequired: true } }),
      content: (0, import_fields_document.document)({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1]
        ],
        links: true,
        dividers: true
      }),
      // with this field, you can set a User as the author for a Post
      author: (0, import_fields.relationship)({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: "User.posts",
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true
        },
        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false
      }),
      // with this field, you can add some Tags to Posts
      tags: (0, import_fields.relationship)({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: "Tag.posts",
        // a Post can have many Tags, not just one
        many: true,
        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: "cards",
          cardFields: ["name"],
          inlineEdit: { fields: ["name"] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ["name"] }
        }
      })
    }
  }),
  Race: (0, import_core.list)({
    access: import_access.allowAll,
    fields: {
      name: (0, import_fields.select)({
        type: "string",
        defaultValue: "",
        db: { map: "race" },
        options: [
          {
            label: "Denev\xE9rek",
            value: "bat"
          },
          {
            label: "D\u0171n\xE9k-n\xE9pe",
            value: "dunefolk"
          },
          {
            label: "Emberek",
            value: "human"
          },
          {
            label: "\xC9l\u0151holtak",
            value: "undead"
          },
          {
            label: "Fap\xE1sztorok",
            value: "wose"
          },
          {
            label: "Farkasok",
            value: "wolf"
          },
          {
            label: "Griffek",
            value: "gryphon"
          },
          {
            label: "Gy\xEDkok",
            value: "saurian"
          },
          {
            label: "Koboldok",
            value: "goblin"
          },
          {
            label: "Lovak",
            value: "horse"
          },
          {
            label: "Mechanikus",
            value: "mechanical"
          },
          {
            label: "Nag\xE1k",
            value: "naga"
          },
          {
            label: "Ogr\xE9k",
            value: "ogre"
          },
          {
            label: "Orkok",
            value: "orc"
          },
          {
            label: "Perzsek\xE9nyek",
            value: "drake"
          },
          {
            label: "Sell\u0151k",
            value: "merfolk"
          },
          {
            label: "S\xF3lymok",
            value: "falcon"
          },
          {
            label: "Sz\xF6rnyek",
            value: "monster"
          },
          {
            label: "T\xF6rp\xF6k",
            value: "dwarf"
          },
          {
            label: "Trollok",
            value: "troll"
          },
          {
            label: "T\xFCnd\xE9k",
            value: "elf"
          }
        ],
        validation: { isRequired: true }
      }),
      race: (0, import_fields.image)({ storage: "images" })
    }
  }),
  // this last list is our Tag list, it only has a name field for now
  Tag: (0, import_core.list)({
    access: import_access.allowAll,
    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true
    },
    // this is the fields for our Tag list
    fields: {
      name: (0, import_fields.text)(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: (0, import_fields.relationship)({ ref: "Post.tags", many: true })
    }
  })
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  // this is a GraphQL query fragment for fetching what data will be attached to a context.session
  //   this can be helpful for when you are writing your access control functions
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  sessionData: "name createdAt",
  secretField: "password",
  // WARNING: remove initFirstItem functionality in production
  //   see https://keystonejs.com/docs/config/auth#init-first-item for more
  initFirstItem: {
    // if there are no items in the database, by configuring this field
    //   you are asking the Keystone AdminUI to create a new user
    //   providing inputs for these fields
    fields: ["name", "email", "password"]
    // it uses context.sudo() to do this, which bypasses any access control you might have
    //   you shouldn't use this in production
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core2.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "mysql",
      url: "mysql://wesnoth:2kkm1NOH@127.0.0.1:3306/wesnoth"
    },
    lists,
    session,
    storage: {
      images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images"
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/images"
      }
      /** more storage */
    }
  })
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});