import fs from 'node:fs';
import path from 'node:path';
import bibtexParse from 'bibtex-parse-js';

export interface BibEntry {
  citationKey: string;
  entryType: string;
  entryTags: {
    title?: string;
    author?: string;
    editor?: string;
    booktitle?: string;
    journal?: string;
    volume?: string;
    number?: string;
    pages?: string;
    year?: string;
    month?: string;
    doi?: string;
    url?: string;
    eprint?: string;
    publisher?: string;
    note?: string;
    howpublished?: string;
    senior_author?: string;
    sapc_category?: string;
    [key: string]: string | undefined;
  };
}

export function cleanLatex(str?: string): string {
  if (!str) return '';
  return str
    .replace(/[{}]/g, '')
    .replace(/\\'(?:\\i|([aeiouyAEIOUY]))/g, '$1\u0301')
    .replace(/\\`(?:\\i|([aeiouyAEIOUY]))/g, '$1\u0300')
    .replace(/\\^(?:\\i|([aeiouyAEIOUY]))/g, '$1\u0302')
    .replace(/\\"(?:\\i|([aeiouyAEIOUY]))/g, '$1\u0308')
    .replace(/\\c{c}/g, 'ç')
    .replace(/\\c{C}/g, 'Ç')
    .replace(/\\&/g, '&')
    .replace(/\\%/g, '%')
    .replace(/\\_/g, '_')
    .replace(/\s+/g, ' ')
    .trim();
}

export function formatAuthors(authorStr?: string): string {
  if (!authorStr) return '';
  const cleaned = cleanLatex(authorStr);
  const authors = cleaned.split(/\s+and\s+/i).map(a => {
    if (a.includes(',')) {
      const [last, first] = a.split(',').map(s => s.trim());
      return `${first} ${last}`;
    }
    return a.trim();
  });

  return authors.map(a => {
    if (a.toLowerCase().includes('pitié') || a.toLowerCase().includes('pitie')) {
      return `<strong class="text-[var(--theme-heading)] font-semibold">${a}</strong>`;
    }
    return a;
  }).join(', ');
}

export function formatBibtex(pub: BibEntry): string {
  const tags = Object.entries(pub.entryTags)
    .filter(([k, v]) => v && !['sapc_category', 'senior_author'].includes(k))
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(',\n');
  return `@${pub.entryType.toLowerCase()}{${pub.citationKey},\n${tags}\n}`;
}

export function getPublicationUrl(pub: BibEntry): string | null {
  if (pub.entryTags.doi) {
    const cleanDoi = cleanLatex(pub.entryTags.doi).trim();
    return cleanDoi.startsWith('http') ? cleanDoi : `https://doi.org/${cleanDoi}`;
  }
  if (pub.entryTags.url) {
    return cleanLatex(pub.entryTags.url).trim();
  }
  if (pub.entryTags.eprint) {
    const ep = cleanLatex(pub.entryTags.eprint).replace(/^arXiv:/i, '').trim();
    return `https://arxiv.org/abs/${ep}`;
  }
  if (pub.entryTags.arxiv) {
    const ar = cleanLatex(pub.entryTags.arxiv).replace(/^arXiv:/i, '').trim();
    return `https://arxiv.org/abs/${ar}`;
  }
  return null;
}

export function loadPublications(): BibEntry[] {
  const bibPath = path.resolve('./src/data/publications.bib');
  if (!fs.existsSync(bibPath)) return [];
  const content = fs.readFileSync(bibPath, 'utf8');

  try {
    const parsed = bibtexParse.toJSON(content) as BibEntry[];
    return parsed.sort((a, b) => {
      const yearA = parseInt(a.entryTags.year || '0', 10);
      const yearB = parseInt(b.entryTags.year || '0', 10);
      return yearB - yearA;
    });
  } catch (err) {
    console.error('Error parsing publications.bib:', err);
    return [];
  }
}


