import React from "react";

const MarkdownRenderer = ({ content = '' }) => {    
    const lines = content?.split('\n') || [];
    
    return (
      <div>
        {lines.map((line, index) => {
          if (line.match(/!\[.*?\]\(.*?\)/)) {
            const url = line.match(/\((.*?)\)/)[1];
            return (
              <div key={index} className="markdown-image">
                  <img
                      src={url}  // 실제 URL 사용
                      alt="content"
                      style={{ maxWidth: '100%' }}
                  />
              </div>
            );
          }
          
          if (line.startsWith('# ')) {
            return <h1 key={index}>{line.slice(2)}</h1>;
          }
          if (line.startsWith('## ')) {
            return <h2 key={index}>{line.slice(3)}</h2>;
          }
          if (line.startsWith('### ')) {
            return <h3 key={index}>{line.slice(4)}</h3>;
          }
          
          line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
          line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
          line = line.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
          
          return line.trim() ? (
            <p 
              key={index} 
              dangerouslySetInnerHTML={{ __html: line }}
            />
          ) : <br key={index} />;
        })}
      </div>
    );
};

export default MarkdownRenderer;