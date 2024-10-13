#!/usr/bin/env node
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();

function findPackageJsons(dir, results = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (file === 'node_modules') {
      // Skip node_modules directory
      continue;
    }

    if (fs.statSync(filePath).isDirectory()) {
      findPackageJsons(filePath, results); // Recursively search in subdirectories
    } else if (file === 'package.json') {
      results.push(filePath);
    }
  }
  return results;
}

program
  .name('pkg-cli')
  .description('CLI to search for package.json files')
  .version('1.0.0');

program
  .command('pkg-search [dir]')
  .description('Search for all package.json files in the specified directory and nested folders (excluding node_modules)')
  .action((dir = '.') => {
    const packageJsons = findPackageJsons(dir);
    if (packageJsons.length > 0) {
      console.log('Found package.json files:');
      packageJsons.forEach(pkg => console.log(pkg));
    } else {
      console.log('No package.json files found.');
    }
  });

program.parse(process.argv);
