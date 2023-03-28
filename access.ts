import { ListAccessArgs } from './types';

export const isSignedIn = ({ session }: ListAccessArgs) => {
    return !!session;
};

export const permissions = {
    isAdmin: ({ session }: ListAccessArgs) => {//console.log('Admin',!!session?.data.isAdmin);
      return !!session?.data.isAdmin}, //false
    isEditor: ({ session }: ListAccessArgs) => {//console.log('Editor',!!session?.data.isEditor); 
      return !!session?.data.isEditor}, //false
    isUser: ({ session }: ListAccessArgs) => {//console.log('User', !!session?.data.isUser); 
      return !!session?.data.isUser}, //false
};

export const rules = {
    hideCreateButton: ({ session }: ListAccessArgs) => {
      if (!session) {
        // No session? No people.
        return false;
      } else if (!!session?.data.isAdmin) {
        //console.log('isAdmin ',!!session?.data.isAdmin);
        // Can create everyone
        return false; //hidden
      } else {
        // cannot create
        //console.log('isEditor, isUser ',!!session?.data.isEditor, !!session?.data.isUser);
        return true; //hidden
      }
    },
    canRead: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else {
          return true;
        }
    },
    canUpdate: ({ session }: ListAccessArgs) => {
        if (!session) {
          // No session? No people.
          return false;
        } else if (!!session?.data.isAdmin || !!session?.data.isEditor) {
          //console.log('canUpdate isAdmin isEditor, isUser ',!!session?.data.isAdmin, !!session?.data.isEditor, !!session?.data.isUser);
          return true;
        } else {
          return false;
        }
    },
    hideDeleteButton: ({ session }: ListAccessArgs) => {
      if (!session) {
        // No session? No people.
        return false;
      } else if (!!session?.data.isAdmin) {
        // Can delete everyone
        //console.log('isAdmin ',!!session?.data.isAdmin);
        return false; //hidden
      } else {
        //console.log('isEditor, isUser ',!!session?.data.isEditor, !!session?.data.isUser);
        return true; //hidden
      }
    }
}