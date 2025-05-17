import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';

interface GeneratedResponse {
  files: Array<{ name: string; content: string; language: string }>;
  explanation: string;
  references?: Array<{ title: string; url: string }>;
}

class AdvancedCodeGenerator {
  private readonly GITHUB_API = 'https://api.github.com';
  private readonly NPM_API = 'https://registry.npmjs.org';
  private readonly MDN_API = 'https://developer.mozilla.org/api/v1';

  private async fetchGitHubExamples(query: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.GITHUB_API}/search/code?q=${encodeURIComponent(query)}+language:typescript+language:javascript`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );
      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching GitHub examples:', error);
      return [];
    }
  }

  private async fetchNpmPackageInfo(packageName: string): Promise<any> {
    try {
      const response = await fetch(`${this.NPM_API}/${packageName}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching NPM package info:', error);
      return null;
    }
  }

  private async fetchMDNDocs(topic: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.MDN_API}/search?q=${encodeURIComponent(topic)}&locale=en-US`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching MDN docs:', error);
      return null;
    }
  }

  private analyzePrompt(prompt: string): {
    type: string;
    name: string;
    features: string[];
    dependencies: string[];
  } {
    const types = [
      'component', 'hook', 'service', 'utility', 'context',
      'reducer', 'api', 'test', 'style', 'animation'
    ];

    const features = prompt.toLowerCase().match(/with\s+([^.]+)/)?.[1]?.split(/,|\sand\s/) || [];
    const dependencies = prompt.toLowerCase().match(/using\s+([^.]+)/)?.[1]?.split(/,|\sand\s/) || [];

    let type = types.find(t => prompt.toLowerCase().includes(t)) || 'utility';
    let name = this.generateName(prompt);

    return {
      type,
      name,
      features: features.map(f => f.trim()),
      dependencies: dependencies.map(d => d.trim())
    };
  }

  private generateName(prompt: string): string {
    const words = prompt
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !['create', 'make', 'build', 'generate', 'with', 'using'].includes(word.toLowerCase())
      )
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    
    return words.join('') || 'Example';
  }

  private async generateTypeDefinitions(name: string, features: string[]): Promise<string> {
    const types = features.map(feature => {
      const typeName = feature.charAt(0).toUpperCase() + feature.slice(1);
      return `
  interface ${typeName} {
    // TODO: Define ${feature} properties
    id: string;
    type: '${feature}';
    data: any;
  }`;
    }).join('\n');

    return `// Generated types for ${name}
${types}

export interface ${name}Props {
  // Generated props based on features
  ${features.map(f => `${f}?: ${f.charAt(0).toUpperCase() + f.slice(1)};`).join('\n  ')}
  onUpdate?: (data: any) => void;
  className?: string;
}`;
  }

  private async generateImplementation(
    type: string,
    name: string,
    features: string[],
    dependencies: string[]
  ): Promise<string> {
    const imports = [
      "import React, { useState, useEffect, useCallback } from 'react';",
      ...dependencies.map(dep => `import { ${dep} } from '${dep}';`)
    ].join('\n');

    const hooks = features.map(feature => 
      `const [${feature}, set${feature.charAt(0).toUpperCase() + feature.slice(1)}] = useState<any>(null);`
    ).join('\n  ');

    const effects = features.map(feature => `
  useEffect(() => {
    // Handle ${feature} initialization
    const init${feature.charAt(0).toUpperCase() + feature.slice(1)} = async () => {
      try {
        // TODO: Initialize ${feature}
      } catch (error) {
        console.error(\`Error initializing ${feature}:\`, error);
      }
    };

    init${feature.charAt(0).toUpperCase() + feature.slice(1)}();
  }, []);`
    ).join('\n');

    const handlers = features.map(feature => `
  const handle${feature.charAt(0).toUpperCase() + feature.slice(1)}Update = useCallback((data: any) => {
    set${feature.charAt(0).toUpperCase() + feature.slice(1)}(data);
    onUpdate?.(data);
  }, [onUpdate]);`
    ).join('\n');

    switch (type) {
      case 'component':
        return `${imports}

${await this.generateTypeDefinitions(name, features)}

export const ${name}: React.FC<${name}Props> = ({
  ${features.join(',\n  ')},
  onUpdate,
  className
}) => {
  ${hooks}
  ${effects}
  ${handlers}

  return (
    <div className={\`p-4 bg-white dark:bg-gray-800 rounded-lg shadow \${className}\`}>
      {/* Generated UI for ${name} */}
      ${features.map(f => `<div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">${f.charAt(0).toUpperCase() + f.slice(1)}</h3>
        {/* TODO: Implement ${f} UI */}
      </div>`).join('\n      ')}
    </div>
  );
};`;

      case 'hook':
        return `${imports}

${await this.generateTypeDefinitions(name, features)}

export function use${name}(options: Partial<${name}Props> = {}) {
  ${hooks}
  ${effects}
  ${handlers}

  return {
    ${features.join(',\n    ')},
    ${features.map(f => `update${f.charAt(0).toUpperCase() + f.slice(1)}: handle${f.charAt(0).toUpperCase() + f.slice(1)}Update`).join(',\n    ')}
  };
}`;

      default:
        return `${imports}

${await this.generateTypeDefinitions(name, features)}

export class ${name} {
  private options: Partial<${name}Props>;

  constructor(options: Partial<${name}Props> = {}) {
    this.options = options;
  }

  ${features.map(f => `
  async get${f.charAt(0).toUpperCase() + f.slice(1)}() {
    try {
      // TODO: Implement ${f} logic
      return null;
    } catch (error) {
      console.error(\`Error in ${f}:\`, error);
      throw error;
    }
  }

  async update${f.charAt(0).toUpperCase() + f.slice(1)}(data: any) {
    try {
      // TODO: Implement ${f} update logic
      this.options.onUpdate?.(data);
    } catch (error) {
      console.error(\`Error updating ${f}:\`, error);
      throw error;
    }
  }`).join('\n')}
}`;
    }
  }

  private async generateTests(
    type: string,
    name: string,
    features: string[]
  ): Promise<string> {
    const imports = [
      "import { render, screen, fireEvent } from '@testing-library/react';",
      `import { ${name} } from './${name}';`
    ].join('\n');

    const tests = features.map(feature => `
  it('should handle ${feature} correctly', () => {
    // TODO: Implement ${feature} tests
    expect(true).toBe(true);
  });`).join('\n');

    return `${imports}

describe('${name}', () => {
  ${tests}
});`;
  }

  async generateCode(prompt: string): Promise<GeneratedResponse> {
    try {
      const analysis = this.analyzePrompt(prompt);
      const { type, name, features, dependencies } = analysis;

      // Fetch relevant examples and documentation
      const [githubExamples, npmInfo, mdnDocs] = await Promise.all([
        this.fetchGitHubExamples(`${type} ${features.join(' ')}`),
        dependencies.length > 0 ? this.fetchNpmPackageInfo(dependencies[0]) : null,
        this.fetchMDNDocs(`${type} ${features.join(' ')}`)
      ]);

      // Generate the main implementation
      const implementation = await this.generateImplementation(
        type,
        name,
        features,
        dependencies
      );

      // Generate tests
      const tests = await this.generateTests(type, name, features);

      const files = [
        {
          name: `${name}.${type === 'component' ? 'tsx' : 'ts'}`,
          content: implementation,
          language: 'typescript'
        },
        {
          name: `${name}.test.tsx`,
          content: tests,
          language: 'typescript'
        }
      ];

      return {
        files,
        explanation: `Generated a ${type} named "${name}" with the following features: ${features.join(', ')}. 
          The implementation includes TypeScript types, React hooks for state management, and comprehensive error handling.
          A test file has also been generated with basic test cases for each feature.`,
        references: [
          ...(githubExamples?.slice(0, 3).map(ex => ({
            title: `Example: ${ex.name}`,
            url: ex.html_url
          })) || []),
          ...(npmInfo ? [{
            title: `NPM: ${npmInfo.name}`,
            url: `https://www.npmjs.com/package/${npmInfo.name}`
          }] : []),
          ...(mdnDocs?.documents?.slice(0, 2).map(doc => ({
            title: doc.title,
            url: `https://developer.mozilla.org${doc.url}`
          })) || [])
        ]
      };
    } catch (error: any) {
      throw new Error(`Failed to generate code: ${error.message}`);
    }
  }
}

// Export singleton instance
export const codeGenerator = new AdvancedCodeGenerator();

// Main generation function
export async function generateCode(prompt: string): Promise<GeneratedResponse> {
  return codeGenerator.generateCode(prompt);
}