import fs from 'fs';
import path from 'path';

const brainDir = 'C:\\Users\\HP\\.gemini\\antigravity\\brain\\c6649efa-d458-42a2-b9f7-73ccbf488bd8';
const publicOgDir = path.resolve('public/og');

// Source files in brain directory
const sources = {
  homepage: path.join(brainDir, 'homepage_og_1781289778727.png'),
  scientific: path.join(brainDir, 'scientific_calculator_og_1781289796116.png'),
  bmi: path.join(brainDir, 'bmi_calculator_og_1781289810084.png'),
  default: path.join(brainDir, 'default_og_1781289824199.png'),
};

const slugs = [
  'mortgage-calculator',
  'compound-interest-calculator',
  'loan-emi-calculator',
  'retirement-calculator',
  '401k-calculator',
  'calorie-calculator',
  'water-intake-calculator',
  'pregnancy-due-date-calculator',
  'percentage-calculator',
  'age-calculator',
  'regular-calculator',
  'tip-calculator',
  'bmr-calculator',
];

async function setup() {
  try {
    // 1. Ensure public/og exists
    if (!fs.existsSync(publicOgDir)) {
      fs.mkdirSync(publicOgDir, { recursive: true });
      console.log('Created public/og directory.');
    }

    // 2. Copy the 4 main images
    fs.copyFileSync(sources.homepage, path.join(publicOgDir, 'homepage-og.png'));
    fs.copyFileSync(sources.scientific, path.join(publicOgDir, 'scientific-calculator.png'));
    fs.copyFileSync(sources.bmi, path.join(publicOgDir, 'bmi-calculator.png'));
    fs.copyFileSync(sources.default, path.join(publicOgDir, 'default-og.png'));
    console.log('Copied primary OG images successfully.');

    // 3. Copy default to all other slugs
    const defaultSource = path.join(publicOgDir, 'default-og.png');
    for (const slug of slugs) {
      fs.copyFileSync(defaultSource, path.join(publicOgDir, `${slug}.png`));
    }
    console.log(`Successfully generated OG images for all other ${slugs.length} calculators.`);
  } catch (err) {
    console.error('Error during OG image setup:', err);
  }
}

setup();
