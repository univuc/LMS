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

class DateRange {
    constructor({start, end}={}) {
        this.start = start || new Date(0);
        this.end = end || new Date();
    }

    containsTimePoint(date) {
        const overLowerBound = this.start.getTime() <= date.getTime();
        const underUpperBound = date.getTime() <= this.end.getTime();

        return overLowerBound && underUpperBound;
    }

    containsPeriod(periodStart, periodEnd) {
        return this.containsTimePoint(periodStart) || this.containsTimePoint(periodEnd);
    }
}

export default DateRange;
