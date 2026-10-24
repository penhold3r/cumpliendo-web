import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type LtElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
  [attr: string]: unknown;
};

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'lt-icon': LtElementProps;
    }
  }
}
