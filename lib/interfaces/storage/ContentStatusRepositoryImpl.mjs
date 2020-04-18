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

import ContentStatusRepository from '../../domain/repositories/ContentStatusRepository';
import logger from '../../common/utils/logger';
import config from '../../../config';
import cheerio from 'cheerio';

class ContentStatusRepositoryImpl extends ContentStatusRepository {
    constructor({agentPool}) {
        super();

        this.agentPool = agentPool;
    }

    async _getAgentOrThrow(userId) {
        if (!userId) {
            throw new Error(`User ID for agent should be valid`);
        }

        const agent = await this.agentPool.getAgent(userId);

        if (!agent) {
            throw new Error(`No LMS agent for ${userId}. Credential not supplied`);
        }

        return agent;
    }

    async isAssignmentCleared(userId, assignment) {
        const agent = await this._getAgentOrThrow(userId);

        const viewerHtml = await agent.getAssignment(assignment.id);

        const status = this._getAssignmentStatusString(viewerHtml);

        switch (status) {
            case config.assignments.cleared_label: return true;
            case config.assignments.not_cleared_label: return false;
            default:
                logger.error('No status label on assignment page');
                return null;
        }
    }

    _getAssignmentStatusString(viewerHtml) {
        const $ = cheerio.load(viewerHtml);

        return $('table.generaltable')
            .find('tbody')
            .find('tr')
            .first()
            .find('td')
            .last()
            .text();
    }

    async isClipCleared(userId, clip) {
        return await this.getClipProgress(userId, clip) > config.clips.threshold_progress;
    }

    async getClipProgress(userId, clip) {
        const agent = await this._getAgentOrThrow(userId);

        switch (clip.type) {
            case 'vod': return await this._getVodProgress(agent, clip);
            case 'econtents': return await this._getEcontentsProgress(agent, clip);
            case 'xncommons': return await this._getXncommonsProgress(agent, clip);
        }
    }

    async _getVodProgress(agent, clip) {
        const viewerHtml = await agent.getVod(clip.id);

        return this._getProgressRate(viewerHtml, clip);
    }

    async _getEcontentsProgress(agent, clip) {
        const viewerHtml = await agent.getEcontents(clip.id);

        return this._getProgressRate(viewerHtml, clip);
    }

    _getProgressRate(viewerHtml, clip) {
        const progressSec = this._findBeforeProgressTimeSec(viewerHtml);

        const progress = (progressSec / clip.runningTime) * 100;

        logger.verbose(`Clip ${clip.id}(${clip.type}) is ${progress}% completed`);

        return progress;
    }

    _findBeforeProgressTimeSec(viewerHtml) {
        return Number(viewerHtml.match(/var[ ]+before_progress[ ]*=[ ]*([+-]?[0-9]+);?/)[1]);
    }

    async _getXncommonsProgress(agent, clip) {
        const viewerHtml = await agent.getXncommons(clip.id);

        const startAt = Number(viewerHtml.match(/startat=(-?[0-9]+)/)[1]);
        const endAt = Number(viewerHtml.match(/endat=(-?[0-9]+)/)[1]);

        const is100PercentFinished = startAt === 0 && endAt === -9999;
        if (is100PercentFinished) {
            logger.verbose(`Clip ${clip.id}(${clip.type}) is 100% completed`);
            return true;
        }

        const progress = (startAt / clip.runningTime) * 100;
        logger.verbose(`Clip ${clip.id}(${clip.type}) is ${progress}% completed`);

        return progress;
    }

    async clearClip(userId, clip) {
        // see https://github.com/orgs/univuc/projects/1

        const agent = await this._getAgentOrThrow(userId);

        switch (clip.type) {
            case 'vod': return await this._clearVod(agent, clip);
            case 'econtents': return await this._clearEcontents(agent, clip);
            case 'xncommons': return await this._clearXncommons(agent, clip);
        }
    }

    async _clearVod(agent, clip) {

    }

    async _clearEcontents(agent, clip) {

    }

    async _clearXncommons(agent, clip) {

    }
}

export default ContentStatusRepositoryImpl;
