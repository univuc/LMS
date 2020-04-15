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
import Lecture from '../../domain/entities/Lecture';

class ContentsRepositoryImpl extends ContentsRepository {
    constructor({agentPool}) {
        super();

        this.agentPool = agentPool;
    }

    async getLectures(userId) {
        const agent = await this._getAgentOrThrow(userId);

        let $ = cheerio.load(await agent.get('/'));

        const lectures = [];

        $('ul.my-course-lists.coursemos-layout-0')
            .find('li.course_label_re')
            .find('div.course_box')
            .find('a.course_link')
            .each((i, obj) => {
                $ = cheerio.load(obj);
                lectures[i] = new Lecture({
                    id: Number($('a.course_link')
                        .attr('href')
                        .match(/id=([0-9]+)/)[1]),
                    title: $('div.course-name')
                        .find('div.course-title > h3')
                        .contents()
                        .first()
                        .text()
                        .split(' ')[0],
                });
            });

        return lectures;
    }

    async getAssignments(userId, lectureId) {

    }

    async getClips(userId, lectureId) {

    }

    async _getAgentOrThrow(userId) {
        const agent = await this.agentPool.getAgent(userId);
        if (!agent) {
            throw new Error(`No LMS agent for ${userId}. Credential not supplied`);
        }

        return agent;
    }
}

export default ContentsRepositoryImpl;
