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

import ContentRepository from '../../domain/repositories/ContentRepository';

class ContentRepositoryImpl extends ContentRepository {
    constructor({contentInfoRepository, contentStatusRepository}) {
        super();

        this.contentInfoRepository = contentInfoRepository;
        this.contentStatusRepository = contentStatusRepository;
    }

    async getAssignmentsWithStatuses(userId, courseId) {
        const allAssignments = await this.contentInfoRepository.getAssignments(userId, courseId);

        await Promise.all(
            allAssignments.map((assignment) =>
                this._attachStatusToAssignment(userId, assignment),
            ),
        );

        return allAssignments;
    }

    async _attachStatusToAssignment(userId, assignment) {
        assignment.isCleared = await this.contentStatusRepository.isAssignmentCleared(userId, assignment);
    }

    async getClipsWithStatuses(userId, courseId) {
        const allClips = await this.contentInfoRepository.getClips(userId, courseId);

        await Promise.all(
            allClips.map((clip) =>
                this._attachStatusToClip(userId, clip),
            ),
        );

        return allClips;
    }

    async _attachStatusToClip(userId, clip) {
        clip.isCleared = await this.contentStatusRepository.isClipCleared(userId, clip);
    }
}

export default ContentRepositoryImpl;
