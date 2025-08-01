import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { TeamMember, Sprint, Absence, Settings, Backup } from '../types';

interface CapacityPlanningDB extends DBSchema {
  users: {
    key: number;
    value: TeamMember;
    indexes: { 'by-name': string };
  };
  sprints: {
    key: number;
    value: Sprint;
    indexes: { 'by-date': Date };
  };
  absences: {
    key: number;
    value: Absence;
    indexes: { 'by-user': number; 'by-date': Date };
  };
  settings: {
    key: string;
    value: Settings;
  };
  backups: {
    key: number;
    value: Backup;
    indexes: { 'by-timestamp': number };
  };
}

class DatabaseService {
  private db: IDBPDatabase<CapacityPlanningDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<CapacityPlanningDB>('capacity-planning', 1, {
      upgrade(db) {
        // Users store
        const usersStore = db.createObjectStore('users', {
          keyPath: 'id',
          autoIncrement: true,
        });
        usersStore.createIndex('by-name', 'name');

        // Sprints store
        const sprintsStore = db.createObjectStore('sprints', {
          keyPath: 'id',
          autoIncrement: true,
        });
        sprintsStore.createIndex('by-date', 'startDate');

        // Absences store
        const absencesStore = db.createObjectStore('absences', {
          keyPath: 'id',
          autoIncrement: true,
        });
        absencesStore.createIndex('by-user', 'userId');
        absencesStore.createIndex('by-date', 'startDate');

        // Settings store
        const settingsStore = db.createObjectStore('settings', {
          keyPath: 'key',
        });

        // Backups store
        const backupsStore = db.createObjectStore('backups', {
          keyPath: 'timestamp',
        });
        backupsStore.createIndex('by-timestamp', 'timestamp');

        // Initialize default settings
        const defaultSettings = [
          { key: 'defaultSprintLength', value: 14 },
          { key: 'workingDaysPerWeek', value: 5 },
          { key: 'defaultUnit', value: 'hours' },
          { key: 'holidays', value: [] },
        ];

        defaultSettings.forEach(setting => {
          settingsStore.add(setting);
        });
      },
    });
  }

  private ensureDB(): IDBPDatabase<CapacityPlanningDB> {
    if (!this.db) {
      throw new Error('Database not initialized. Call init() first.');
    }
    return this.db;
  }

  // Team Members
  async addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const db = this.ensureDB();
    const now = new Date();
    const memberWithDates = {
      ...member,
      createdAt: now,
      updatedAt: now,
    };
    return await db.add('users', memberWithDates);
  }

  async updateTeamMember(id: number, member: Partial<TeamMember>): Promise<void> {
    const db = this.ensureDB();
    const existing = await db.get('users', id);
    if (!existing) throw new Error('Team member not found');
    
    const updated = {
      ...existing,
      ...member,
      id,
      updatedAt: new Date(),
    };
    await db.put('users', updated);
  }

  async deleteTeamMember(id: number): Promise<void> {
    const db = this.ensureDB();
    await db.delete('users', id);
    
    // Also delete related absences
    const absences = await this.getAbsencesByUser(id);
    const tx = db.transaction('absences', 'readwrite');
    for (const absence of absences) {
      if (absence.id) {
        await tx.objectStore('absences').delete(absence.id);
      }
    }
  }

  async getTeamMember(id: number): Promise<TeamMember | undefined> {
    const db = this.ensureDB();
    return await db.get('users', id);
  }

  async getAllTeamMembers(): Promise<TeamMember[]> {
    const db = this.ensureDB();
    return await db.getAll('users');
  }

  // Sprints
  async addSprint(sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const db = this.ensureDB();
    const now = new Date();
    const sprintWithDates = {
      ...sprint,
      createdAt: now,
      updatedAt: now,
    };
    return await db.add('sprints', sprintWithDates);
  }

  async updateSprint(id: number, sprint: Partial<Sprint>): Promise<void> {
    const db = this.ensureDB();
    const existing = await db.get('sprints', id);
    if (!existing) throw new Error('Sprint not found');
    
    const updated = {
      ...existing,
      ...sprint,
      id,
      updatedAt: new Date(),
    };
    await db.put('sprints', updated);
  }

  async deleteSprint(id: number): Promise<void> {
    const db = this.ensureDB();
    await db.delete('sprints', id);
  }

  async getSprint(id: number): Promise<Sprint | undefined> {
    const db = this.ensureDB();
    return await db.get('sprints', id);
  }

  async getAllSprints(): Promise<Sprint[]> {
    const db = this.ensureDB();
    return await db.getAll('sprints');
  }

  // Absences
  async addAbsence(absence: Omit<Absence, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const db = this.ensureDB();
    const now = new Date();
    const absenceWithDates = {
      ...absence,
      createdAt: now,
      updatedAt: now,
    };
    return await db.add('absences', absenceWithDates);
  }

  async updateAbsence(id: number, absence: Partial<Absence>): Promise<void> {
    const db = this.ensureDB();
    const existing = await db.get('absences', id);
    if (!existing) throw new Error('Absence not found');
    
    const updated = {
      ...existing,
      ...absence,
      id,
      updatedAt: new Date(),
    };
    await db.put('absences', updated);
  }

  async deleteAbsence(id: number): Promise<void> {
    const db = this.ensureDB();
    await db.delete('absences', id);
  }

  async getAbsence(id: number): Promise<Absence | undefined> {
    const db = this.ensureDB();
    return await db.get('absences', id);
  }

  async getAllAbsences(): Promise<Absence[]> {
    const db = this.ensureDB();
    return await db.getAll('absences');
  }

  async getAbsencesByUser(userId: number): Promise<Absence[]> {
    const db = this.ensureDB();
    return await db.getAllFromIndex('absences', 'by-user', userId);
  }

  async getAbsencesInDateRange(startDate: Date, endDate: Date): Promise<Absence[]> {
    const db = this.ensureDB();
    const allAbsences = await db.getAll('absences');
    
    return allAbsences.filter(absence => {
      const absenceStart = new Date(absence.startDate);
      const absenceEnd = new Date(absence.endDate);
      
      // Check if absence overlaps with the date range
      return absenceStart <= endDate && absenceEnd >= startDate;
    });
  }

  // Settings
  async getSetting(key: string): Promise<any> {
    const db = this.ensureDB();
    const setting = await db.get('settings', key);
    return setting?.value;
  }

  async setSetting(key: string, value: any): Promise<void> {
    const db = this.ensureDB();
    await db.put('settings', { key, value });
  }

  async getAllSettings(): Promise<Settings[]> {
    const db = this.ensureDB();
    return await db.getAll('settings');
  }

  // Backups
  async createBackup(description?: string): Promise<number> {
    const db = this.ensureDB();
    const timestamp = Date.now();
    
    const [users, sprints, absences, settings] = await Promise.all([
      this.getAllTeamMembers(),
      this.getAllSprints(),
      this.getAllAbsences(),
      this.getAllSettings(),
    ]);

    const backup: Backup = {
      timestamp,
      data: { users, sprints, absences, settings },
      description,
    };

    await db.add('backups', backup);
    return timestamp;
  }

  async getAllBackups(): Promise<Backup[]> {
    const db = this.ensureDB();
    const backups = await db.getAll('backups');
    return backups.sort((a, b) => b.timestamp - a.timestamp);
  }

  async restoreBackup(timestamp: number): Promise<void> {
    const db = this.ensureDB();
    const backup = await db.get('backups', timestamp);
    if (!backup) throw new Error('Backup not found');

    // Clear existing data
    const tx = db.transaction(['users', 'sprints', 'absences', 'settings'], 'readwrite');
    await Promise.all([
      tx.objectStore('users').clear(),
      tx.objectStore('sprints').clear(),
      tx.objectStore('absences').clear(),
      tx.objectStore('settings').clear(),
    ]);

    // Restore data
    const restoreTx = db.transaction(['users', 'sprints', 'absences', 'settings'], 'readwrite');
    
    for (const user of backup.data.users) {
      await restoreTx.objectStore('users').add(user);
    }
    
    for (const sprint of backup.data.sprints) {
      await restoreTx.objectStore('sprints').add(sprint);
    }
    
    for (const absence of backup.data.absences) {
      await restoreTx.objectStore('absences').add(absence);
    }
    
    for (const setting of backup.data.settings) {
      await restoreTx.objectStore('settings').add(setting);
    }
  }

  async exportData(): Promise<string> {
    const [users, sprints, absences, settings] = await Promise.all([
      this.getAllTeamMembers(),
      this.getAllSprints(),
      this.getAllAbsences(),
      this.getAllSettings(),
    ]);

    const exportData = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      data: { users, sprints, absences, settings },
    };

    return JSON.stringify(exportData, null, 2);
  }

  async importData(jsonData: string): Promise<void> {
    const importData = JSON.parse(jsonData);
    
    if (!importData.data) {
      throw new Error('Invalid import format');
    }

    const { users, sprints, absences, settings } = importData.data;

    // Clear existing data
    const db = this.ensureDB();
    const tx = db.transaction(['users', 'sprints', 'absences', 'settings'], 'readwrite');
    await Promise.all([
      tx.objectStore('users').clear(),
      tx.objectStore('sprints').clear(),
      tx.objectStore('absences').clear(),
      tx.objectStore('settings').clear(),
    ]);

    // Import data
    const importTx = db.transaction(['users', 'sprints', 'absences', 'settings'], 'readwrite');
    
    if (users) {
      for (const user of users) {
        await importTx.objectStore('users').add(user);
      }
    }
    
    if (sprints) {
      for (const sprint of sprints) {
        await importTx.objectStore('sprints').add(sprint);
      }
    }
    
    if (absences) {
      for (const absence of absences) {
        await importTx.objectStore('absences').add(absence);
      }
    }
    
    if (settings) {
      for (const setting of settings) {
        await importTx.objectStore('settings').add(setting);
      }
    }
  }
}

export const dbService = new DatabaseService();