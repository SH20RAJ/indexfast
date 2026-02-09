
import React from 'react';
import Link from 'next/link';

interface ContentRendererProps {
  content: string;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  // Split content by double newlines to handle paragraphs
  // This is a naive parser but sufficient for the requested "high quality" look without deps
  const blocks = content.split(/\n\n+/);

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code Blocks (```language ... ```)
        if (trimmed.startsWith('```')) {
            const lines = trimmed.split('\n');
            const languageLine = lines[0];
            const language = languageLine.replace('```', '').trim() || 'text';
            const code = lines.slice(1, -1).join('\n');
            
            return (
                <div key={index} className="not-prose my-6 rounded-xl overflow-hidden bg-[#1d1f21] border border-zinc-800 shadow-xl">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#2d2f31] border-b border-zinc-700">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                        <span className="text-xs text-zinc-400 font-mono uppercase">{language}</span>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                        <code className={`language-${language}`}>{code}</code>
                    </pre>
                </div>
            );
        }

        // Headers
        if (trimmed.startsWith('# ')) {
            return <h2 key={index} className="text-3xl font-bold text-white mt-12 mb-6 scroll-mt-24">{parseInline(trimmed.replace('# ', ''))}</h2>;
        }
        if (trimmed.startsWith('## ')) {
            return <h2 key={index} className="text-2xl font-bold text-white mt-10 mb-4 scroll-mt-24">{parseInline(trimmed.replace('## ', ''))}</h2>;
        }
        if (trimmed.startsWith('### ')) {
            return <h3 key={index} className="text-xl font-bold text-white mt-8 mb-3 scroll-mt-24">{parseInline(trimmed.replace('### ', ''))}</h3>;
        }

        // Lists (Unordered)
        if (trimmed.startsWith('- ')) {
            const items = trimmed.split('\n').filter(line => line.startsWith('- '));
            return (
                <ul key={index} className="list-disc pl-6 space-y-2 text-zinc-300">
                    {items.map((item, i) => (
                        <li key={i}>{parseInline(item.replace('- ', ''))}</li>
                    ))}
                </ul>
            );
        }
        
        // Lists (Ordered) - Handle simple 1. 2. 3. 
        if (/^\d+\.\s/.test(trimmed)) {
             const items = trimmed.split('\n');
             return (
                 <ol key={index} className="list-decimal pl-6 space-y-2 text-zinc-300">
                     {items.map((item, i) => (
                         <li key={i}>{parseInline(item.replace(/^\d+\.\s/, ''))}</li>
                     ))}
                 </ol>
             )
        }

        // Blockquotes
        if (trimmed.startsWith('> ')) {
            return (
                <blockquote key={index} className="border-l-4 border-blue-500 pl-4 italic text-zinc-400 my-6 bg-blue-500/5 p-4 rounded-r-lg">
                    {parseInline(trimmed.replace(/> /g, ''))}
                </blockquote>
            );
        }
        
        // Tables (Primitive support for markdown tables)
        if (trimmed.includes('|') && trimmed.includes('---')) {
             const rows = trimmed.split('\n').filter(r => r.trim() !== '');
             // Logic to parse table would be complex here, lets skip complex table parsing for now or render as pre if it fails
             // Attempt simple render:
             const header = rows[0].split('|').filter(c => c.trim());
             const bodyRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()));
             
             if (header.length > 0) {
                 return (
                     <div key={index} className="overflow-x-auto my-8 border border-zinc-800 rounded-lg">
                         <table className="w-full text-left text-sm">
                             <thead className="bg-zinc-900/50 text-zinc-200">
                                 <tr>
                                     {header.map((h, i) => <th key={i} className="p-3 font-semibold border-b border-zinc-800">{parseInline(h.trim())}</th>)}
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-zinc-800/50">
                                 {bodyRows.map((row, i) => (
                                     <tr key={i} className="hover:bg-zinc-900/30 transition-colors">
                                         {row.map((cell, j) => <td key={j} className="p-3 text-zinc-400">{parseInline(cell.trim())}</td>)}
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                 )
             }
        }

        // Regular Paragraph
        // Check for "Note:" style alerts
        if (trimmed.startsWith('*Note:') || trimmed.startsWith('Note:')) {
             return (
                 <div key={index} className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-blue-200 text-sm my-6 flex items-start gap-3">
                     <span className="text-xl">💡</span>
                     <div>{parseInline(trimmed.replace(/^\*?Note:\s*/, ''))}</div>
                 </div>
             )
        }

        return <p key={index} className="text-zinc-300 leading-relaxed text-lg mb-6">{parseInline(trimmed)}</p>;
      })}
    </div>
  );
}

// Helper to parse inline markdown: **bold**, *italic*, `code`, [link](url)
function parseInline(text: string): React.ReactNode {
    if (!text) return null;

    // We can use a simple regex split approach usually, but React nodes are better.
    // Let's do a rigorous sequential replacement strategy or regex match.
    // Given the constraints, a simple regex split for the most common elements is safest.
    
    // 1. Code: `code`
    const parts = text.split(/(`[^`]+`)/);
    
    return parts.map((part, i) => {
        if (part.startsWith('`') && part.endsWith('`')) {
            return <code key={i} className="bg-zinc-800 text-blue-300 px-1.5 py-0.5 rounded text-sm font-mono border border-zinc-700">{part.slice(1, -1)}</code>;
        }
        
        // 2. Bold: **text**
        return parseBold(part);
    });
}

function parseBold(text: string): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
             return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>;
        }
        return parseItalic(part);
    });
}

function parseItalic(text: string): React.ReactNode {
     const parts = text.split(/(\*[^*]+\*)/); // Matches *italic* but not **bold** (already processed) - simplistic
     return parts.map((part, i) => {
        // Need to be careful not to match * if it was part of bold but escaped, but here we assume simple input
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
             return <em key={i} className="italic text-zinc-100">{part.slice(1, -1)}</em>;
        }
        return parseLink(part);
    });
}

function parseLink(text: string): React.ReactNode {
    // Regex for [text](url)
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            elements.push(text.substring(lastIndex, match.index));
        }
        elements.push(
            <Link key={match.index} href={match[2]} className="text-blue-400 hover:text-blue-300 hover:underline decoration-blue-500/30 underline-offset-2">
                {match[1]}
            </Link>
        );
        lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
        elements.push(text.substring(lastIndex));
    }

    return elements.length > 0 ? <>{elements}</> : text;
}
