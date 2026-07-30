import { SVGProps } from 'react';

export function BrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M14 25V11l18 13 18-13v14"
        stroke="var(--color-primary)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 27.5c0-2.4 2.2-4.2 4.6-3.7a94 94 0 0 0 38.8 0c2.4-.5 4.6 1.3 4.6 3.7C56 43.2 45.3 56 32 56S8 43.2 8 27.5Z"
        fill="var(--color-primary)"
      />
      <path
        d="m23 40 6 6 12-14"
        stroke="#F4B740"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
