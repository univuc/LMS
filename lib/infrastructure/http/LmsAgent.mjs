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

class LmsAgent {
    constructor({user}) {
        this.user = user;
    }

    async get(path, headers={}) {
        const options = this.getOptions('GET', path, headers);

        return await this.request(options);
    }

    async getHome() {
        return await this.get('/');
    }

    async getCourse(courseId) {
        return await this.get(`${config.path.course}?id=${courseId}`);
    }

    async getAssignment(assignmentId) {
        // TODO
    }

    async getVod(clipId) {
        // TODO
    }

    async getEcontents(clipId) {
        // TODO
    }

    async getXncommons(clipId) {
        // TODO
    }

    async post(path, body, headers={}) {
        const options = this.getOptions('POST', path, headers, body);

        return await this.request(options);
    }

    getOptions(method, path, headers={}, body={}) {
        return {
            method: method,
            url: new URL(path, config.base_url).toString(),
            headers: headers,
            data: qs.stringify(body),
        };
    }

    async request(options) {
        let response = await axiosInstance.request(options);

        if (await this.acquireAuthIfNeeded(options, response)) {
            response = await axiosInstance.request(options);
        }

        return response.data;
    }

    async acquireAuthIfNeeded(options, response) {
        if (this.isNotAuthenticated(options, response)) {
            await this.login();

            return true;
        }

        return false;
    }

    isNotAuthenticated(options, response) {
        const originalUrl = options.url;
        const lastRequestUrl = response.config.url;

        const isRedirected = originalUrl !== lastRequestUrl;
        const isRedirectedToLoginPage = lastRequestUrl.startsWith(config.kicked_url);

        return isRedirected && isRedirectedToLoginPage;
    }

    async login() {
        const payload = {
            username: this.user.id,
            password: this.user.password,
        };

        const options = this.getOptions('POST', config.path.login, {}, payload);
        const response = await axiosInstance.request(options);

        logger.info('Login performed');

        if (this.isNotAuthenticated(options, response)) {
            throw new Error('Wrong auth!');
        }
    }
}

export default LmsAgent;

