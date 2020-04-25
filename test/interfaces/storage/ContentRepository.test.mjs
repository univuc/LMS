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

import resolve, {init} from '../../../lib/common/di/resolve';
import modules from '../../../lib/common/di/modules';
import ContentRepository from '../../../lib/domain/repositories/ContentRepository';
import getEnv from '../../../lib/common/utils/env';

beforeAll(async () => {
    await init(modules, true);
});

describe('# Assignments', () => {
    const doTest = async function(courseId) {
        const contentRepository = resolve(ContentRepository);

        const assignments = await contentRepository.getAssignmentsWithStatuses(getEnv('TEST_ID'), courseId);

        console.log(assignments);
    };

   it('should get all assignments with statuses: 1', async () => {
        await doTest(26277);
   }, 10000);

    it('should get all assignments with statuses: 2', async () => {
        await doTest(27020);
    }, 10000);

    it('should get all assignments with statuses: 3', async () => {
        await doTest(26590);
    }, 10000);
});

describe('# Clips', () => {
    const doTest = async function(courseId) {
        const contentRepository = resolve(ContentRepository);

        const clips = await contentRepository.getClipsWithStatuses(getEnv('TEST_ID'), courseId);

        console.log(clips);
    };

    it('should get clips with statuses: vod', async () => {
        await doTest(26277);
    }, 10000);

    it('should get clips with statuses: econtents', async () => {
        await doTest(27020);
    }, 10000);

    it('should get clips with statuses: xncommons', async () => {
        await doTest(26590);
    }, 10000);
});
