import { javascriptSamples } from './javascript';
import { pythonSamples } from './python';
import { javaSamples } from './java';
import { cppSamples } from './cpp';
import { goSamples } from './go';
import { sqlSamples } from './sql';
import { rubySamples } from './ruby';
import { rustSamples } from './rust';
import { csharpSamples } from './csharp';
import { kotlinSamples } from './kotlin';
import { typescriptSamples } from './typescript';
import { reactSamples } from './react';
import { scalaSamples } from './scala';
import { haskellSamples } from './haskell';
import { elixirSamples } from './elixir';

export const allSamples = [
  ...javascriptSamples,
  ...pythonSamples,
  ...javaSamples,
  ...cppSamples,
  ...goSamples,
  ...sqlSamples,
  ...rubySamples,
  ...rustSamples,
  ...csharpSamples,
  ...kotlinSamples,
  ...typescriptSamples,
  ...reactSamples,
  ...scalaSamples,
  ...haskellSamples,
  ...elixirSamples
];

export interface CodeSample {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
}

export function getSamplesByLanguage(language: string): CodeSample[] {
  return allSamples.filter(sample => sample.language === language);
}

export function getSamplesByCategory(category: string): CodeSample[] {
  return allSamples.filter(sample => sample.category === category);
}

export function searchSamples(query: string): CodeSample[] {
  const searchTerm = query.toLowerCase();
  return allSamples.filter(sample =>
    sample.title.toLowerCase().includes(searchTerm) ||
    sample.description.toLowerCase().includes(searchTerm) ||
    sample.category.toLowerCase().includes(searchTerm)
  );
}