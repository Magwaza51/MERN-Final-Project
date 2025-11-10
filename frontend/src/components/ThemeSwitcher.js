import React, { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');

  const themes = [
    {
      id: 'dark',
      name: 'Dark Gradient',
      description: 'Modern dark theme with purple gradients',
      preview: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      cssFile: 'index.css'
    },
    {
      id: 'medical',
      name: 'Medical Green',
      description: 'Professional medical theme with sidebar',
      preview: 'linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)',
      cssFile: 'themes/medical-green-theme.css'
    }
  ];

  const switchTheme = (themeId) => {
    // Remove existing theme stylesheets
    const existingThemes = document.querySelectorAll('link[data-theme]');
    existingThemes.forEach(link => link.remove());

    // Add new theme stylesheet
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `/src/${theme.cssFile}`;
      link.setAttribute('data-theme', themeId);
      document.head.appendChild(link);
      
      setCurrentTheme(themeId);
      localStorage.setItem('selected-theme', themeId);

      // Reload the page to apply theme changes
      setTimeout(() => {
        window.location.reload();
      }, 100);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('selected-theme') || 'dark';
    setCurrentTheme(savedTheme);
  }, []);

  return (
    <div className="theme-switcher">
      <h3 className="theme-title">🎨 Choose Your Theme</h3>
      <p className="theme-description">Select a theme that matches your style</p>
      
      <div className="theme-grid">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => switchTheme(theme.id)}
          >
            <div 
              className="theme-preview"
              style={{ background: theme.preview }}
            >
              <div className="preview-content">
                <div className="preview-header"></div>
                <div className="preview-body">
                  <div className="preview-card"></div>
                  <div className="preview-card"></div>
                </div>
              </div>
            </div>
            
            <div className="theme-info">
              <h4 className="theme-name">{theme.name}</h4>
              <p className="theme-desc">{theme.description}</p>
              
              {currentTheme === theme.id && (
                <div className="active-badge">✓ Active</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .theme-switcher {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 30px;
          margin: 20px 0;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }

        .theme-title {
          font-size: 1.8rem;
          font-weight: 700;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .theme-description {
          color: #666;
          margin-bottom: 25px;
          font-size: 1rem;
        }

        .theme-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
        }

        .theme-card {
          border: 2px solid #e9ecef;
          border-radius: 16px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          background: white;
        }

        .theme-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
          border-color: #667eea;
        }

        .theme-card.active {
          border-color: #56ab2f;
          box-shadow: 0 8px 30px rgba(86, 171, 47, 0.3);
        }

        .theme-preview {
          height: 150px;
          position: relative;
          overflow: hidden;
        }

        .preview-content {
          position: absolute;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .preview-header {
          height: 20px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }

        .preview-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .preview-card {
          height: 25px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 6px;
        }

        .theme-info {
          padding: 20px;
          position: relative;
        }

        .theme-name {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: #333;
        }

        .theme-desc {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0;
        }

        .active-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #56ab2f;
          color: white;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .theme-grid {
            grid-template-columns: 1fr;
          }
          
          .theme-switcher {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default ThemeSwitcher;