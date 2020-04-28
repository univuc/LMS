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

import stackTrace from 'stack-trace';
import winston from 'winston';
import getArg from './args';

const format = winston.format;

// Format for those written to file.
const fileFormat = format.printf((info) => `${info.timestamp} ${info.level}: ${info.message.trim()}`);

// Transport to console.
const consoleTransport = new winston.transports.Console({
    format: format.combine(format.colorize(), fileFormat),
});

// Get a logger with prefix(to be used as a directory name)
function getLogger(prefix) {
    const logger = winston.createLogger({
        level: getArg('log-level') || 'verbose',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss',
            }),
            format.json(),
        ),
        transports: [
            consoleTransport,
        ],
    });

    return logger;
}

// Extract an adequate string from an object.
function stringify(object) {
    if (object.stack) {
        // For error objects.
        return object.stack;
    } else if (object.toString) {
        // For those who can be string.
        return object.toString();
    } else if (object) {
        // For an object.
        return JSON.stringify(object);
    } else {
        // Invalid.
        return typeof object;
    }
}

// Format a log, using stack trace to extract a caller info.
function formatLog(message, showCaller=true) {
    const caller = stackTrace.get()[2]; /* to get a real caller */

    if (showCaller) {
        return `${caller.getFileName().split('/').pop()}:${caller.getFunctionName()}:${caller.getLineNumber()}:${caller.getColumnNumber()}: ${stringify(message)}`;
    } else {
        return `${stringify(message)}`;
    }
}

// All loggers here.
const loggers = {
    event: getLogger('event'),
    verbose: getLogger('verbose'),
    info: getLogger('info'),
    warn: getLogger('warn'),
    error: getLogger('error'),
};

export default {

    event(message) {
        loggers.event.info(
            formatLog(message, false),
        );
    },

    verbose(message) {
        loggers.verbose.verbose(
            formatLog(message),
        );
    },

    info(message) {
        loggers.info.info(
            formatLog(message),
        );
    },

    warn(message) {
        loggers.warn.warn(
            formatLog(message),
        );
    },

    error(message) {
        loggers.error.error(
            formatLog(message),
        );
    },

};
