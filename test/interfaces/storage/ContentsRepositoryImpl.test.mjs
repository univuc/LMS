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

describe('# Get courses', () => {
   it('should reach lms home', async () => {
      const contentsRepo = resolve(ContentRepository);

      const courses = await contentsRepo.getCourses(getEnv('TEST_ID'));

      courses.forEach((course) => {
         expect(course.id).toBeGreaterThanOrEqual(20000);
         expect(course.id).toBeLessThan(30000);
      });
   });
});

describe('# Get assignments', () => {
   it('should get assignments', async () => {
      const contentsRepo = resolve(ContentRepository);

      const courseId = 26590;
      const assignments = await contentsRepo.getAssignments(getEnv('TEST_ID'), courseId);

      assignments.forEach((assignment) => {
         expect(assignment.id).toBeGreaterThan(200000);
         expect(assignment.courseId).toBe(courseId);
      });
   });
});

describe('# Get clips', () => {
   it('should get clips', async () => {
      const contentsRepo = resolve(ContentRepository);

      const courseId = 26590;
      const clips = await contentsRepo.getClips(getEnv('TEST_ID'), 26590);

      clips.forEach((clip) => {
         expect(clip.id).toBeGreaterThan(200000);
         expect(clip.courseId).toBe(courseId);
      });
   });
});
