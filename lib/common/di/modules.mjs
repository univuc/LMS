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

import ContentRepositoryImpl from '../../interfaces/storage/ContentRepositoryImpl';
import ContentRepository from '../../domain/repositories/ContentRepository';
import AgentPool from '../../domain/pool/AgentPool';
import UserRepositoryImpl from '../../interfaces/storage/UserRepositoryImpl';
import UserRepository from '../../domain/repositories/UserRepository';

export default [

    /** Pool */
    {
        create: async (r) => new AgentPool({
            userRepository: await r(UserRepository),
        }),
        as: AgentPool,
    },

    /** Repository */
    {
        create: async (r) => new UserRepositoryImpl(),
        as: UserRepository,
    },
    {
        create: async (r) => new ContentRepositoryImpl({
            agentPool: await r(AgentPool),
        }),
        as: ContentRepository,
    },

];
