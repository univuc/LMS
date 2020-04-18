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
import ContentStatusRepository from '../../../lib/domain/repositories/ContentStatusRepository';
import Clip from '../../../lib/domain/entities/Clip';
import getEnv from '../../../lib/common/utils/env';
import modules from '../../../lib/common/di/modules';

beforeAll(async () => {
    await init(modules, true);
});

describe('# Check assignment', () => {
    it('should check assignments', async () => {
        expect(1).toBe(1);
    });
});

describe('# Check vod clip', () => {
    const statusRepo = resolve(ContentStatusRepository);

    const clip = new Clip({

    });
});

describe('# Check xncommons clip', () => {
    it('should check 100% completed xncommons clip', async () => {
        const statusRepo = resolve(ContentStatusRepository);

        const clip = new Clip({
            id: 239992,
            courseId: 26590,
            type: 'xncommons',
            title: '비판적사고력연습 4장 1부',
            runningTime: 1628,
            dueStart: new Date('2020-04-06T15:00:00.000Z'),
            dueEnd: new Date('2020-04-13T14:59:59.000Z'),
        });

        const result = await statusRepo.isClipCleared(getEnv('TEST_ID'), clip);

        expect(result).toBe(true);
    });

    it('should check over 90% completed xncommons clip', async () => {
        const statusRepo = resolve(ContentStatusRepository);

        const clip = new Clip({
            id: 208850,
            courseId: 26590,
            type: 'xncommons',
            title: '비판적사고력연습 1장 2부',
            runningTime: 2645,
            dueStart: new Date('2020-03-16T15:00:00.000Z'),
            dueEnd: new Date('2020-03-30T14:59:59.000Z'),
        });

        const result = await statusRepo.isClipCleared(getEnv('TEST_ID'), clip);

        expect(result).toBe(true);
    });
});
