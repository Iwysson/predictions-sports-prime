import { Fragment, type ReactNode } from "react";

function inlineMarkdown(text: string): ReactNode[] {
  const parts = text.replace(/\s+\|\s+/g, " · ").split("**");
  return parts.map((part, index) =>
    index % 2 === 1
      ? <strong key={index}>{part}</strong>
      : <Fragment key={index}>{part}</Fragment>
  );
}

function tableCells(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function MarkdownTable({ lines }: { lines: string[] }) {
  const rows = lines
    .filter((line, index) => index !== 1 || !tableCells(line).every((cell) => /^:?-{3,}:?$/.test(cell)))
    .map(tableCells);
  const [head = [], ...body] = rows;
  return (
    <div className="editorial-statistical-core">
      <table>
        <thead><tr>{head.map((cell, index) => <th key={index}>{inlineMarkdown(cell)}</th>)}</tr></thead>
        <tbody>{body.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{inlineMarkdown(cell)}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}


function stripStructuredStatisticalCore(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output: string[] = [];
  let skipping = false;

  for (const line of lines) {
    if (/^#{1,6}\s+Statistical Core Predictions-Sports-Prime\s*$/i.test(line.trim())) {
      skipping = true;
      continue;
    }
    if (skipping) {
      if (!line.trim() || line.trim().startsWith("|")) continue;
      skipping = false;
    }
    output.push(line);
  }

  return output.join("\n").replace(/\n{3,}/g, "\n\n").trim();
}

function MarkdownAnalysis({ markdown, hideSensitiveSnippets = false }: { markdown: string; hideSensitiveSnippets?: boolean }) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const blocks: ReactNode[] = [];
  let paragraph: string[] = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = paragraph.join(" ").trim();
    if (text === "**Statistical Core**") {
      blocks.push(<h2 key={`block-${blocks.length}`}>{inlineMarkdown(text)}</h2>);
    } else {
      const sensitive = hideSensitiveSnippets && /\*\*(?:Final )?Prediction:\*\*|\*\*(?:Published )?Odds:\*\*/i.test(text);
      blocks.push(<p key={`block-${blocks.length}`} data-nosnippet={sensitive ? "" : undefined}>{inlineMarkdown(text)}</p>);
    }
    paragraph = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim()) {
      flushParagraph();
      continue;
    }
    if (/^#{1,6}$/.test(line.trim())) {
      flushParagraph();
      continue;
    }
    if (line.trim().startsWith("|")) {
      flushParagraph();
      const table: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("|")) {
        table.push(lines[index]);
        index += 1;
      }
      index -= 1;
      blocks.push(<MarkdownTable key={`block-${blocks.length}`} lines={table} />);
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const level = Math.min(heading[1].length + 1, 4);
      const content = inlineMarkdown(heading[2]);
      blocks.push(level === 2
        ? <h2 key={`block-${blocks.length}`}>{content}</h2>
        : level === 3
          ? <h3 key={`block-${blocks.length}`}>{content}</h3>
          : <h4 key={`block-${blocks.length}`}>{content}</h4>);
      continue;
    }
    paragraph.push(line.trim());
  }
  flushParagraph();
  return <>{blocks}</>;
}

export function EditorialAnalysis({ analysis, format, hideSensitiveSnippets = false }: { analysis: string[]; format?: "markdown"; hideSensitiveSnippets?: boolean }) {
  if (format === "markdown") {
    return <MarkdownAnalysis markdown={stripStructuredStatisticalCore(analysis.join("\n\n"))} hideSensitiveSnippets={hideSensitiveSnippets} />;
  }
  return <>{analysis.map((paragraph, index) => <p key={index} data-nosnippet={hideSensitiveSnippets && /prediction|odds/i.test(paragraph) ? "" : undefined}>{paragraph}</p>)}</>;
}
