import getArg, {getAllArgs} from '../../common/utils/args';
import resolve from '../../common/di/resolve';
import AgentPool from '../../domain/pool/AgentPool';
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

class LocalRunner {
    constructor({user, command}) {
        this.user = user;
        this.command = command;
    }

    async run(args) {
        const useCase = await this._findUseCase(this.command);
        if (!useCase) {
            logger.error(`Cannot find '${useCase}'. Exit`);
            return;
        }

        this._setUser(this.user);

        logger.info(`User ${this.user.id} is set`);
        logger.info(`Running '${this.command}' with ${JSON.stringify(args)} as user ${this.user.id}`);

        await useCase.run(args);

        logger.info(`Finished '${this.command}'`);
    }

    _setUser(user) {
        resolve(AgentPool).createNewAgent(user);
    }

    async _findUseCase(command) {
        try {
            const imported = await import(`../../domain/usecases/${command}`);
            return resolve(imported.default);
        } catch (e) {
            logger.error(`No such use case as '${command}'.`);
            return null;
        }
    }
}

export default LocalRunner;
