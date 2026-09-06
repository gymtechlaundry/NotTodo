import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { AppLockService } from './services/app-lock.service';
import { CategoryService } from './services/category.service';
import { NotTodoService } from './services/not-todo.service';
import { ReminderService } from './services/reminder.service';

describe('AppComponent', () => {
  const locked = signal(false);

  beforeEach(async () => {
    locked.set(false);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        { provide: NotTodoService, useValue: { initDB: async () => undefined } },
        { provide: CategoryService, useValue: { init: async () => undefined } },
        { provide: ReminderService, useValue: { init: async () => undefined } },
        {
          provide: AppLockService,
          useValue: {
            locked,
            enabled: signal(false),
            init: async () => undefined,
            unlock: async () => true,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows the lock logo without a Not ToDo title', () => {
    locked.set(true);
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.app-lock-gate img')).toBeTruthy();
    expect(root.querySelector('.app-lock-gate h1')).toBeNull();
    expect(root.querySelector('.app-lock-gate')?.textContent).not.toContain('Not ToDo');
  });
});
