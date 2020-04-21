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
import Agent from './Agent';

// eslint-disable-next-line no-unused-vars
import String from '../../common/extensions/String';

/**
 * LMS specific HTTP client with automatic authentication.
 */
class LmsAgent extends Agent {
    constructor({user}) {
        super();
        this.baseUrl = config.base_url;

        this.user = user;
    }

    async getHome() {
        return await this.get('/');
    }

    async getCourse(courseId) {
        return await this.get(config.path.view.course.withSearchParam('id', courseId));
    }

    async getAssignment(assignmentId) {
        return await this.get(config.path.view.assignment.withSearchParam('id', assignmentId));
    }

    async getVod(clipId) {
        return await this.get(config.path.view.vod.withSearchParam('id', clipId));
    }

    async getEcontents(clipId) {
        return await this.get(config.path.view.econtents.withSearchParam('id', clipId));
    }

    async getXncommons(clipId) {
        const result = await this.get(config.path.view.xncommons.withSearchParam('id', clipId));

        return await this.populateIframe(result, 1);
    }

    async postVodStart({track}) {
        return await this.postVod({
            track: track,
            state: 3,
            position: 0,
        });
    };

    async postVodUpdate({track, position}) {
        return await this.postVod({
            track: track,
            state: 99,
            position: position,
        });
    }

    async postVod({track, state, position}) {
        const payload = {
            type: 'vod_track_for_onwindow',
            track: track,
            state: state,
            position: position,
            attempts: 1,
            interval: 60,
        };

        return await this.postWithXhr(config.path.action.vod, payload);
    }

    async postEcontentsStart({track}) {
        return await this.postEcontents({
            track: track,
            state: 3,
            position: 0,
        });
    }

    async postEcontentsUpdate({track, position}) {
        return await this.postEcontents({
            track: track,
            state: 99,
            position: position,
        });
    }

    async postEcontents({track, state, position}) {
        const payload = {
            type: 'track_for_onwindow',
            track: track,
            state: state,
            position: position,
            attempts: 1,
            interval: 60,
        };

        return await this.postWithXhr(config.path.action.vod, payload);
    }


    async postXncommons() {

    }

    async postWithXhr(path, body) {
        const headers = {
            'X-Requested-With': 'XMLHttpRequest',
        };

        return await this.post(path, body, headers);
    }

    isNotAuthenticated(options, response) {
        const originalUrl = options.url;
        const lastRequestUrl = response.config.url;

        const isRedirected = originalUrl !== lastRequestUrl;
        const isRedirectedToLoginPage = lastRequestUrl.startsWith(config.kicked_url);

        return isRedirected && isRedirectedToLoginPage;
    }

    async performLogin() {
        const payload = {
            username: this.user.id,
            password: this.user.password,
        };

        const options = this.getOptions('POST', config.path.login, {}, payload);
        const response = await this.axiosInstance.request(options);

        logger.info('Login performed');

        if (this.isNotAuthenticated(options, response)) {
            throw new Error('Wrong auth!');
        }
    }
}

export default LmsAgent;

