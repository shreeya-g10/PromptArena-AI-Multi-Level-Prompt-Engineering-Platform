const KEY = 'promptArenaProgress';

export interface LevelProgress {
  level1Completed: boolean;
  level2Completed: boolean;
  level3Completed: boolean;
}

const defaultProgress: LevelProgress = {
  level1Completed: false,
  level2Completed: false,
  level3Completed: false,
};

export const getProgress = (): LevelProgress => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      level1Completed: !!parsed.level1Completed,
      level2Completed: !!parsed.level2Completed,
      level3Completed: !!parsed.level3Completed,
    };
  } catch {
    return defaultProgress;
  }
};

export const setLevelCompleted = (level: 1 | 2 | 3): LevelProgress => {
  const current = getProgress();
  const next = { ...current };
  if (level === 1) next.level1Completed = true;
  if (level === 2) next.level2Completed = true;
  if (level === 3) next.level3Completed = true;
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
};
