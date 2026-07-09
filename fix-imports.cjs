const fs = require('fs');
const path = require('path');

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // In src/features/*/(pages|components)/...
            // If they were originally in src/pages/Dir or src/components/Dir
            // the depth increases by 1 (e.g. from src/pages/Investigate/ to src/features/investigate/pages/)
            
            // Wait, src/pages/InvestigationWorkbench/InvestigationWorkbench.tsx (depth 3)
            // is now src/features/investigate/pages/InvestigationWorkbench.tsx (depth 4)
            
            // We just need to replace `../../` with `../../../` for imports going to src/* (like types, data, core, knowledge-base)
            // But we must be careful not to break imports that were already correct or relative within the folder.
            
            // Let's just do a regex replace for import strings
            const importRegex = /from\s+['"]([^'"]+)['"]/g;
            
            content = content.replace(importRegex, (match, p1) => {
                if (p1.startsWith('../../')) {
                    // It was originally going up 2 levels (e.g. from src/pages/AnalysisDashboard to src/)
                    // Now it's in src/features/analysis/pages/ (depth 4 vs depth 3), so it needs to go up 3 levels
                    
                    // Actually, let's just make it go up 3 levels
                    const newPath = '../' + p1;
                    return `from '${newPath}'`;
                }
                return match;
            });
            
            if (content !== fs.readFileSync(fullPath, 'utf8')) {
                fs.writeFileSync(fullPath, content);
                console.log(`Updated imports in ${fullPath}`);
            }
        }
    }
}

processDirectory(path.join(__dirname, 'src', 'features'));
