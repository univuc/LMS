/**
 * This file is part of Univuc/LMS.
 *
 * Copyright (C) 2020 Univuc <potados99@gmail.com>
 *
 * Univuc/LMS is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Univuc/LMS is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import logger from '../../common/utils/logger';
import config from '../../../config';

import hapi from '@hapi/hapi';
import inert from '@hapi/inert';
import basic from '@hapi/basic';
import scheme from './auth/scheme';
import validate from './auth/validate';

async function createServer() {
    const server = getServer();

    await setupServer(server);

    logger.info('Server created.');

    return server;
}

function getServer() {
    return hapi.server({
        port: config.port,
    });
}

async function setupServer(server) {
    await registerPlugins(server);
    await setWebAuth(server);
    await setSlackCommandAuth(server);
    await registerRoutes(server);
}

async function registerPlugins(server) {
    await server.register([
        inert,
    ]);
}

async function setWebAuth(server) {
    await server.register(basic);

    server.auth.strategy('web', 'basic', {validate: validate.getWebValidator()});
    server.auth.default('web');
}

async function setSlackCommandAuth(server) {
    const slackbotCommandScheme = (server, options) => {
        return {
            authenticate: scheme.getCommandAuthenticator(),
            payload: scheme.getCommandPayloadHandler(),
            options: {
                payload: true, /* explicitly say we use payload auth. */
            },
        };
    };

    server.auth.scheme('slackbot-command-scheme', slackbotCommandScheme);
    server.auth.strategy('command', 'slackbot-command-scheme');
}

async function registerRoutes(server) {
    await server.register([
        ((await import('./routes/command')).default),
    ]);
}

export default createServer;
