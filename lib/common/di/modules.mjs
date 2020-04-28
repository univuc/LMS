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

import ContentInfoRepositoryImpl from '../../interfaces/storage/ContentInfoRepositoryImpl';
import ContentInfoRepository from '../../domain/repositories/ContentInfoRepository';
import AgentPool from '../../domain/pool/AgentPool';
import UserRepositoryImpl from '../../interfaces/storage/UserRepositoryImpl';
import UserRepository from '../../domain/repositories/UserRepository';
import GetCourses from '../../domain/usecases/GetCourses';
import GetClips from '../../domain/usecases/GetClips';
import GetAssignments from '../../domain/usecases/GetAssignments';
import ContentStatusRepositoryImpl from '../../interfaces/storage/ContentStatusRepositoryImpl';
import ContentStatusRepository from '../../domain/repositories/ContentStatusRepository';
import SlackRepositoryImpl from '../../interfaces/storage/SlackRepositoryImpl';
import SlackRepository from '../../domain/repositories/SlackRepository';
import ContentRepositoryImpl from '../../interfaces/storage/ContentRepositoryImpl';
import ContentRepository from '../../domain/repositories/ContentRepository';
import Scheduler from '../utils/Scheduler';
import ClearClips from '../../domain/usecases/ClearClips';
import GetUser from '../../domain/usecases/GetUser';
import HandleCommand from '../../domain/usecases/HandleCommand';
import CommandService from '../../domain/services/CommandService';
import SendChat from '../../domain/usecases/SendChat';
import ContentService from '../../domain/services/ContentService';
import ClearAllClips from '../../domain/usecases/ClearAllClips';

export default [

    /** Use Cases */
    {
        create: async (r) => new ClearAllClips({
            contentService: await r(ContentService),
        }),
        as: ClearAllClips,
    },
    {
        create: async (r) => new ClearClips({
            contentService: await r(ContentService),
        }),
        as: ClearClips,
    },
    {
        create: async (r) => new GetAssignments({
            contentRepository: await r(ContentInfoRepository),
        }),
        as: GetAssignments,
    },
    {
        create: async (r) => new GetClips({
            contentRepository: await r(ContentInfoRepository),
        }),
        as: GetClips,
    },
    {
        create: async (r) => new GetCourses({
            contentRepository: await r(ContentInfoRepository),
        }),
        as: GetCourses,
    },
    {
        create: async (r) => new GetUser({
            userRepository: await r(UserRepository)
        }),
        as: GetUser,
    },
    {
        create: async (r) => new HandleCommand({
            commandService: await r(CommandService),
        }),
        as: HandleCommand,
    },
    {
        create: async (r) => new SendChat({
            slackRepository: await r(SlackRepository),
        }),
        as: SendChat,
    },

    /** Services */
    {
        create: async (r) => new CommandService(), // TODO
        as: CommandService,
    },
    {
        create: async (r) => new ContentService({
            contentRepository: await r(ContentRepository),
            contentInfoRepository: await r(ContentInfoRepository),
            contentStatusRepository: await r(ContentStatusRepository),
        }),
        as: ContentService,
    },

    /** Pool */
    {
        create: async (r) => new AgentPool({
            userRepository: await r(UserRepository),
        }),
        as: AgentPool,
    },

    /** Scheduler */
    {
        create: async (r) => new Scheduler(),
        as: Scheduler,
    },

    /** Repositories */
    {
        create: async (r) => new ContentRepositoryImpl({
            contentInfoRepository: await r(ContentInfoRepository),
            contentStatusRepository: await r(ContentStatusRepository),
        }),
        as: ContentRepository,
    },
    {
        create: async (r) => new ContentInfoRepositoryImpl({
            agentPool: await r(AgentPool),
        }),
        as: ContentInfoRepository,
    },
    {
        create: async (r) => new ContentStatusRepositoryImpl({
            agentPool: await r(AgentPool),
            scheduler: await r(Scheduler),
        }),
        as: ContentStatusRepository,
    },
    {
        create: async (r) => new SlackRepositoryImpl(),
        as: SlackRepository,
    },
    {
        create: async (r) => new UserRepositoryImpl(),
        as: UserRepository,
    },

];
