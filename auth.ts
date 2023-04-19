import { randomBytes } from 'crypto';
import { createAuth } from '@keystone-6/auth';

import { statelessSessions } from '@keystone-6/core/session';

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  sessionSecret = randomBytes(32).toString('hex');
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'name id isAdmin isEditor isUser',
  secretField: 'password',

  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
});

const sessionMaxAge = 60 * 60;

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!
});

export { withAuth, session };
