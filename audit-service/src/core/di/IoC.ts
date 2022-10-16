import { Container } from 'typescript-ioc';

import { IMovieCrudService } from '@catalog/domain/movie/IMovieCrudService';
import { MovieCrudService } from '@catalog/infrastructure/movie/MovieCrudService';
import { IMovieQueryService } from '@catalog/domain/movie/IMovieQueryService';
import { MovieQueryService } from '@catalog/infrastructure/movie/MovieQueryService';

import { IAffirmationCrudService } from '@catalog/domain/affirmation/IAffirmationCrudService';
import { AffirmationCrudService } from '@catalog/infrastructure/affirmation/AffirmationCrudService';

import { IUserMovieQueryService } from '@catalog/domain/user-movie/IUserMovieQueryService';
import { UserMovieQueryService } from '@catalog/infrastructure/user-movie/UserMovieQueryService';
import { IUserMovieRepository } from '@catalog/domain/user-movie/IUserMovieRepository';
import { UserMovieRepository } from '@catalog/infrastructure/user-movie/UserMovieRepository';

import { IUserCrudService } from '@audit-log/domain/audit-log/IAuditLogCrudService';
import { UserCrudService } from '@audit-log/infrastructure/audit-log/AuditLogCrudService';

Container.bind(IMovieCrudService).to(MovieCrudService);
Container.bind(IMovieQueryService).to(MovieQueryService);
Container.bind(IUserCrudService).to(UserCrudService);
Container.bind(IAffirmationCrudService).to(AffirmationCrudService);
Container.bind(IUserMovieQueryService).to(UserMovieQueryService);
Container.bind(IUserMovieRepository).to(UserMovieRepository);
