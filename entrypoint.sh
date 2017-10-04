#!/bin/sh

: ${NODE_ENV:=development}

# app only starts after database is available and migrated
sleep 10
until sequelize db:migrate; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 5
done

echo "Updating permissions..."
chown -Rf node:node /src /usr/local/lib/node_modules
echo "Executing process..."
exec su-exec node:node /sbin/tini -- "$@"
