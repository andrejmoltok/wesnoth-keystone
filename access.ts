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
    canReadUpdate: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else if (session.data.role?.admin || session.data.role?.editor) {
          // Can see, update everyone
          return true;
        } else {
          // Can only see, update yourself
          return { id: { equals: session.itemId } };
        }
    },
    canDelete: ({ session }: ListAccessArgs) => {
      if (!session) {
        // No session? No people.
        return false;
      } else if (session.data.role?.admin) {
        // Can delete everyone
        return true;
      } else {
        return false;
      }
    }
}