export const enum Exchange {
    UserStream = 'user-stream',
    User = 'user',
    Task = 'task',
    TaskStream = 'task-stream',
}

export const enum UserEvent {
    Created = 'Created',
    Updated = 'Updated',
}

export const enum TaskEvent {
    Created = 'Created',
    Updated = 'Updated',
    Assigned = 'Assigned',
    Executed = 'Executed',
}

export const enum TransactionEvent {
    Executed = 'Executed',
    // Executed = 'Executed',
}
