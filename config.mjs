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
    port: getEnv('LMS_PORT') || 21101,

    slack: {
        token: getEnv('LMS_SLACK_TOKEN') || 'token',
        signing_secret: getEnv('LMS_SLACK_SIGNING_SECRET') || 'secret',
    },

    base_url: 'https://cyber.inu.ac.kr',
    kicked_url: 'https://cyber.inu.ac.kr/login.php',

    path: {
        login: '/login/index.php',

        view: {
            course: '/course/view.php',
            assignment: '/mod/assign/view.php',
            vod: '/mod/vod/viewer.php',
            econtents: '/mod/econtents/viewer.php',
            xncommons: '/mod/xncommons/viewer.php',
        },

        action: {
            vod: '/mod/vod/action.php',
            econtents: '/mod/econtents/action.php',
            xncommons: '/webservice/rest/server.php',
        },
    },

    type: {
        assignment: '과제',
        vod: '동영상',
        econtents: '이러닝콘텐츠',
        xncommons: '콘텐츠 CMS',
    },

    assignments: {
        cleared_label: '제출 완료',
        not_cleared_label: '제출 안 함',
    },

    clips: {
        threshold_progress: 87,
        target_progress: 92,
    },

    agent: {
        max_retry: 5,
    },
};

