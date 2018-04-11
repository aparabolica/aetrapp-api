// Feathers Hooks Common
const {
  discard,
  disallow,
  fastJoin,
  pluckQuery,
  preventChanges,
  iff,
  isProvider,
  keep,
  when
} = require("feathers-hooks-common");

// Auth hooks
const { authenticate } = require('@feathersjs/authentication').hooks;
const verifyHooks = require('feathers-authentication-management').hooks;
const { restrictToRoles } = require("feathers-authentication-hooks");
const { hashPassword } = require('@feathersjs/authentication-local').hooks;

// Helper hooks
const { setFirstUserToRole, sendVerificationEmail, doResolver } = require('../../hooks');

// General restrict hook
const restrict = [
  authenticate("jwt"),
  restrictToRoles({
    roles: ['admin'],
    idField: "id",
    ownerField: "id",
    owner: true
  })
];

const { findByEmail } = require("../../validations");

const trapResolver = {
  joins: {
    trapCount: (...args) => async (user, context) => {
      const traps = context.app.services['traps'];
      const queryResult = await traps.find({
        query: {
          $limit: 0,
          ownerId: user.id
        },
      })
      user.trapCount = queryResult.total
    }
  }
}

module.exports = {
  before: {
    all: [],
    find: [iff(!isProvider("server"), [pluckQuery("email"), findByEmail])],
    get: [...restrict],
    create: [
      hashPassword(),
      verifyHooks.addVerification(),
      setFirstUserToRole({ role: 'admin' }),
    ],
    update: [disallow('external')],
    patch: [
      ...restrict,
      iff(isProvider('external'), preventChanges(
        'password',
        'email',
        'isVerified',
        'verifyToken',
        'verifyShortToken',
        'verifyExpires',
        'verifyChanges',
        'resetToken',
        'resetShortToken',
        'resetExpires'
      ))
    ],
    remove: [...restrict]
  },

  after: {
    all: [
      when(
        hook => hook.params.provider,
        discard('password', '_computed', 'verifyExpires', 'resetExpires', 'verifyChanges')
      ),
    ],
    find: [
      iff(!isProvider("server"), keep("email")),
      iff(isProvider('external'), fastJoin(trapResolver))
    ],
    get: [iff(isProvider('external'), fastJoin(trapResolver))],
    create: [
      sendVerificationEmail(),
      verifyHooks.removeVerification(),
    ],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
