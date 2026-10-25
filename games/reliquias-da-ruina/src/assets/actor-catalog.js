import { validateManifest } from '../core/animation-contract.js';
import { PLAYER_BODY } from '../rooms/test-room.js';

// Use the same source manifests for loading, playback and inspection. Body
// profiles reference the game's collider data; the lab creates no physics body.
const profiles = { 'traveler-placeholder': PLAYER_BODY };
export const ACTORS = Object.values(import.meta.glob('./*.json', { eager: true, import: 'default' }))
  .map(validateManifest)
  .filter(manifest => manifest.category === 'body')
  .map(manifest => ({ manifest, hitbox: profiles[manifest.id] ?? null }))
  .sort((a, b) => a.manifest.id.localeCompare(b.manifest.id));

if (new Set(ACTORS.map(actor => actor.manifest.id)).size !== ACTORS.length) throw new Error('IDs de personagens repetidos');
