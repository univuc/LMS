import DateRange from '../../common/utils/DateRange';
import logger from '../../common/utils/logger';

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

class ContentService {
    constructor({contentRepository, contentInfoRepository, contentStatusRepository}) {
        this.contentRepository = contentRepository;
        this.contentInfoRepository = contentInfoRepository;
        this.contentStatusRepository = contentStatusRepository;
    }

    async getClipsInDue(userId, courseId) {
        const clips = await this.contentRepository.getClipsWithStatuses(userId, courseId);

        const clipsInDue = clips.filter((clip) =>
            new DateRange({start: clip.dueStart, end: clip.dueEnd}).containsTimePoint(new Date()),
        );

        return clipsInDue.filter((clip) => !clip.isCleared);
    }

    async clearAllClips(userId, recentOnly) {
        const courses = await this.contentInfoRepository.getCourses(userId);

        for (const course of courses) {
            logger.info(`Clearing clips of ${course.title}`);

            await this.clearClips(userId, course.id, recentOnly);
        }
    }

    async clearClips(userId, courseId) {
        logger.info(`Getting clips in due for given course ${courseId}`);

        const clipsToClear = await this.getClipsInDue(userId, courseId);
        if (clipsToClear.length === 0) {
            logger.info(`Nothing to clear`);
            return;
        }

        logger.info(`Clips to clear:\n${clipsToClear.map((clip) => `- ${clip.title}\n`)}`);

        for (const clip of clipsToClear) {
            await this.contentStatusRepository.clearClip(userId, clip);
            logger.info(`${clip.title} cleared`);
        }
    }
}

export default ContentService;
