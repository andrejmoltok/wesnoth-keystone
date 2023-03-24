// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { group, list } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';

import { isSignedIn, permissions, rules } from './access';

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  relationship,
  password,
  timestamp,
  image,
  select,
  checkbox,
} from '@keystone-6/core/fields';

// the document field is a more complicated field, so it has it's own package
import { document } from '@keystone-6/fields-document';
// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    access: {
      operation: {
        ...allOperations(isSignedIn),
        create: (session) => rules.canCreate(session),
        query: (session) => rules.canRead(session),
        update: (session) => rules.canUpdate(session),
        delete: (session) => rules.canDelete(session),
      },
    },
    ui: {
      hideCreate: (session) => rules.canCreate(session),
      hideDelete: (session) => rules.canDelete(session),
    },

    // this is the fields for our User list
    fields: {
      
      name: text({
        validation: { isRequired: true },
        access: {
          update: (session) => rules.canUpdate(session),
        }, }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: 'unique',
      }),

      password: password({
        validation: { isRequired: true } }),

      race: relationship({ 
        ref: 'Race', many: false,
        ui: {
          description: 'Can only be changed by admins',
        },
        access: {
          update: permissions.isAdmin,
        }
      }),

      isAdmin: checkbox({
        defaultValue: false,
        access: {
          update: permissions.isAdmin
        },
      }),
      isEditor: checkbox({
        defaultValue: false,
        access: {
          update: permissions.isAdmin
        },
      }),
      isUser: checkbox({
        defaultValue: false,
        access: {
          update: (session) => rules.canUpdate(session),
        },
      }),
      isPending: checkbox({
        defaultValue: false,
        access: {
          update: (session) => rules.canUpdate(session),
        },
      }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below
      posts: relationship({ ref: 'Post.author', many: true }),

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Post: list({
    access: {
      operation: {
        ...allOperations(isSignedIn),
        query: (session) => rules.canRead(session),
        update: (session) => rules.canUpdate(session),
        delete: (session) => rules.canDelete(session),
      }
    },

    // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),

      content: document({
        formatting: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
          [2, 1],
          [1, 2],
          [1, 2, 1],
        ],
        links: true,
        dividers: true,
      }),

      // with this field, you can set a User as the author for a Post
      author: relationship({
        // we could have used 'User', but then the relationship would only be 1-way
        ref: 'User.posts',

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
        },

        // a Post can only have one author
        //   this is the default, but we show it here for verbosity
        many: false,
      }),

      // with this field, you can add some Tags to Posts
      tags: relationship({
        // we could have used 'Tag', but then the relationship would only be 1-way
        ref: 'Tag.posts',

        // a Post can have many Tags, not just one
        many: true,

        // this is some customisations for changing how this will look in the AdminUI
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),
    },
  }),

  Race: list({
    access: {
      operation: {
        ...allOperations(isSignedIn),
        query: (session) => rules.canRead(session),
        update: (session) => rules.canUpdate(session),
        delete: (session) => rules.canDelete(session),
      }
    },
    ui: {
      hideCreate: (session) => rules.canCreate(session),
      hideDelete: (session) => rules.canDelete(session),
    },
    fields: {
      name: text({
        isIndexed: 'unique',
        hooks: {
          resolveInput: ({operation,resolvedData,inputData}) => {
            if (operation === 'create' || operation === 'update') {
              return inputData.races
            }
            return resolvedData.name
          }
        }
      }),
      races: select({
        type: 'string',
        defaultValue: '',
        db: { map: 'race'},
        options: [
          {
            label: 'Denevérek',
            value: 'bat',
          },
          {
            label: 'Dűnék-népe',
            value: 'dunefolk',
          },
          {
            label: 'Emberek',
            value: 'human',
          },
          {
            label: 'Élőholtak',
            value: 'undead',
          },
          {
            label: 'Fapásztorok',
            value: 'wose',
          },
          {
            label: 'Farkasok',
            value: 'wolf',
          },
          {
            label: 'Griffek',
            value: 'gryphon',
          },
          {
            label: 'Gyíkok',
            value: 'saurian',
          },
          {
            label: 'Koboldok',
            value: 'goblin',
          },
          {
            label: 'Lovak',
            value: 'horse',
          },
          {
            label: 'Mechanikus',
            value: 'mechanical',
          },
          {
            label: 'Nagák',
            value: 'naga',
          },
          {
            label: 'Ogrék',
            value: 'ogre',
          },
          {
            label: 'Orkok',
            value: 'orc',
          },
          {
            label: 'Perzsekények',
            value: 'drake',
          },
          {
            label: 'Sellők',
            value: 'merfolk',
          },
          {
            label: 'Sólymok',
            value: 'falcon',
          },
          {
            label: 'Szörnyek',
            value: 'monster',
          },
          {
            label: 'Törpök',
            value: 'dwarf',
          },
          {
            label: 'Trollok',
            value: 'troll',
          },
          {
            label: 'Tündék',
            value: 'elf',
          },
        ],
        validation: { isRequired: true }
      }),
      image: image({storage: 'images'}),
    }
  }),

  // this last list is our Tag list, it only has a name field for now
  Tag: list({
    access: {
      operation: {
        ...allOperations(isSignedIn),
      }
    },

    // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
    ui: {
      isHidden: true,
    },

    // this is the fields for our Tag list
    fields: {
      name: text(),
      // this can be helpful to find out all the Posts associated with a Tag
      posts: relationship({ ref: 'Post.tags', many: true }),
    },
  }),
};
