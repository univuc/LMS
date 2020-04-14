import SlackAuthenticator from '../../../domain/auth/SlackAuthenticator';
import Boom from '@hapi/boom';
import query from '../../../common/utils/query';

/**
 * This file is part of Univuc/{appname}.
 *
 * Copyright (C) 2020 Univuc <potados99@gmail.com>
 *
 * Univuc/{appname}is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Univuc/{appname} is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

export default {

    getCommandAuthenticator() {
        return (request, h) => h.authenticated({credentials: {username: 'slackbot'}});
    },

    getCommandPayloadHandler() {
        return (request, h) => {
            const authenticator = new SlackAuthenticator();

            const timestamp = request.headers['X-Slack-Request-Timestamp'];
            const requestBody = request.payload.toString();
            const slackSignature = request.headers['X-Slack-Signature'];

            if (authenticator.authenticate(timestamp, requestBody, slackSignature)) {
                request.payload = parsePayload(request.payload); /* parse here! */

                return h.continue; /* fuck no docs fuck hapi */
            } else {
                throw Boom.unauthorized(null, 'slackbot-command-scheme');
            }
        };
    },

};

function parsePayload(payload) {
    return query.parseUrlencodedString(payload.toString());
}
