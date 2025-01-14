import { writeFileSync, readFileSync } from 'fs';

const packageConfig = JSON.parse(readFileSync('package.json', 'utf-8'));

const buildTime = Date.now();
packageConfig.version = `${packageConfig.version}-${buildTime}`;

const buildInfo = {
    buildTime,
    ver: packageConfig.version,
};

const outputPath = 'public/latestVersion.json';

writeFileSync(outputPath, JSON.stringify(buildInfo, null, 2));
writeFileSync('package.json', JSON.stringify(packageConfig, null, 2));

console.log(`Build information generated at: ${outputPath}`);
