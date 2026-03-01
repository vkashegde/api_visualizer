export interface LifecycleStage {
  name: string;
  label: string;
  color: string;
  duration: number;
  status: 'pending' | 'in-progress' | 'completed';
  timestamp?: number;
}

export interface LifecycleData {
  url: string;
  totalTime: number;
  stages: LifecycleStage[];
  logs: string[];
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    size: number;
  };
  error?: string;
}

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  body?: string;
  headers?: Record<string, string>;
}

export class APITracker {
  private readonly defaultStages: LifecycleStage[] = [
    { name: 'dns', label: 'DNS Lookup', color: 'dns', duration: 0, status: 'pending' },
    { name: 'tcp', label: 'TCP Handshake', color: 'tcp', duration: 0, status: 'pending' },
    { name: 'tls', label: 'TLS Handshake', color: 'tls', duration: 0, status: 'pending' },
    { name: 'req', label: 'HTTP Request', color: 'req', duration: 0, status: 'pending' },
    { name: 'res', label: 'HTTP Response', color: 'res', duration: 0, status: 'pending' },
    { name: 'render', label: 'Browser Render', color: 'render', duration: 0, status: 'pending' },
  ];

  private stages: LifecycleStage[] = [];
  private logs: string[] = [];
  private onUpdate?: (data: LifecycleData) => void;

  constructor(onUpdate?: (data: LifecycleData) => void) {
    this.onUpdate = onUpdate;
  }

  async track(url: string, config: RequestConfig = { method: 'GET' }): Promise<LifecycleData> {
    this.reset();
    
    // Filter out TLS stage for HTTP URLs
    const isHttps = url.startsWith('https://');
    if (!isHttps) {
      this.stages = this.stages.filter(s => s.name !== 'tls');
    }
    
    // Send initial update with all stages in pending state
    this.notifyUpdate();
    // Add delay to show initial state
    await this.addDelay(500);
    const startTime = performance.now();

    try {
      // Track DNS Lookup (estimated - we can't measure this directly)
      await this.simulateStage('dns', 50, 150);
      await this.addDelay(200);
      
      // Track TCP Handshake (estimated)
      await this.simulateStage('tcp', 30, 100);
      await this.addDelay(200);
      
      // Track TLS Handshake (only for HTTPS)
      if (isHttps) {
        await this.simulateStage('tls', 50, 200);
        await this.addDelay(200);
      }
      
      // Track HTTP Request
      await this.simulateStage('req', 10, 50);
      await this.addDelay(100);
      
      // Make actual HTTP request
      const resStart = performance.now();
      const resStage = this.stages.find(s => s.name === 'res');
      if (resStage) {
        resStage.status = 'in-progress';
        resStage.timestamp = Date.now();
        this.addLog(`[RES] HTTP Response`);
        this.notifyUpdate();
      }
      
      const response = await this.makeRequest(url, config);
      
      const resDuration = performance.now() - resStart;
      if (resStage) {
        resStage.duration = Math.round(resDuration);
        resStage.status = 'completed';
        this.notifyUpdate();
      }
      
      await this.addDelay(200);
      
      // Track Browser Render (simulated)
      await this.simulateStage('render', 50, 150);

      const totalTime = Math.round(performance.now() - startTime);
      
      // Clone response to read body without consuming original
      const clonedResponse = response.clone();
      const responseData = await this.parseResponse(clonedResponse);
      const responseSize = await this.getResponseSize(response.clone());
      
      return {
        url,
        totalTime,
        stages: this.stages,
        logs: this.logs,
        response: {
          status: response.status,
          statusText: response.statusText,
          headers: this.parseHeaders(response.headers),
          data: responseData,
          size: responseSize,
        },
      };
    } catch (error: any) {
      const totalTime = Math.round(performance.now() - startTime);
      
      // Mark response stage as failed if it was in progress
      const resStage = this.stages.find(s => s.name === 'res');
      if (resStage && resStage.status === 'in-progress') {
        resStage.status = 'completed';
        this.notifyUpdate();
      }
      
      let errorMessage = 'Request failed';
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error: Unable to connect. This might be a CORS issue or the server is unreachable.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      this.addLog(`[ERROR] ${errorMessage}`);
      
      return {
        url,
        totalTime,
        stages: this.stages,
        logs: this.logs,
        error: errorMessage,
      };
    }
  }

  private async makeRequest(url: string, config: RequestConfig): Promise<Response> {
    const requestOptions: RequestInit = {
      method: config.method,
      headers: {
        ...config.headers,
      },
    };

    // Only add Content-Type for methods that typically have bodies
    if (config.body && (config.method === 'POST' || config.method === 'PUT' || config.method === 'PATCH')) {
      if (!requestOptions.headers || !('Content-Type' in requestOptions.headers)) {
        requestOptions.headers = {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        };
      }
      requestOptions.body = config.body;
    }

    const response = await fetch(url, requestOptions);
    
    // Check if response is ok, but don't throw - we want to show error responses
    return response;
  }

  private parseHeaders(headers: Headers): Record<string, string> {
    const parsed: Record<string, string> = {};
    headers.forEach((value, key) => {
      parsed[key] = value;
    });
    return parsed;
  }

  private async parseResponse(response: Response): Promise<any> {
    try {
      const contentType = response.headers.get('content-type') || '';
      const text = await response.text();
      
      if (!text) {
        return null;
      }
      
      if (contentType.includes('application/json')) {
        try {
          return JSON.parse(text);
        } catch {
          return text;
        }
      } else if (contentType.includes('text/') || contentType.includes('application/xml')) {
        return text;
      } else {
        return `[Non-text response: ${contentType || 'unknown type'}]`;
      }
    } catch (error) {
      return '[Error parsing response]';
    }
  }

  private async getResponseSize(response: Response): Promise<number> {
    try {
      const blob = await response.blob();
      return blob.size;
    } catch {
      // Fallback: estimate from content-length header
      const contentLength = response.headers.get('content-length');
      return contentLength ? parseInt(contentLength, 10) : 0;
    }
  }

  private async simulateStage(
    name: string,
    minDuration: number,
    maxDuration: number
  ): Promise<void> {
    const stage = this.stages.find(s => s.name === name);
    if (!stage) return;

    // Set stage to in-progress
    stage.status = 'in-progress';
    stage.timestamp = Date.now();
    this.addLog(`[${this.getStagePrefix(name)}] ${stage.label}`);
    this.notifyUpdate();

    // Wait a bit to show the in-progress state
    await this.addDelay(200);

    const duration = Math.random() * (maxDuration - minDuration) + minDuration;
    
    await new Promise(resolve => setTimeout(resolve, duration));

    stage.duration = Math.round(duration);
    stage.status = 'completed';
    this.notifyUpdate();
    
    // Small delay after completion to show the completed state
    await this.addDelay(200);
  }

  private async addDelay(ms: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private getStagePrefix(name: string): string {
    const prefixes: Record<string, string> = {
      dns: 'DNS',
      tcp: 'TCP',
      tls: 'TLS',
      req: 'REQ',
      res: 'RES',
      render: 'RND',
    };
    return prefixes[name] || name.toUpperCase();
  }

  private addLog(message: string): void {
    this.logs.push(message);
  }

  private notifyUpdate(): void {
    if (this.onUpdate) {
      const totalTime = this.stages
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + s.duration, 0);
      
      this.onUpdate({
        url: '',
        totalTime,
        stages: this.stages.map(s => ({ ...s })),
        logs: [...this.logs],
      });
    }
  }

  private reset(): void {
    // Restore default stages
    this.stages = this.defaultStages.map(s => ({
      ...s,
      duration: 0,
      status: 'pending' as const,
      timestamp: undefined,
    }));
    this.logs = [];
  }
}
