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

import logger from './logger';

class Scheduler {
    constructor() {
        this.tasks = new Map();
    }

    scheduleTimeout(doWhat, seconds, tag) {
        this._cancelTaskIfExists(tag);

        const task = setTimeout(function() {
            logger.info(`Task scheduled with tag ${tag} is now being executed`);
            doWhat();
        }, seconds * 1000);

        this.tasks.set(tag, task);
    }

    _cancelTaskIfExists(tag) {
        if (this.tasks.get(tag)) {
            this.cancel(tag);
        }
    }

    cancel(tag) {
        const task = this.tasks.get(tag);
        if (task) {
            clearTimeout(task);
            logger.info(`Task scheduled with tag ${tag} is canceled`);
        }
    }
}

export default Scheduler;
