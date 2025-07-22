import type { Translation, TranslationPlural } from '@helpwave/hightide'

export type TasksTranslationType = {
  task: TranslationPlural,
  subtask: TranslationPlural,
  visibility: string,
  private: string,
  public: string,
  publish: string,
  notes: string,
  status: string,
  assignee: string,
  dueDate: string,
  createdAt: string,
}

export const tasksTranslation: Translation<TasksTranslationType> = {
  en: {
    task: {
      one: 'Task',
      other: 'Tasks'
    },
    subtask: {
      one: 'Subtask',
      other: 'Subtasks',
    },
    visibility: 'Visibility',
    private: 'private',
    public: 'public',
    publish: 'publish',
    notes: 'notes',
    status: 'Status',
    assignee: 'Assignee',
    dueDate: 'Due Date',
    createdAt: 'Created at',
  },
  de: {
    task: {
      one: 'Task',
      other: 'Tasks'
    },
    subtask: {
      one: 'Unteraufgabe',
      other: 'Unteraufgaben'
    },
    visibility: 'Sichtbarkeit',
    private: 'Privat',
    public: 'Öffentlich',
    publish: 'Veröffentlichen',
    notes: 'Notizen',
    status: 'Status',
    assignee: 'Verantwortlich',
    dueDate: 'Fälligkeitsdatum',
    createdAt: 'Erstellt am',
  }
}
