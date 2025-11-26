const fs = require('fs');

let content = fs.readFileSync('src/app/(admin)/admin/courses/actions.ts', 'utf8');

// Add description to the update query
content = content.replace(
    /title: title,\r\n      video_url: video_url\r\n    \}\)/,
    "title: title,\r\n      video_url: video_url,\r\n      description: description || null\r\n    })"
);

fs.writeFileSync('src/app/(admin)/admin/courses/actions.ts', content, 'utf8');
console.log('File updated successfully!');
