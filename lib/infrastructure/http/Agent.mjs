import config from '../../../config';
import logger from '../../common/utils/logger';
import newAxiosInstance from '../../common/utils/axios';
import qs from 'qs';
import cheerio from 'cheerio';

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

/**
 * HTTP client with automatic authentication.
 */
class Agent {
    constructor() {
        this.axiosInstance = newAxiosInstance();
        this.baseUrl = '';
    }

    async get(path, headers={}) {
        const options = this.getOptions('GET', path, headers);
        const result = await this.request(options);

        logger.verbose(`Got ${path} successfully`);

        return result;
    }

    async post(path, body, headers={}) {
        const options = this.getOptions('POST', path, headers, body);

        return await this.request(options);
    }

    getOptions(method, path, headers={}, body={}) {
        return {
            method: method,
            url: new URL(path, this.baseUrl).toString(),
            headers: headers,
            data: qs.stringify(body),
        };
    }

    async request(options) {
        let response = await this.axiosInstance.request(options);

        if (await this.acquireAuthIfNeeded(options, response)) {
            response = await this.axiosInstance.request(options);
        }

        return response.data;
    }

    async acquireAuthIfNeeded(options, response) {
        if (this.isNotAuthenticated(options, response)) {
            await this.performLogin();

            return true;
        }

        return false;
    }

    /* abstract */ isNotAuthenticated(options, response) {
        throw new Error('Not implemented!');
    }

    /* abstract */ async performLogin() {
        throw new Error('Not implemented!');
    }

    async populateIframe(responseData, depthLimit) {
        const $ = cheerio.load(responseData);

        await this._populateChildIframesRecursively($, $('iframe'), depthLimit);

        logger.verbose('All iframes populated');

        return $.html();
    }

    async _populateChildIframesRecursively($, iframes$, depthLimit=0/* under zero for unlimited */, currentDepth=1 ) {
        if (depthLimit < 0 || (currentDepth > depthLimit)) {
            return;
        }

        if (iframes$.length === 0) {
            return;
        }

        await this._forEachIframesWithTheirData($, iframes$, async (iframe, data) => {
            $(iframe).html(data);

            await this._populateChildIframesRecursively($, $(iframe).find('iframe'), depthLimit, currentDepth+1);
        });
    }

    async _forEachIframesWithTheirData($, iframes$, body) {
        const promises = [];

        iframes$.each((i, iframe) => {
            const sourceUrl = $(iframe).attr('src');

            logger.verbose(`Populating iframe from ${sourceUrl}`);

            promises.push(this._fetchIframeAndDo(sourceUrl, iframe, body));
        });

        await Promise.all(promises);
    }

    async _fetchIframeAndDo(url, iframe, body) {
        this.request({
            method: 'GET',
            url: url,
        }).then(async (result) => {
            await body(iframe, result);
        });
    }
}

export default Agent;
