#!/usr/bin/env node
import '../../bootstrap';

import fs from 'fs';
import path from 'path';

import { Config, ConfigName, DbConfig } from '@core/config';

const rootDir = path.resolve(__dirname, '../../');
const postgresConfig = Config.getConfig<DbConfig>(ConfigName.Db);

fs.createWriteStream(`${rootDir}/ormconfig.json`).write(JSON.stringify(postgresConfig));
