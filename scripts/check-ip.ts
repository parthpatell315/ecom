import fs from 'fs';
import path from 'path';
import { BLOCKED_TERMS } from '../src/config/blocked-terms';

interface MatchResult {
  file: string;
  line: number;
  term: string;
  snippet: string;
}

const IGNORED_FILES = new Set([
  path.resolve(__dirname, '../src/config/blocked-terms.ts'),
  path.resolve(__dirname, './check-ip.ts'),
  path.resolve(__dirname, '../next.config.ts'), // Allow old slugs in redirect table
]);

const ALLOWED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md']);

function scanDirectory(dir: string, results: MatchResult[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.next' ||
        entry.name === '.git' ||
        entry.name === 'tests' ||
        entry.name === 'supabase'
      ) {
        continue;
      }
      scanDirectory(fullPath, results);
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(path.resolve(fullPath))) {
        continue;
      }
      const ext = path.extname(entry.name);
      if (!ALLOWED_EXTENSIONS.has(ext)) {
        continue;
      }

      // Read file and check line by line
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const lower = line.toLowerCase();
        for (const term of BLOCKED_TERMS) {
          // Check for word boundary
          const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`\\b${escaped}\\b`, 'i');
          if (regex.test(lower)) {
            // Check if line is a comment explicitly explaining a 301 redirect from an old slug
            if (line.includes('// 301') || line.includes('// redirect') || line.includes('redirects')) {
              continue;
            }
            results.push({
              file: path.relative(process.cwd(), fullPath),
              line: index + 1,
              term,
              snippet: line.trim().substring(0, 100),
            });
          }
        }
      });
    }
  }
}

async function main() {
  console.log('🛡️  Scanning codebase for IP / Trademark safety violations...');
  console.log(`Blocked terms: ${BLOCKED_TERMS.join(', ')}\n`);

  const results: MatchResult[] = [];

  // 1. Scan src directory
  const srcDir = path.resolve(process.cwd(), 'src');
  if (fs.existsSync(srcDir)) {
    scanDirectory(srcDir, results);
  }

  // 2. Scan prisma/seed.ts
  const seedFile = path.resolve(process.cwd(), 'prisma/seed.ts');
  if (fs.existsSync(seedFile)) {
    const content = fs.readFileSync(seedFile, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      for (const term of BLOCKED_TERMS) {
        const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (regex.test(lower)) {
          results.push({
            file: 'prisma/seed.ts',
            line: index + 1,
            term,
            snippet: line.trim().substring(0, 100),
          });
        }
      }
    });
  }

  if (results.length > 0) {
    console.error(`❌ FAILED: Found ${results.length} IP/Trademark violations in codebase:`);
    console.table(
      results.map((r) => ({
        File: `${r.file}:${r.line}`,
        'Matched Term': r.term,
        Snippet: r.snippet,
      }))
    );
    process.exit(1);
  }

  console.log('✅ PASS: Zero IP / Trademark violations detected across all scanned files.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Error running IP check:', err);
  process.exit(1);
});
