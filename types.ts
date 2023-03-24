export type Session = {
  itemId: string;
  listKey: string;
  data: {
    name: string;
    id: string;
    isAdmin: boolean;
    isEditor: boolean;
    isUser: boolean;
  };
};

export type ListAccessArgs = {
  itemId?: string;
  session?: Session;
};
