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

import getEnv from './lib/common/utils/env';

export default {
    port: getEnv('LMS_PORT') || 21100,

    slack_token: getEnv('LMS_SLACK_TOKEN') || 'token',
    slack_signing_secret: getEnv('LMS_SLACK_SIGNING_SECRET') || 'secret',

    web_id: getEnv('LMS_WEB_ID') || 'master',
    web_pw: getEnv('LMS_WEB_PW') || '1234',

    base_url: 'https://cyber.inu.ac.kr',
    kicked_url: 'https://cyber.inu.ac.kr/login.php',

    path: {
        login: '/login/index.php',
        course: '/course/view.php',
    },

    type: {
        assignment: '과제',
        vod: '동영상',
        econtents: '이러닝콘텐츠',
        xncommons: '콘텐츠 CMS',
    },
};

