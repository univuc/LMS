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
import logger from '../../common/utils/logger';

import qs from 'qs';
import axiosInstance from '../../common/utils/axios';

export default {

    async get(path, headers={}) {
        const options = getOptions('GET', path, headers);

        return await request(options);
    },

    async post(path, body, headers={}) {
        const options = getOptions('POST', path, headers, body);

        return await request(options);
    },

};

function getOptions(method, path, headers={}, body={}) {
    return {
        method: method,
        url: new URL(path, config.base_url).toString(),
        headers: headers,
        data: qs.stringify(body),
    };
}

async function request(options) {
    let response = await axiosInstance.request(options);

    if (await acquireAuthIfNeeded(options, response)) {
        response = await axiosInstance.request(options);
    }

    return response.data;
}

async function acquireAuthIfNeeded(options, response) {
    if (isNotAuthenticated(options, response)) {
        await login();

        return true;
    }

    return false;
}

function isNotAuthenticated(options, response) {
    const originalUrl = options.url;
    const lastRequestUrl = response.config.url;

    const isRedirected = originalUrl !== lastRequestUrl;
    const isRedirectedToLoginPage = lastRequestUrl.startsWith(config.login_url);

    return isRedirected && isRedirectedToLoginPage;
}

async function login() {
    const payload = {
        username: '201701562',
        password: 'hi',
    };

    const options = getOptions('POST', '/login/index.php', {}, payload);
    const response = await axiosInstance.request(options);

    logger.info('Login performed');

    if (isNotAuthenticated(options, response)) {
        throw new Error('Wrong auth!');
    }
}
