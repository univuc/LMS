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

import config from '../../../config';
import crypto from 'crypto';

class SlackAuthenticator {
    authenticate(timestamp, requestBody, slackSignature) {
        return timestamp && requestBody && slackSignature &&
            this._checkTime(timestamp) &&
            this._checkSignature(timestamp, requestBody, slackSignature);
    }

    _checkTime(timeStamp) {
        const now = (Date.now() / 1000);
        const elapsedSec = now - timeStamp;

        return elapsedSec < 60 * 5;
    }

    _checkSignature(timestamp, requestBody, slackSignature) {
        const slackSigningSecret = config.slack_signing_secret;
        const sigBaseString = 'v0:' + timestamp + ':' + requestBody;

        const mySignature = crypto
            .createHmac('sha256', slackSigningSecret)
            .update(sigBaseString)
            .digest('hex');

        return slackSignature === mySignature;
    }
}

export default SlackAuthenticator;
