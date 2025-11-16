import { Checkpoint, CheckpointType } from '../types';
import { translations } from '../i18n/translations';

export function getTranslatedCheckpoint(checkpoint: Checkpoint, language: 'en' | 'zh'): Checkpoint {
  const checkpointTranslations = translations[language].checkpoints;
  const translation = checkpointTranslations[checkpoint.id as keyof typeof checkpointTranslations];
  
  if (!translation) {
    return checkpoint; // Return original if no translation found
  }

  return {
    ...checkpoint,
    name: translation.name,
    location: translation.location,
    description: translation.description,
  };
}

export function getTranslatedCheckpoints(checkpoints: Checkpoint[], language: 'en' | 'zh'): Checkpoint[] {
  return checkpoints.map(checkpoint => getTranslatedCheckpoint(checkpoint, language));
}

export function getCheckpointTypeTranslation(type: CheckpointType, language: 'en' | 'zh'): string {
  const typeTranslations = translations[language].checkpointTypes;
  return typeTranslations[type] || type;
}