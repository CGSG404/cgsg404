
import { Component, ErrorInfo, ReactNode } from 'react';
import { SimpleErrorPage } from './ErrorPage';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Uncaught error:', error, errorInfo);
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SimpleErrorPage 
          error={this.state.error} 
          resetError={this.handleReset} 
        />
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<T>(Component: React.ComponentType<T>, fallback?: ReactNode) {
  return function WithErrorBoundary(props: T) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...(props as any)} />
      </ErrorBoundary>
    );
  };
}
