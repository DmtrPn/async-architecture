// import { AuditLogEvent } from 'aa-types/events';

import { AmqpMetadata } from '@core/amqp/AmqpClient';
import { } from '@audit-log/use-cases/audit-log';
// import { UseCaseCommand } from '@common/use-cases/UseCaseCommand';

export class AuditLogEventListener {
    public static async onMessage(_: AmqpMetadata): Promise<void> {
    }
}