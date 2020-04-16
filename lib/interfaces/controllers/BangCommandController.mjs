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

import resolve from '../../common/di/resolve';
import GetSlackUser from '../../domain/usecases/GetSlackUser';
import SlackCommand from '../../domain/entities/SlackCommand';
import HandleCommand from '../../domain/usecases/HandleCommand';
import SendChat from '../../domain/usecases/SendChat';

export default {

    /**
     * Bang command: handle and send reply with web api.
     */
    async handleCommand(message) {
        const {user, channel, text} = message;

        if (await isValidCommand(user, text)) {
            const slackCommand = new SlackCommand({
                userId: user,
                channelId: channel,
                args: extractArgs(text),
            });

            const reply = await resolve(HandleCommand).run({slackCommand});

            await resolve(SendChat).run({
                channelId: user, /* reply to user directly */
                text: reply,
            });
        }
    },

};

async function isValidCommand(slackUserId, text) {
    if (await isBot(slackUserId)) {
        return false;
    }

    return isCommandValid(text);
}

async function isBot(slackUserId) {
    const slackUser = await resolve(GetSlackUser).run({id: slackUserId});

    return slackUser.isBot;
}

function isCommandValid(text) {
    return text.trim().startsWith('!');
}

function extractArgs(text) {
    return text.trim().slice(1).split(' ');
}
