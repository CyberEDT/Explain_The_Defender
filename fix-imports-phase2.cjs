const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, searchRegex, replaceWith) {
    if (!fs.existsSync(filePath)) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    content = content.replace(searchRegex, replaceWith);
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

// 1. App.tsx
const appPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');
appContent = appContent.replace(/from '\.\/pages\/Home\/Home'/g, "from './features/core/pages/Home'");
appContent = appContent.replace(/from '\.\/pages\/AnalysisDashboard\/AnalysisDashboard'/g, "from './features/analysis/pages/AnalysisDashboard'");
appContent = appContent.replace(/from '\.\/pages\/DefenseChain\/DefenseChainPage'/g, "from './features/core/pages/DefenseChainPage'");
appContent = appContent.replace(/from '\.\/pages\/InvestigationWorkbench\/InvestigationWorkbench'/g, "from './features/investigate/pages/InvestigationWorkbench'");
appContent = appContent.replace(/from '\.\/pages\/Playbooks\/PlaybooksPage'/g, "from './features/playbooks/pages/PlaybooksPage'");
appContent = appContent.replace(/from '\.\/pages\/MitreExplorer\/MitreExplorer'/g, "from './features/mitre/pages/MitreExplorer'");
appContent = appContent.replace(/from '\.\/pages\/IncidentReports\/IncidentReports'/g, "from './features/reports/pages/IncidentReports'");
appContent = appContent.replace(/from '\.\/pages\/TacticsExplorer\/TacticsExplorer'/g, "from './features/knowledge-base/pages/TacticsExplorer'");
appContent = appContent.replace(/from '\.\/pages\/DocsHub\/DocsHub'/g, "from './features/docs/pages/DocsHub'");
appContent = appContent.replace(/from '\.\/pages\/PlatformStatus\/PlatformStatus'/g, "from './features/status/pages/PlatformStatus'");
fs.writeFileSync(appPath, appContent);

// 2. Fix component imports in Pages
const fixImportsInFile = (file) => {
    let p = path.join(__dirname, file);
    if (!fs.existsSync(p)) return;
    
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace components/dashboard with features/core/components
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/components\/dashboard\//g, "'../../core/components/");
    // Replace components/investigation with features/investigate/components
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/components\/investigation\//g, "'../../investigate/components/");
    // Replace components/reports with features/reports/components
    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/components\/reports\//g, "'../../reports/components/");

    fs.writeFileSync(p, content);
};

const filesToFix = [
    'src/features/analysis/pages/AnalysisDashboard.tsx',
    'src/features/core/pages/Home.tsx',
    'src/features/investigate/pages/InvestigationWorkbench.tsx',
    'src/features/reports/pages/IncidentReports.tsx'
];

filesToFix.forEach(fixImportsInFile);
