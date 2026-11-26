// NusaData hand-in program (Node 22, standard library only): copy the static site and its
// screenshots to the output directory, then write the exact dossier bytes required by make.fun.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const outputArgument = readOutputArgument(process.argv.slice(2));
const out = resolve(outputArgument ?? process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

export function readOutputArgument(args: string[]): string | undefined {
  const inline = args.find((arg) => arg.startsWith('--output='));
  if (inline) return inline.slice('--output='.length);
  const index = args.indexOf('--output');
  return index >= 0 ? args[index + 1] : undefined;
}

export function clearDirectoryContents(directory: string): void {
  if (!existsSync(directory)) return;
  for (const entry of readdirSync(directory)) {
    rmSync(join(directory, entry), { recursive: true, force: true });
  }
}

export function copyEntryTree(source: string, destination: string): void {
  mkdirSync(destination, { recursive: true });
  clearDirectoryContents(destination);
  cpSync(source, destination, { recursive: true });
}

export function treeManifest(root: string): { files: number; directories: number; bytes: number } {
  const totals = { files: 0, directories: 0, bytes: 0 };
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        totals.directories += 1;
        walk(path);
      } else if (entry.isFile()) {
        totals.files += 1;
        totals.bytes += statSync(path).size;
      }
    }
  };
  walk(root);
  return totals;
}

mkdirSync(out, { recursive: true });
copyEntryTree(join(here, 'app'), join(out, 'app'));
mkdirSync(join(out, 'screenshots'), { recursive: true });
clearDirectoryContents(join(out, 'screenshots'));
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 16777216 }),
);

const appManifest = treeManifest(join(out, 'app'));
const shotsManifest = treeManifest(join(out, 'screenshots'));
const dossierBytes = statSync(join(out, 'dossier.json')).size;
console.log(`app: ${appManifest.files} files, ${appManifest.directories} directories, ${appManifest.bytes} bytes`);
console.log(`screenshots: ${shotsManifest.files} files, ${shotsManifest.bytes} bytes`);
console.log(`dossier.json: ${dossierBytes} bytes`);
console.log(`output: ${appManifest.files + shotsManifest.files + 1} files, ${appManifest.bytes + shotsManifest.bytes + dossierBytes} bytes`);
