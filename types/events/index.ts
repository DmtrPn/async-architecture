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
    Created = 'TaskCreated',
    Updated = 'TaskUpdated',
    Assigned = 'TaskAssigned',
    Executed = 'TaskExecuted',
}
