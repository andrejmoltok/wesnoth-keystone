import { list, graphql } from '@keystone-6/core';
import { allOperations } from '@keystone-6/core/access';
import { isSignedIn, permissions, rules } from './access';
import {
  text,
  relationship,
  password,
  timestamp,
  image,
  select,
  virtual,
  checkbox,
  integer
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import type { Lists } from '.keystone/types';


export const lists: Lists = {
  User: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
    },

    fields: {
      
      name: text({
        isIndexed: 'unique',
        validation: { isRequired: true },
        access: {
          update: (session) => rules.canUpdate(session),
        }, }),

      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
      }),

      password: password({
        validation: { isRequired: true } }),

      race: relationship({ 
        ref: 'Race',
        many: false,
        access: {
          read: () => true,
          update: (session) => rules.canUpdate(session),
        }
      }),

      coins: integer({
        defaultValue: 16,
        access: {
          create: () => false,
          read: () => true,
          update: () => true,
        }
      }),

      adminRole: select({
        type: 'string',
        defaultValue: '',
        access: {
          read: () => true,
          update: ({session}) => permissions.isAdmin(session),
        },
        // ui: {
        //   itemView: {
        //     fieldMode: ({ session }) => {
        //       if (!!session?.data.isEditor) {
        //         return "hidden";
        //       }
        //     }
        //   }
        // },
        options: [
          {
            label: 'Admin',
            value: 'Admin',
          },
          {
            label: 'Editor',
            value: 'Editor',
          },
        ],
      }),

      userRole: select({
        type: 'string',
        defaultValue: '',
        access: {
          read: () => true,
          update: (session) => rules.canUpdate(session),
        },
        options: [
          {
            label: 'User',
            value: 'User',
          },
          {
            label: 'Pending',
            value: 'Pending',
          },
        ],
      }),

      isAdmin: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.adminRole === 'Admin';
          }
        }),
      }),
      isEditor: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.adminRole === 'Editor';
          }
        }),
      }),
      isUser: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.userRole === 'User';
          }
        }),
      }),
      isPending: virtual({
        field: graphql.field({
          type: graphql.Boolean,
          resolve(item) {
            return item.userRole === 'Pending';
          }
        }),
      }),

      posts: relationship({ 
        ref: 'Post.author', 
        many: true,
        access: {
          update: (session) => permissions.isAdmin(session),
        }
      }),

      comments: relationship({
        ref: 'Comment.author',
        many: true,
        access: {
          update: (session) => permissions.isAdmin(session),
        }
      }),

      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
  }),

  Post: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      }
    },

    // this is the fields for our Post list
    fields: {
      title: text({ 
        isIndexed: 'unique',  
        validation: { isRequired: true } 
      }),

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

        many: false,
      }),

      isPublished: checkbox({
        defaultValue: false,
      }),



      comments: relationship({
        ref: 'Comment',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          removeMode: 'disconnect',
          linkToItem: true,
          inlineConnect: true,
        },
        many: true,
      }),

      tags: relationship({
        ref: 'Tag.posts',

        many: true,

        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),

      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    },
    
  }),

  Comment: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      }
    },
    ui: {
      hideDelete: (session) => rules.hideDeleteButton(session),
    },
    fields: {
      name: text({
        validation: { isRequired: true }
      }),
      content: document(),
      author: relationship({
        ref: 'User.comments',
        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          linkToItem: true,
          inlineConnect: true,
        },
        many: false,
      }),
      isDeleted: checkbox({
        defaultValue: false,
      }),
      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),
    }
  }),

  Race: list({
    access: {
      operation: {
        create: () => true,
        query: () => true,
        update: () => true,
        delete: () => true,
      },
    },
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
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

  Log: list({
    access: {
      operation: {
        create: () => true,
        query: (session) => (permissions.isAdmin(session) || permissions.isEditor(session)),
        update: () => false,
        delete: (session) => permissions.isAdmin(session),
      },
    },
    ui: {
      hideCreate: (session) => rules.hideCreateButton(session),
      hideDelete: (session) => rules.hideDeleteButton(session),
    },
    fields: {
      who: text({
        validation: { isRequired: true }
      }),
      what: document(),
      when: timestamp({
        defaultValue: { kind: 'now' },
      }),
    }
  }),
};
