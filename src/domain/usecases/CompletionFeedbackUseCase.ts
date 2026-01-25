import type { EncouragementType } from '../entities/EncouragementPhrases'
import { ENCOURAGEMENT_PHRASES } from '../entities/EncouragementPhrases'

export class CompletionFeedbackUseCase {
  getEncouragementPhrase(type: EncouragementType): string {
    const phrases = ENCOURAGEMENT_PHRASES[type];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  getRandomCompletionPhrase(): string {
    return this.getEncouragementPhrase('completion');
  }
}
