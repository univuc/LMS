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
import ContentsRepository from '../../../lib/domain/repositories/ContentsRepository';
import getEnv from '../../../lib/common/utils/env';

beforeAll(async () => {
   await init(modules);
});

describe('# Get lectures', () => {
   it('should reach lms home', async () => {
      const contentsRepo = resolve(ContentsRepository);

      const lectures = await contentsRepo.getLectures(getEnv('TEST_ID'));

      console.log(lectures);
   });
});
