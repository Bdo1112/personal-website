import ingredientsJson from './ingredients.json';
import recipesJson from './recipes.json';
import candidatesJson from './candidates.json';

export type FlavorTag = 'spicy' | 'nutty' | 'garlicky' | 'tangy' | 'fresh';
export type ScoreKey = 'heat' | 'richness' | 'umami' | 'tanginess' | 'freshness';
export interface Ingredient { id: string; name: string }
export interface RecipeIngredient { id: string; quantity?: number; unit?: string; display?: string }
export interface Source { title: string; publisher: string; url: string; language: string; source_type: string }
export interface Recipe {
  id: string; name: string; description: string; scores: Record<ScoreKey, number>;
  tags: FlavorTag[]; color: string; ingredients: RecipeIngredient[];
  nameKo?: string; nameOriginal?: string; family?: string; provenance?: string; servings?: string; notes?: string;
  sourceIds?: string[]; sources?: Source[]; researchCandidate?: boolean;
}

const ingredients = ingredientsJson as Ingredient[];
const legacyRecipes = recipesJson as Recipe[];
const candidateData = candidatesJson as { status: string; sources: Record<string, Source>; recipes: CandidateRecipe[] };
interface CandidateRecipe {
  id: string; name_en: string; name_ko?: string; name_original?: string; family: string; provenance: string;
  source_ids: string[]; servings: string; ingredients: string[];
  flavor_estimate: Record<ScoreKey, number>; notes?: string;
}

const slug = (value: string) => value.toLocaleLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const candidateIngredients = new Map<string, Ingredient>();
const candidateRecipes: Recipe[] = candidateData.recipes.map(candidate => {
  const rows = candidate.ingredients.map(line => {
    const colon = line.indexOf(':');
    const name = (colon < 0 ? line : line.slice(0, colon)).trim();
    const measure = colon < 0 ? '' : line.slice(colon + 1).trim();
    const id = `candidate-${slug(name)}`;
    if (!candidateIngredients.has(id)) candidateIngredients.set(id, { id, name });
    return { id, display: measure };
  });
  const names = rows.map(row => candidateIngredients.get(row.id)!.name.toLocaleLowerCase()).join(' ');
  const scores = candidate.flavor_estimate;
  const tags: FlavorTag[] = [];
  if (scores.heat >= 6 || /chili|pepper|wasabi/.test(names)) tags.push('spicy');
  if (/sesame|peanut|groundnut|goma|\bnuts?\b/.test(names)) tags.push('nutty');
  if (/garlic/.test(names)) tags.push('garlicky');
  if (scores.tanginess >= 7 || /vinegar|lime|lemon|citrus|ponzu|tamarind/.test(names)) tags.push('tangy');
  if (scores.freshness >= 7 || /cilantro|scallion|onion|ginger|herb/.test(names)) tags.push('fresh');
  const hue = Math.round(18 + (10 - scores.heat) * 3 + scores.richness * 2);
  const lightness = Math.round(48 + scores.freshness * 0.8);
  return {
    id: candidate.id, name: candidate.name_en, nameKo: candidate.name_ko, nameOriginal: candidate.name_original,
    description: candidate.notes ?? `${candidate.family.replaceAll('_', ' ')} · ${candidate.provenance.replaceAll('_', ' ')}`,
    scores, tags, color: `hsl(${hue} 42% ${lightness}%)`, ingredients: rows, family: candidate.family,
    provenance: candidate.provenance, sourceIds: candidate.source_ids, servings: candidate.servings,
    notes: candidate.notes, sources: candidate.source_ids.map(id => candidateData.sources[id]).filter((source): source is Source => Boolean(source)),
    researchCandidate: true,
  };
});
for (const candidate of candidateRecipes) {
  for (const sourceId of candidate.sourceIds ?? []) {
    if (!candidateData.sources[sourceId]) throw new Error(`Unknown source ${sourceId} in ${candidate.id}`);
  }
}
const pantry = [...ingredients, ...candidateIngredients.values()];
const recipes = [...legacyRecipes, ...candidateRecipes];

export function validateData(items: Recipe[], pantryItems: Ingredient[]): void {
  const ingredientIds = new Set<string>();
  for (const ingredient of pantryItems) {
    if (!ingredient.id || !ingredient.name || ingredientIds.has(ingredient.id)) throw new Error(`Invalid or duplicate ingredient id: ${ingredient.id}`);
    ingredientIds.add(ingredient.id);
  }
  const recipeIds = new Set<string>();
  for (const recipe of items) {
    if (!recipe.id || recipeIds.has(recipe.id)) throw new Error(`Invalid or duplicate recipe id: ${recipe.id}`);
    recipeIds.add(recipe.id);
    if (!/^#[\da-f]{6}$/i.test(recipe.color) && !/^hsl\([\d.]+ 42% [\d.]+%\)$/.test(recipe.color)) throw new Error(`Invalid color in ${recipe.id}`);
    for (const key of ['heat', 'richness', 'umami', 'tanginess', 'freshness'] as ScoreKey[]) {
      const score = recipe.scores[key];
      if (!Number.isFinite(score) || score < 0 || score > 10) throw new Error(`Invalid ${key} score in ${recipe.id}`);
    }
    for (const row of recipe.ingredients) {
      if (!ingredientIds.has(row.id)) throw new Error(`Unknown ingredient ${row.id} in ${recipe.id}`);
      if (row.display !== undefined) {
        if (!row.display.trim()) throw new Error(`Invalid source measure in ${recipe.id}`);
      } else if (!Number.isFinite(row.quantity) || row.quantity! <= 0 || !row.unit?.trim()) throw new Error(`Invalid quantity in ${recipe.id}`);
    }
  }
}

validateData(recipes, pantry);
export { ingredients, recipes, candidateData };
export const tagLabels: Record<FlavorTag, string> = { spicy: 'Spicy', nutty: 'Nutty', garlicky: 'Garlicky', tangy: 'Tangy', fresh: 'Fresh' };
export const ingredientById = new Map(pantry.map(item => [item.id, item]));

export function filterRecipes(items: Recipe[], flavor: FlavorTag | 'all', query: string): Recipe[] {
  const normalized = query.trim().toLocaleLowerCase();
  return items.filter(recipe => (flavor === 'all' || recipe.tags.includes(flavor)) &&
    [recipe.name, recipe.nameKo ?? '', recipe.nameOriginal ?? '', recipe.description, recipe.notes ?? '', recipe.family ?? '', recipe.provenance ?? '', ...recipe.ingredients.map(row => ingredientById.get(row.id)?.name ?? ''), ...recipe.tags]
      .join(' ').toLocaleLowerCase().includes(normalized));
}

export function mapCoordinates(recipe: Recipe): { x: number; y: number } {
  return { x: 5 + recipe.scores.heat * 9, y: 95 - recipe.scores.richness * 9 };
}

export function spreadMapCoordinates(recipe: Recipe, items: Recipe[]): { x: number; y: number } {
  const base = mapCoordinates(recipe);
  const group = items.filter(item => {
    const point = mapCoordinates(item);
    return point.x === base.x && point.y === base.y;
  });
  if (group.length < 2) return base;
  const index = group.findIndex(item => item.id === recipe.id);
  const offsets = [[-2.5, -2.5], [2.5, -2.5], [-2.5, 2.5], [2.5, 2.5], [0, -3.5], [0, 3.5]];
  const [dx, dy] = offsets[index % offsets.length];
  return { x: Math.min(97.5, Math.max(2.5, base.x + dx)), y: Math.min(97.5, Math.max(2.5, base.y + dy)) };
}
