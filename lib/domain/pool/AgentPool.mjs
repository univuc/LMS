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

import LmsAgent from '../../infrastructure/http/LmsAgent';
import logger from '../../common/utils/logger';

class AgentPool {
    constructor({userRepository}) {
        this.userRepo = userRepository;
        this.pool = new Map(); /* userId to agent */
    }

    async getAgent(userId) {
        const agentFound = this.pool.get(userId);

        if (agentFound) {
            return agentFound;
        }

        const user = await this.userRepo.getUserById(userId);

        if (!user) {
            logger.warn(`Tried to get agent for user ${userId} but credential does not exist`);
            return null;
        }

        return this._createNewAgent(user);
    }

    _createNewAgent(user) {
        const newAgent = new LmsAgent({user});
        this.pool.set(user.id, newAgent);

        return newAgent;
    }
}

export default AgentPool;
