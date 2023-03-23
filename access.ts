import { ListAccessArgs } from './types';

export const isSignedIn = ({ session }: ListAccessArgs) => {
    return !!session;
};

export const permissions = {
    Admin: ({ session }: ListAccessArgs) => {//console.log('Admin',!!session?.data.role?.admin);
      return !!session?.data.role?.admin}, //false
    Szerkesztő: ({ session }: ListAccessArgs) => {//console.log('Editor',!!session?.data.role?.editor); 
      return !!session?.data.role?.editor}, //false
    Felhasználó: ({ session }: ListAccessArgs) => {//console.log('User',!!session?.data.role?.user); 
      return !!session?.data.role?.user}, //false
};

export const rules = {
    canCreate: ({ session }: ListAccessArgs) => {
      if (!session) {
        // No session? No people.
        return false;
      } else if (!!permissions.Admin(session)) {
        //console.log('Admin canCreate hidden false');
        // Can create everyone
        return false; //hidden
      } else {
        // cannot create
        //console.log('Editor-User canCreate hidden true');
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
        } else {
          return true;
        }
    },
    canDelete: ({ session }: ListAccessArgs) => {
      if (!session) {
        // No session? No people.
        return false;
      } else if (!!permissions.Admin(session)) {
        // Can delete everyone
        //console.log('Admin canDelete true');
        return true; //hidden
      } else if (!!permissions.Szerkesztő(session)) {
        //console.log('Editor cnaDelete false');
        return false; //hidden
      } else {
        //console.log('User canDelete false');
        return false; //hidden
      }
    }
}