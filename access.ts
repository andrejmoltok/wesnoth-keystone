import { ListAccessArgs } from './types';

export const isSignedIn = ({ session }: ListAccessArgs) => {
    return !!session;
};

export const permissions = {
    admin: ({ session }: ListAccessArgs) => !!session?.data.role?.admin,
    editor: ({ session }: ListAccessArgs) => !!session?.data.role?.editor,
    user: ({ session }: ListAccessArgs) => !!session?.data.role?.user,
};

export const rules = {
    canReadPeople: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else if (session.data.role?.admin || session.data.role?.editor) {
          // Can see everyone
          return true;
        } else {
          // Can only see yourself
          return { id: { equals: session.itemId } };
        }
    },
    canUpdatePeople: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else if (session.data.role?.admin || session.data.role?.editor) {
          // Can update everyone
          return true;
        } else {
          // Can update yourself
          return { id: { equals: session.itemId } };
        }
      },
}