#!/usr/bin/env node
// Lab snapshot manager (Plan A) — runs from /workshop
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..'); // /workshop
const appSrc = path.join(repoRoot, 'app', 'src');
const labsRoot = path.join(repoRoot, 'labs');
const backupsRoot = path.join(repoRoot, '.lab-backups');

function ensureDir(p) { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); }

function readJsonSafe(p, fallback = {}) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return fallback; }
}

function listLabs() {
  if (!fs.existsSync(labsRoot)) return [];
  return fs.readdirSync(labsRoot, { withFileTypes: true })
    .filter(d => d.isDirectory() && /^lab\d+$/i.test(d.name))
    .map(d => d.name)
    .sort((a, b) => Number(a.replace(/\D/g, '')) - Number(b.replace(/\D/g, '')));
}

function labVariantPaths(labId) {
  const m = /^(lab\d+)-(start|solution)$/i.exec(labId || '');
  if (!m) return null;
  const [, lab, variant] = m;
  const srcPath = path.join(labsRoot, lab, variant, 'src');
  return { lab, variant, srcPath };
}

function walkFiles(root) {
  const files = [];
  if (!fs.existsSync(root)) return files;
  const stack = [{ dir: root, rel: '' }];
  while (stack.length) {
    const { dir, rel } = stack.pop();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      const abs = path.join(dir, e.name);
      const r = path.join(rel, e.name);
      if (e.isDirectory()) stack.push({ dir: abs, rel: r });
      else files.push({ abs, rel: r });
    }
  }
  return files.sort((a, b) => a.rel.localeCompare(b.rel));
}

function copyTree(srcRoot, dstRoot) {
  for (const f of walkFiles(srcRoot)) {
    const to = path.join(dstRoot, f.rel);
    ensureDir(path.dirname(to));
    fs.copyFileSync(f.abs, to);
  }
}

function dryRun(labId) {
  const meta = labVariantPaths(labId);
  if (!meta) {
    console.error('Usage: npm run lab:dry -- <labN-start|labN-solution>');
    process.exit(1);
  }
  const files = walkFiles(meta.srcPath);
  if (!files.length) {
    console.log(`[dry] No files in ${path.relative(repoRoot, meta.srcPath)}.`);
    return;
  }
  console.log(`[dry] Will copy ${files.length} file(s) from ${path.relative(repoRoot, meta.srcPath)} to ${path.relative(repoRoot, appSrc)}:`);
  for (const f of files) {
    const exists = fs.existsSync(path.join(appSrc, f.rel));
    console.log(` - ${f.rel}${exists ? ' (overwrite)' : ''}`);
  }
}

function backup() {
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(backupsRoot, ts, 'src');
  if (!fs.existsSync(appSrc)) {
    console.log('Nothing to backup: /workshop/app/src not found.');
    return;
  }
  ensureDir(dest);
  copyTree(appSrc, dest);
  console.log(`Backup created at ${path.relative(repoRoot, path.join(backupsRoot, ts))}`);
}

function restore() {
  if (!fs.existsSync(backupsRoot)) {
    console.error('No backups found.');
    process.exit(1);
  }
  const entries = fs.readdirSync(backupsRoot, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
  if (!entries.length) {
    console.error('No backups found.');
    process.exit(1);
  }
  const latest = entries[entries.length - 1];
  const src = path.join(backupsRoot, latest, 'src');
  if (!fs.existsSync(src)) {
    console.error('Latest backup is missing src.');
    process.exit(1);
  }
  ensureDir(appSrc);
  copyTree(src, appSrc);
  console.log(`Restored from ${path.relative(repoRoot, path.join(backupsRoot, latest))}`);
}

function useLab(labId) {
  const meta = labVariantPaths(labId);
  if (!meta) {
    console.error('Usage: npm run lab:use -- <labN-start|labN-solution>');
    process.exit(1);
  }
  if (!fs.existsSync(meta.srcPath)) {
    console.error(`Lab snapshot not found: ${path.relative(repoRoot, meta.srcPath)}`);
    process.exit(1);
  }
  ensureDir(appSrc);
  backup();
  copyTree(meta.srcPath, appSrc);
  console.log(`Applied ${meta.lab}/${meta.variant} to /workshop/app/src`);
}

function verifyLab(labShortId) {
  if (!labShortId) {
    console.error('Usage: npm run lab:verify -- <labN>');
    process.exit(1);
  }
  const labDir = path.join(labsRoot, labShortId);
  const meta = readJsonSafe(path.join(labDir, 'meta.json'), {});
  const required = Array.isArray(meta.required) ? meta.required : [];
  const missing = [];
  for (const rel of required) {
    const p = path.join(appSrc, rel);
    if (!fs.existsSync(p)) missing.push(rel);
  }
  if (missing.length) {
    console.error(`Verify failed: missing ${missing.length} file(s):`);
    for (const m of missing) console.error(' - ' + m);
    process.exit(2);
  }
  console.log('Verify passed.');
}

function listCmd() {
  const labs = listLabs();
  if (!labs.length) { console.log('No labs found.'); return; }
  console.log('Available labs:');
  for (const l of labs) {
    const meta = readJsonSafe(path.join(labsRoot, l, 'meta.json'), {});
    const title = meta.title || '';
    console.log(` - ${l}${title ? ' — ' + title : ''}`);
  }
  console.log('\nUse: npm run lab:use -- lab1-start');
}

const [, , cmd, arg] = process.argv;
switch (cmd) {
  case 'list': listCmd(); break;
  case 'dry': dryRun(arg); break;
  case 'backup': backup(); break;
  case 'restore': restore(); break;
  case 'use': useLab(arg); break;
  case 'verify': verifyLab(arg); break;
  default:
    console.log('Usage:');
    console.log('  npm run lab:list');
    console.log('  npm run lab:dry -- <labN-start|labN-solution>');
    console.log('  npm run lab:use -- <labN-start|labN-solution>');
    console.log('  npm run lab:backup');
    console.log('  npm run lab:restore');
    console.log('  npm run lab:verify -- <labN>');
}
