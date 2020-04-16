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

import SlackRepository from '../../domain/repositories/SlackRepository';
import api from '@slack/web-api';
import config from '../../../config';
import logger from '../../common/utils/logger';
import SlackUser from '../../domain/entities/SlackUser';

class SlackRepositoryImpl extends SlackRepository {
    constructor() {
        super();

        this.webApi = new api.WebClient(config.slack_token);
    }

    async getUserById(id) {
        const result = await this.webApi.users.info({user: id});
        if (!result.ok) {
            logger.warn('Slack API fail');
            return;
        }

        const rawUser = result.user;

        return new SlackUser({
            id: rawUser.id,
            name: rawUser.name,
            realName: rawUser.real_name,
            displayName: rawUser.profile.display_name,

            isPrimaryOwner: rawUser.is_primary_owner,
            isAdmin: rawUser.is_admin,
            isOwner: rawUser.isOwner,
            isBot: rawUser.is_bot || member.id === 'USLACKBOT',
        });
    }

    async writeToChannel(channelId, text) {
        return await this.webApi.chat.postMessage({
            channel: channelId,
            text: text,
        });
    }
}

export default SlackRepositoryImpl;
