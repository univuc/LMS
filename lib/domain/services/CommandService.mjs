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

class CommandService {
    async executeCommand(slackCommand) {
        const action = slackCommand.shift();
        let reply;

        switch (action) {
            case 'register': reply = await this._register(slackCommand); break;
            case 'deregister': reply = await this._deregister(slackCommand); break;
            case 'check': reply = await this._check(slackCommand); break;
            case 'watch': reply = await this._watch(slackCommand); break;
            default: reply = `${action}: 알 수 없는 명령입니다.`;
        }

        return reply;
    }

    async _register(slackCommand) {

    }

    async _deregister(slackCommand) {

    }

    async _check(slackCommand) {

    }

    async _watch(slackCommand) {

    }
}

export default CommandService;
