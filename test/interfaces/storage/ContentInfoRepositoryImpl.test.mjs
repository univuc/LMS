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

import resolve, {init} from 'single-injector';
import modules from '../../../lib/common/di/modules';
import ContentInfoRepository from '../../../lib/domain/repositories/ContentInfoRepository';
import getEnv from '../../../lib/common/utils/env';

beforeAll(async () => {
   await init(modules, true);
});

describe('# Get courses', () => {
   it('should reach lms home', async () => {
      const contentsRepo = resolve(ContentInfoRepository);

      const courses = await contentsRepo.getCourses(getEnv('TEST_ID'));

      console.log(courses);

      courses.forEach((course) => {
         expect(course.id).toBeGreaterThanOrEqual(20000);
         expect(course.id).toBeLessThan(30000);
      });
   });
});

describe('# Get assignments', () => {
   it('should get assignments', async () => {
      const contentsRepo = resolve(ContentInfoRepository);

      const courseId = 26590;
      const assignments = await contentsRepo.getAssignments(getEnv('TEST_ID'), courseId);

      console.log(assignments);

      assignments.forEach((assignment) => {
         expect(assignment.id).toBeGreaterThan(200000);
         expect(assignment.courseId).toBe(courseId);
      });
   });
});

describe('# Get clips', () => {
   const doTest = async function(courseId) {
      const contentsRepo = resolve(ContentInfoRepository);

      const clips = await contentsRepo.getClips(getEnv('TEST_ID'), courseId);

      console.log(clips);

      clips.forEach((clip) => {
         expect(clip.id).toBeGreaterThan(100000);
         expect(clip.courseId).toBe(courseId);
         expect(clip.runningTime).toBeGreaterThan(1);
      });
   };

   it('should get clips: vod', async () => {
      await doTest(26277);
   });

   it('should get clips: econtents', async () => {
      await doTest(27020);
   });

   it('should get clips: xncommons', async () => {
      await doTest(26590);
   });

   it('should get clips: xncommons: 2', async () => {
      await doTest(28455);
   });
});
