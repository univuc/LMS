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

import LmsAgent from '../../../lib/infrastructure/http/LmsAgent';
import User from '../../../lib/domain/entities/User';
import getEnv from '../../../lib/common/utils/env';

describe('# Get', () => {
    const getAgent = () => {
        const user = new User({
            id: getEnv('TEST_ID'),
            password: getEnv('TEST_PW'),
        });

        return new LmsAgent({user});
    };

    it('should get lecture home', async () => {
        const agent = getAgent();

        await expect(agent.get('/course/view.php?id=26093')).resolves.not.toThrow();
    });

    it('should get clip viewer', async () => {
        const agent = getAgent();

        await expect(agent.get('/mod/xncommons/view.php?id=249997')).resolves.not.toThrow();
    });
});
