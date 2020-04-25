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

import SlackCommand from '../../domain/entities/SlackCommand';
import resolve from '../../common/di/resolve';
import HandleCommand from '../../domain/usecases/HandleCommand';

export default {

    /**
     * Slash command: handle and reply with 200 response.
     */
    async handleCommand(request, h) {
        // eslint-disable-next-line camelcase
        const {user_id, channel_id, text} = request.payload;

        const slackCommand = new SlackCommand({
            userId: user_id,
            channelId: channel_id,
            args: extractArgs(text),
        });

        const reply = await resolve(HandleCommand).run({slackCommand});

        return h.response({
            text: reply,
            response_type: 'ephemeral', /* reply of slash command is only available to user. */
        });
    },

};

function extractArgs(text) {
    return text.trim().split(' ');
}
