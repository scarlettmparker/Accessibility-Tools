// Mock for Button component
export const mockButton = ({
  children,
  onClick,
  title,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string }) => (
  <button
    onClick={onClick}
    title={title}
    {...props}
    data-testid={`button-${title}`}
  >
    {children}
  </button>
);

// Mock for Slot component
export const mockSlot = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & React.PropsWithChildren) => (
  <div className={className} data-testid={`slot-${className}`} {...props}>
    {children}
  </div>
);

// Setup mocks
jest.mock("@/components/button", () => ({
  __esModule: true,
  default: mockButton,
}));

jest.mock("@/components/slot", () => ({
  __esModule: true,
  default: mockSlot,
}));
