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

import ContentsRepository from '../../domain/repositories/ContentsRepository';
import cheerio from 'cheerio';
import Course from '../../domain/entities/Course';
import Assignment from '../../domain/entities/Assignment';
import config from '../../../config';
import Clip from '../../domain/entities/Clip';

class ContentsRepositoryImpl extends ContentsRepository {
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

    async getCourses(userId) {
        const agent = await this._getAgentOrThrow(userId);

        let $ = cheerio.load(await agent.getHome());

        const lectures = [];

        $('ul.my-course-lists.coursemos-layout-0')
            .find('li.course_label_re')
            .find('div.course_box')
            .find('a.course_link')
            .each((i, obj) => {
                $ = cheerio.load(obj);

                const id = Number($('a.course_link')
                    .attr('href')
                    .match(/id=([0-9]+)/)[1]);

                const title = $('div.course-name')
                    .find('div.course-title')
                    .find('h3')
                    .contents()
                    .first()
                    .text()
                    .split(' ')[0];

                lectures[i] = new Course({id, title});
            });

        return lectures;
    }

    async getAssignments(userId, courseId) {
        const instances = await this._getActivityInstanceOfType$(userId, courseId, [
            config.type.assignment,
        ]);

        return instances.map((instance) => new Assignment(instance));
    }

    async getClips(userId, courseId) {
        const instances = await this._getActivityInstanceOfType$(userId, courseId, [
            config.type.vod,
            config.type.econtents,
            config.type.xncommons,
        ]);

        return instances.map((instance) => new Clip(instance));
    }

    async _getActivityInstanceOfType$(userId, courseId, types) {
        const agent = await this._getAgentOrThrow(userId);

        let $ = cheerio.load(await agent.getCourse(courseId));

        const instances = [];

        $('div.activityinstance')
            .filter((i, obj) => this._isOneOfTypes(obj, types))
            .each((i, obj) => {
                $ = cheerio.load(obj);

                instances[i] = {
                    id: this._getActivityId($),
                    courseId: courseId,
                    type: this._getActivityType($),
                    title: this._getActivityTitle($),
                    dueStart: this._getActivityDueStart($),
                    dueEnd: this._getActivityDueEnd($),
                    runningTime: this._getActivityRunningTime($),
                };
            });

        return instances;
    }

    _isOneOfTypes(obj, types) {
        const $ = cheerio.load(obj);

        const altText = $('a')
            .find('img.activityicon')
            .attr('alt');

        for (const type of types) {
            if (altText === type) {
                return true;
            }
        }

        return false;
    }

    _getActivityId($) {
        return Number($('a')
            .attr('href')
            .match(/id=([0-9]+)/)[1]);
    }

    _getActivityType($) {
        const altText = $('a')
            .find('img.activityicon')
            .attr('alt');

        for (const key of Object.keys(config.type)) {
            if (config.type[key] === altText) {
                return key;
            }
        }

        return 'unknown';
    }

    _getActivityTitle($) {
        return $('a')
            .find('span.instancename')
            .contents()
            .first()
            .text();
    }

    _getActivityDueStart($) {
        return this._getActivityDueAndRunningTime($).dueStart;
    }

    _getActivityDueEnd($) {
        return this._getActivityDueAndRunningTime($).dueEnd;
    }

    _getActivityRunningTime($) {
        return this._getActivityDueAndRunningTime($).runningTime;
    }

    _getActivityDueAndRunningTime($) {
        const dueAndProbablyRunningTime = $('span.displayoptions')
            .contents()
            .text();

        const matched = dueAndProbablyRunningTime
            .match(/([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}) ~ ([0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2})(.*지각.*([0-9]{2}:[0-9]{2}))?/);

        return {
            dueStart: new Date(matched[1]),
            dueEnd: new Date(matched[2]),
            runningTime: this._convertMinuteAndSecondStringToSeconds(matched[4]),
        };
    }

    _convertMinuteAndSecondStringToSeconds(mmssString) {
        if (mmssString) {
            const runningTimeMinutesAndSeconds = mmssString
                .split(':')
                .map((str) => Number(str));

            return runningTimeMinutesAndSeconds[0]*60 + runningTimeMinutesAndSeconds[1];
        }
    }
}

export default ContentsRepositoryImpl;
