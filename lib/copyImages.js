import fs from 'fs';
import path from 'path';

export function copyGeneratedImages() {
  if (typeof window !== 'undefined') return;

  const srcDir = 'C:/Users/samir/.gemini/antigravity-ide/brain/a94aae0f-08bc-42cd-a07b-8b8df5cdbb9c';
  const destDir = path.join(process.cwd(), 'public', 'images');

  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const filesToCopy = [
    { src: 'ingest_stage_1784790310991.png', dest: 'ingest.png' },
    { src: 'analyze_stage_1784790325267.png', dest: 'analyze.png' },
    { src: 'insight_stage_1784790338940.png', dest: 'insight.png' },
  ];

  filesToCopy.forEach((file) => {
    const srcPath = path.join(srcDir, file.src);
    const destPath = path.join(destDir, file.dest);

    if (fs.existsSync(srcPath)) {
      try {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied ${file.src} to ${file.dest}`);
      } catch (err) {
        console.error(`Failed to copy ${file.src}:`, err);
      }
    } else {
      console.warn(`Source file not found: ${srcPath}`);
    }
  });
}
